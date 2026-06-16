const { createServer } = require("node:http");
const config = require("./config");

let BOOKS = [
  {
    id: 1,
    title: "Kobzar",
    author: "Shevchenko",
    year: 1840,
  },
  {
    id: 2,
    title: "Lisova Pisnia",
    author: "Lesya Ukrainka",
    year: 1911,
  },
  {
    id: 3,
    title: "Zahar Berkut",
    author: "Ivan Franko",
    year: 1883,
  },
];

let server;
let isShuttingDown = false;

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDate(date = new Date()) {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function log(level, message) {
  console.log(`[${formatDate()}] [${level}] - - > ${message}`);
}

function logRequest(req, statusCode) {
  const isError = statusCode >= 400;

  if (config.NODE_ENV === "production" && !isError) {
    return;
  }

  const level = isError ? "ERROR" : "INFO";
  log(level, `${req.method} ${req.url} | Status: ${statusCode}`);
}

function sendJson(req, res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
  logRequest(req, statusCode);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        return resolve({});
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidYear(value) {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(value) && value > 0 && value <= currentYear;
}

function hasOnlyAllowedFields(data, allowedFields) {
  return Object.keys(data).every((field) => allowedFields.includes(field));
}

function validateBookCreate(data) {
  const allowedFields = ["title", "author", "year"];

  if (!isObject(data)) {
    return "Body must be a JSON object";
  }

  if (!hasOnlyAllowedFields(data, allowedFields)) {
    return "Only title, author and year fields are allowed";
  }

  if (!isNonEmptyString(data.title)) {
    return "Title is required and must be a non-empty string";
  }

  if (!isNonEmptyString(data.author)) {
    return "Author is required and must be a non-empty string";
  }

  if (!isValidYear(data.year)) {
    return "Year is required and must be a valid number";
  }

  return null;
}

function validateBookPatch(data) {
  const allowedFields = ["title", "author", "year"];

  if (!isObject(data)) {
    return "Body must be a JSON object";
  }

  if (Object.keys(data).length === 0) {
    return "At least one field must be provided";
  }

  if ("id" in data) {
    return "Field id cannot be updated";
  }

  if (!hasOnlyAllowedFields(data, allowedFields)) {
    return "Only title, author and year fields can be updated";
  }

  if ("title" in data && !isNonEmptyString(data.title)) {
    return "Title must be a non-empty string";
  }

  if ("author" in data && !isNonEmptyString(data.author)) {
    return "Author must be a non-empty string";
  }

  if ("year" in data && !isValidYear(data.year)) {
    return "Year must be a valid number";
  }

  return null;
}

function getIdFromPath(pathname) {
  const id = Number(pathname.split("/")[2]);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function gracefulShutdown(signal, error = null, exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  if (error) {
    log("ERROR", `${signal}: ${error.message}`);
  } else {
    log("WARN", `Received ${signal}. Graceful shutdown started`);
  }

  const timeout = setTimeout(() => {
    log("ERROR", "Server did not close in time. Force shutdown");
    process.exit(1);
  }, 10000);

  if (!server) {
    clearTimeout(timeout);
    process.exit(exitCode);
  }

  server.close((closeError) => {
    clearTimeout(timeout);

    if (closeError) {
      log("ERROR", `Server close error: ${closeError.message}`);
      process.exit(1);
    }

    log("INFO", "HTTP server closed successfully");
    process.exit(exitCode);
  });
}

server = createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === "GET" && pathname === "/health") {
      return sendJson(req, res, 200, {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      });
    }

    if (method === "GET" && pathname === "/books") {
      const author = parsedUrl.searchParams.get("author");
      let result = [...BOOKS];

      if (author) {
        result = result.filter((book) =>
          book.author.toLowerCase().includes(author.toLowerCase())
        );
      }

      return sendJson(req, res, 200, {
        count: result.length,
        items: result,
      });
    }

    if (method === "GET" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(req, res, 400, { error: "Invalid book id" });
      }

      const book = BOOKS.find((item) => item.id === id);

      if (!book) {
        return sendJson(req, res, 404, { error: "Book not found" });
      }

      return sendJson(req, res, 200, book);
    }

    if (method === "POST" && pathname === "/books") {
      const body = await readBody(req);
      const validationError = validateBookCreate(body);

      if (validationError) {
        return sendJson(req, res, 400, { error: validationError });
      }

      const lastId = BOOKS.length > 0 ? BOOKS[BOOKS.length - 1].id : 0;
      const newBook = {
        id: lastId + 1,
        title: body.title.trim(),
        author: body.author.trim(),
        year: body.year,
      };

      BOOKS.push(newBook);

      return sendJson(req, res, 201, {
        message: "Book created successfully",
        book: newBook,
      });
    }

    if (method === "PATCH" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(req, res, 400, { error: "Invalid book id" });
      }

      const body = await readBody(req);
      const validationError = validateBookPatch(body);

      if (validationError) {
        return sendJson(req, res, 400, { error: validationError });
      }

      const bookIndex = BOOKS.findIndex((book) => book.id === id);

      if (bookIndex === -1) {
        return sendJson(req, res, 404, { error: "Book not found" });
      }

      BOOKS[bookIndex] = {
        ...BOOKS[bookIndex],
        ...body,
        id: BOOKS[bookIndex].id,
      };

      return sendJson(req, res, 200, {
        message: "Book updated successfully",
        book: BOOKS[bookIndex],
      });
    }

    if (method === "PUT" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(req, res, 400, { error: "Invalid book id" });
      }

      const body = await readBody(req);
      const validationError = validateBookCreate(body);

      if (validationError) {
        return sendJson(req, res, 400, { error: validationError });
      }

      const bookIndex = BOOKS.findIndex((book) => book.id === id);

      if (bookIndex === -1) {
        return sendJson(req, res, 404, { error: "Book not found" });
      }

      BOOKS[bookIndex] = {
        id,
        title: body.title.trim(),
        author: body.author.trim(),
        year: body.year,
      };

      return sendJson(req, res, 200, {
        message: "Book replaced successfully",
        book: BOOKS[bookIndex],
      });
    }

    if (method === "DELETE" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(req, res, 400, { error: "Invalid book id" });
      }

      const originalLength = BOOKS.length;
      BOOKS = BOOKS.filter((book) => book.id !== id);

      if (BOOKS.length === originalLength) {
        return sendJson(req, res, 404, { error: "Book not found" });
      }

      return sendJson(req, res, 200, {
        message: "Book deleted successfully",
      });
    }

    return sendJson(req, res, 404, { error: "Route not found" });
  } catch (error) {
    return sendJson(req, res, 400, { error: error.message });
  }
});

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  gracefulShutdown("uncaughtException", error, 1);
});

process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  gracefulShutdown("unhandledRejection", error, 1);
});

server.listen(config.PORT, config.HOSTNAME, () => {
  log("INFO", `Server running at http://${config.HOSTNAME}:${config.PORT}/`);
});
