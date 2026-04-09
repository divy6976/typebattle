const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = {}; // in-memory storage

const WORD_BANKS_BY_DIFFICULTY = {
  easy: [
    // 3–5 letters only; no punctuation/symbols.
    "cat",
    "dog",
    "ball",
    "jump",
    "play",
    "run",
    "walk",
    "talk",
    "read",
    "type",
    "fast",
    "slow",
    "calm",
    "safe",
    "kind",
    "good",
    "best",
    "nice",
    "cool",
    "warm",
    "home",
    "game",
    "round",
    "start",
    "learn",
    "build",
    "train",
    "focus",
    "smile",
    "brave",
    "light",
    "sound",
    "green",
    "blue",
    "white",
    "black",
    "sleep",
    "drink",
    "water",
    "stone",
    "plant",
    "grass",
    "chair",
    "table",
    "mouse",
    "clock",
    "touch",
    "press",
    "hands",
  ],
  medium: [
    // Normal words; punctuation handled by generator.
    "practice",
    "makes",
    "you",
    "faster",
    "stay",
    "focused",
    "and",
    "keep",
    "improving",
    "balance",
    "speed",
    "control",
    "timing",
    "rhythm",
    "accuracy",
    "matters",
    "mistakes",
    "happen",
    "so",
    "recover",
    "quickly",
    "take",
    "a",
    "breath",
    "then",
    "continue",
    "with",
    "steady",
    "hands",
    "and",
    "clear",
    "focus",
    "every",
    "round",
    "feels",
    "better",
    "when",
    "you",
    "stay",
    "calm",
    "under",
    "pressure",
    "small",
    "goals",
    "help",
    "build",
    "confidence",
    "over",
    "time",
  ],
  hard: [
    // Long/complex words (8+); symbols/numbers handled by generator.
    "synchronization",
    "implementation",
    "configuration",
    "instrumentation",
    "compatibility",
    "normalization",
    "serialization",
    "authorization",
    "authentication",
    "concurrency",
    "deterministic",
    "optimization",
    "resilience",
    "throughput",
    "bandwidth",
    "telemetry",
    "regression",
    "benchmarking",
    "constraint",
    "unpredictable",
    "complexity",
    "incremental",
    "architecture",
    "middleware",
    "handshake",
    "websocket",
    "validation",
    "exception",
    "integrity",
    "backpressure",
    "idempotent",
    "immutable",
    "stateful",
    "stateless",
    "encryption",
    "decryption",
    "precision",
    "consistency",
    // MixedCase / style variants (still "words")
    "multiPlayer",
    "mixedCase",
    "contextSwitching",
    "highPressure",
  ],
};
const START_COUNTDOWN_MS = 6700;
const DEFAULT_TIME_LIMIT_SEC = 60;
const ALLOWED_TIME_LIMITS = [30, 45, 60, 120];
const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"];
const PARAGRAPH_BANK_SIZE = 3;

function parseJoinPayload(payload) {
  const normalizeRoomId = (value) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, "").toUpperCase() : "";

  if (typeof payload === "string") {
    return { roomId: normalizeRoomId(payload), settings: null };
  }
  const roomId = normalizeRoomId(payload?.roomId);
  const rawDifficulty = payload?.settings?.difficulty;
  const rawTimeLimit = payload?.settings?.timeLimitSec;
  const difficulty = ALLOWED_DIFFICULTIES.includes(rawDifficulty) ? rawDifficulty : null;
  const timeLimitSec = ALLOWED_TIME_LIMITS.includes(rawTimeLimit) ? rawTimeLimit : null;
  return {
    roomId,
    settings:
      difficulty || timeLimitSec
        ? {
            difficulty: difficulty ?? "medium",
            timeLimitSec: timeLimitSec ?? DEFAULT_TIME_LIMIT_SEC,
          }
        : null,
  };
}

function randomIntInclusive(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function sampleWord(difficulty = "medium") {
  const safe = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : "medium";
  const bank = WORD_BANKS_BY_DIFFICULTY[safe] ?? WORD_BANKS_BY_DIFFICULTY.medium;
  return bank[Math.floor(Math.random() * bank.length)] ?? "typing";
}

function capitalizeFirstWord(word) {
  if (typeof word !== "string" || word.length === 0) return word;
  return word[0].toUpperCase() + word.slice(1);
}

function pickWordWithConstraints(difficulty) {
  const safe = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : "medium";
  let w = sampleWord(safe);
  let guard = 0;

  if (safe === "easy") {
    // Ensure 3–5 letters, alphabetic only.
    while ((!/^[a-z]+$/i.test(w) || w.length < 3 || w.length > 5) && guard < 100) {
      w = sampleWord(safe);
      guard += 1;
    }
    return (w || "cat").toLowerCase();
  }

  if (safe === "hard") {
    // Ensure long/complex words (8+), allow mixedCase tokens.
    while (w.length < 8 && guard < 100) {
      w = sampleWord(safe);
      guard += 1;
    }
    return w || "synchronization";
  }

  return w || "practice";
}

function maybeInsertComma(tokens, i, difficulty) {
  if (difficulty !== "medium" && difficulty !== "hard") return;
  if (i <= 0) return;
  // Light, natural commas (not after every word).
  if (i % randomIntInclusive(6, 10) === 0) {
    tokens[tokens.length - 1] = `${tokens[tokens.length - 1]},`;
  }
}

function maybeInsertHardExtras(tokens) {
  // Sprinkle numbers/symbols for hard mode.
  const extras = ["#","%","&","100%","2048","v2","v3.1"];
  const count = randomIntInclusive(1, 3);
  for (let i = 0; i < count; i += 1) {
    const idx = randomIntInclusive(1, Math.max(1, tokens.length - 2));
    const extra = extras[Math.floor(Math.random() * extras.length)];
    tokens.splice(idx, 0, extra);
  }
}

function generateParagraph(difficulty = "medium") {
  const safeDifficulty = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : "medium";
  if (safeDifficulty === "easy") {
    const wordCount = randomIntInclusive(22, 28);
    const words = [];
    for (let i = 0; i < wordCount; i += 1) {
      let w = pickWordWithConstraints("easy");
      let guard = 0;
      while (i > 0 && w === words[i - 1] && guard < 20) {
        w = pickWordWithConstraints("easy");
        guard += 1;
      }
      words.push(w);
    }
    // No punctuation for easy.
    return words.join(" ").replace(/\s+/g, " ").trim();
  }

  if (safeDifficulty === "medium") {
    const wordCount = randomIntInclusive(18, 22);
    const tokens = [];
    for (let i = 0; i < wordCount; i += 1) {
      let w = pickWordWithConstraints("medium");
      let guard = 0;
      while (i > 0 && w === tokens[tokens.length - 1] && guard < 20) {
        w = pickWordWithConstraints("medium");
        guard += 1;
      }
      tokens.push(w);
      maybeInsertComma(tokens, i, "medium");
    }
    if (tokens.length > 0) tokens[0] = capitalizeFirstWord(tokens[0]);
    const text = tokens.join(" ").replace(/\s+/g, " ").trim();
    return text.endsWith(".") ? text : `${text}.`;
  }

  // hard
  const wordCount = randomIntInclusive(8, 11);
  const tokens = [];
  for (let i = 0; i < wordCount; i += 1) {
    let w = pickWordWithConstraints("hard");
    let guard = 0;
    while (i > 0 && w === tokens[tokens.length - 1] && guard < 20) {
      w = pickWordWithConstraints("hard");
      guard += 1;
    }
    tokens.push(w);
    maybeInsertComma(tokens, i, "hard");
  }
  maybeInsertHardExtras(tokens);
  if (tokens.length > 0) tokens[0] = capitalizeFirstWord(tokens[0]);
  const text = tokens.join(" ").replace(/\s+/g, " ").trim();
  return text.endsWith(".") ? text : `${text}.`;
}

/**
 * Next paragraph for a room: always generates a fresh paragraph.
 * Mutates room.currentParagraph.
 */
function getNextParagraphForRoom(room) {
  if (!room) return generateParagraph("medium");
  const difficulty = room.settings?.difficulty ?? "medium";
  const next = generateParagraph(difficulty);
  room.currentParagraph = next;
  return next;
}

function getPlayer(room, socketId) {
  if (!room) return null;
  return room.players.find((p) => p.id === socketId) ?? null;
}

function getInitialParagraphForNewPlayer(room) {
  if (!room || !Array.isArray(room.players)) {
    return generateParagraph("medium");
  }
  if (typeof room.currentParagraph === "string" && room.currentParagraph.length > 0) {
    return room.currentParagraph;
  }
  return getNextParagraphForRoom(room);
}

function getNextParagraphForPlayer(room, socketId) {
  if (!room || !socketId) return generateParagraph("medium");
  const difficulty = room?.settings?.difficulty ?? "medium";
  if (!room.playerParagraphHistory) {
    room.playerParagraphHistory = {};
  }
  if (!Array.isArray(room.playerParagraphHistory[socketId])) {
    room.playerParagraphHistory[socketId] = [];
  }

  const history = room.playerParagraphHistory[socketId];
  if (history.length >= PARAGRAPH_BANK_SIZE) {
    history.length = 0;
  }

  let next = generateParagraph(difficulty);
  let guard = 0;
  while (history.includes(next) && guard < 100) {
    next = generateParagraph(difficulty);
    guard += 1;
  }

  if (guard >= 100) {
    history.length = 0;
    next = generateParagraph(difficulty);
  }

  history.push(next);
  return next;
}

function makeEmptyPlayerStats() {
  return {
    correctChars: 0,
    mistakes: 0,
    totalTypedChars: 0,
    accuracy: 0,
    wpm: 0,
    progress: 0,
  };
}

function sanitizeNumber(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sanitizePlayerStats(input) {
  return {
    correctChars: Math.max(0, Math.round(sanitizeNumber(input?.correctChars))),
    mistakes: Math.max(0, Math.round(sanitizeNumber(input?.mistakes))),
    totalTypedChars: Math.max(0, Math.round(sanitizeNumber(input?.totalTypedChars))),
    accuracy: Math.max(0, Math.min(100, Math.round(sanitizeNumber(input?.accuracy)))),
    wpm: Math.max(0, Math.round(sanitizeNumber(input?.wpm))),
    progress: Math.max(0, Math.min(100, sanitizeNumber(input?.progress))),
  };
}

function decideWinner(p1, p2) {
  if (!p1 || !p2) return p1?.id ?? p2?.id ?? null;

  if (p1.stats.correctChars > p2.stats.correctChars) return p1.id;
  if (p2.stats.correctChars > p1.stats.correctChars) return p2.id;

  if (p1.stats.accuracy > p2.stats.accuracy) return p1.id;
  if (p2.stats.accuracy > p1.stats.accuracy) return p2.id;

  if (p1.stats.wpm > p2.stats.wpm) return p1.id;
  if (p2.stats.wpm > p1.stats.wpm) return p2.id;

  return p1.id;
}

function clearRoomTimer(room) {
  if (room?.game?.timerHandle) {
    clearTimeout(room.game.timerHandle);
    room.game.timerHandle = null;
  }
}

function emitGameOver(roomId) {
  const room = rooms[roomId];
  if (!room || room?.game?.status !== "running") return;

  const players = room.players.slice(0, 2);
  const p1 = players[0]
    ? { id: players[0].id, stats: room.finalStats[players[0].id] ?? makeEmptyPlayerStats() }
    : null;
  const p2 = players[1]
    ? { id: players[1].id, stats: room.finalStats[players[1].id] ?? makeEmptyPlayerStats() }
    : null;

  room.game.status = "ended";
  room.game.endedAtMs = Date.now();
  clearRoomTimer(room);

  const winnerId = decideWinner(p1, p2);
  io.to(roomId).emit("game_over", {
    player1: p1,
    player2: p2,
    winnerId,
  });
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("get_room_state", (roomId) => {
    if (!roomId || typeof roomId !== "string") return;
    const room = rooms[roomId];
    if (!room) return;
    const player = getPlayer(room, socket.id);
    if (!player) return;

    socket.emit("room_update", room.players);
    socket.emit("room_paragraph", { paragraph: player.paragraph });
  });

  socket.on("join_room", (payload) => {
    const parsed = parseJoinPayload(payload);
    const roomId = parsed.roomId;
    if (!roomId) return;

    const roomExists = !!rooms[roomId];
    const canCreateRoom = !!parsed.settings;
    if (!roomExists && !canCreateRoom) {
      socket.emit("join_room_error", {
        code: "ROOM_NOT_FOUND",
        message: "Room with this code does not exist. Create a room.",
      });
      return;
    }

    socket.join(roomId);

    if (!rooms[roomId]) {
      const settings = parsed.settings ?? { difficulty: "medium", timeLimitSec: DEFAULT_TIME_LIMIT_SEC };
      rooms[roomId] = {
        settings,
        players: [],
        currentParagraph: generateParagraph(settings.difficulty),
        playerParagraphHistory: {},
        progress: {},
        finalStats: {},
        game: {
          status: "idle",
          startAtMs: null,
          endAtMs: null,
          endedAtMs: null,
          timerHandle: null,
        },
      };
    }

    const room = rooms[roomId];
    if (parsed.settings && room.players.length <= 1) {
      room.settings = {
        difficulty: parsed.settings.difficulty,
        timeLimitSec: parsed.settings.timeLimitSec,
      };
    }
    const already = room.players.some((p) => p.id === socket.id);
    if (!already) {
      room.players.push({
        id: socket.id,
        ready: false,
        // Start phase: all players in room begin with same initial paragraph.
        paragraph: getInitialParagraphForNewPlayer(room),
      });
      room.finalStats[socket.id] = makeEmptyPlayerStats();
    }
    const player = getPlayer(room, socket.id);

    // Send players list for waiting UI (keeps existing client shape)
    io.to(roomId).emit("room_update", room.players);

    // Send paragraph only to the joining player (player-specific flow)
    if (player?.paragraph) {
      socket.emit("room_paragraph", { paragraph: player.paragraph });
    }
  });

  socket.on("toggle_ready", (roomId) => {
    const room = rooms[roomId];

    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
    }

    io.to(roomId).emit("room_update", room.players);

    // check if all ready
    const allReady = room.players.length === 2 && room.players.every((p) => p.ready);

    if (allReady) {
      clearRoomTimer(room);
      const startAtMs = Date.now() + START_COUNTDOWN_MS;
      const roomDurationMs = (room?.settings?.timeLimitSec ?? DEFAULT_TIME_LIMIT_SEC) * 1000;
      const endAtMs = startAtMs + roomDurationMs;
      room.game.status = "running";
      room.game.startAtMs = startAtMs;
      room.game.endAtMs = endAtMs;
      room.game.endedAtMs = null;
      room.players.forEach((p) => {
        room.finalStats[p.id] = makeEmptyPlayerStats();
      });

      room.game.timerHandle = setTimeout(() => {
        emitGameOver(roomId);
      }, Math.max(0, endAtMs - Date.now()));

      io.to(roomId).emit("start_game", {
        startAtMs,
        endAtMs,
        difficulty: room?.settings?.difficulty ?? "medium",
        timeLimitSec: room?.settings?.timeLimitSec ?? DEFAULT_TIME_LIMIT_SEC,
      });
    }
  });

  // Real-time battle stats (authoritative backend snapshot)
  socket.on("progress-update", (payload) => {
    const roomId = payload?.roomId;
    if (!roomId || typeof roomId !== "string") return;

    const room = rooms[roomId];
    if (!room) return;

    const stats = sanitizePlayerStats(payload?.stats ?? payload);
    room.progress[socket.id] = { wpm: stats.wpm, progress: stats.progress };
    room.finalStats[socket.id] = stats;

    // Broadcast ONLY to the opponent in the same room
    socket.to(roomId).emit("opponent-update", { wpm: stats.wpm, progress: stats.progress });
  });

  socket.on("request-new-paragraph", (payload) => {
    const roomId = payload?.roomId;
    if (!roomId || typeof roomId !== "string") return;

    const room = rooms[roomId];
    if (!room) return;
    const player = getPlayer(room, socket.id);
    if (!player) return;

    const nextParagraph = getNextParagraphForPlayer(room, socket.id);
    player.paragraph = nextParagraph;

    const payloadOut = { paragraph: nextParagraph };
    // Send only to the requesting player so opponents continue their own paragraph flow.
    socket.emit("new-paragraph", payloadOut);
    socket.emit("room_paragraph", payloadOut);
  });

  socket.on("request-paragraph-batch", (payload) => {
    const roomId = payload?.roomId;
    const count = payload?.count;
    if (!roomId || typeof roomId !== "string") return;

    const room = rooms[roomId];
    if (!room) return;
    const player = getPlayer(room, socket.id);
    if (!player) return;

    const safeCount = Math.max(1, Math.min(10, Math.round(count || 1)));
    const difficulty = room?.settings?.difficulty ?? "medium";
    const paragraphs = [];
    for (let i = 0; i < safeCount; i += 1) {
      paragraphs.push(generateParagraph(difficulty));
    }
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) return;

    // Do not overwrite player.paragraph — the client may still be on an earlier prefetched
    // paragraph; only request-new-paragraph updates the authoritative current paragraph.
    socket.emit("paragraph-batch", { paragraphs });
  });

  socket.on("finalize-game", (payload) => {
    const roomId = payload?.roomId;
    if (!roomId || typeof roomId !== "string") return;
    emitGameOver(roomId);
  });

  // Backwards-compat: old event name used by earlier client builds
  socket.on("battle_update", (payload) => {
    socket.emit("server_notice", {
      type: "deprecated_event",
      message: "Client emitted 'battle_update'. Please migrate to 'progress-update'.",
    });

    const roomId = payload?.roomId;
    const wpm = payload?.wpm;
    const progress = payload?.progress;

    if (!roomId || typeof roomId !== "string") return;
    if (typeof wpm !== "number" || !Number.isFinite(wpm)) return;
    if (typeof progress !== "number" || !Number.isFinite(progress)) return;

    const room = rooms[roomId];
    if (room) {
      room.progress[socket.id] = { wpm, progress };
    }

    socket.to(roomId).emit("opponent-update", { wpm, progress });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter((p) => p.id !== socket.id);
      delete room.progress[socket.id];
      delete room.finalStats[socket.id];

      io.to(roomId).emit("room_update", room.players);

      if (room.players.length === 0) {
        clearRoomTimer(room);
        delete rooms[roomId];
      }
    }
  });
});

/** Practice mode: HTTP fetch. Same paragraph bank as sockets — single source of truth. */
app.get("/api/paragraph", (req, res) => {
  const rawDifficulty = req.query?.difficulty;
  const difficulty = ALLOWED_DIFFICULTIES.includes(rawDifficulty) ? rawDifficulty : "medium";
  const paragraph = generateParagraph(difficulty);
  res.json({ paragraph });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});