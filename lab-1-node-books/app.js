const { createServer } = require("node:http");

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

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
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
  const parts = pathname.split("/");
  const id = Number(parts[2]);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

const server = createServer(async (req, res) => {
  try {
    const method = req.method;
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // GET /books
    // GET /books?author=Shevchenko
    if (method === "GET" && pathname === "/books") {
      const author = parsedUrl.searchParams.get("author");

      let result = [...BOOKS];

      if (author) {
        result = result.filter((book) =>
          book.author.toLowerCase().includes(author.toLowerCase())
        );
      }

      return sendJson(res, 200, {
        count: result.length,
        items: result,
      });
    }

    // GET /books/:id
    if (method === "GET" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(res, 400, {
          error: "Invalid book id",
        });
      }

      const book = BOOKS.find((item) => item.id === id);

      if (!book) {
        return sendJson(res, 404, {
          error: "Book not found",
        });
      }

      return sendJson(res, 200, book);
    }

    // POST /books
    if (method === "POST" && pathname === "/books") {
      const body = await readBody(req);

      const validationError = validateBookCreate(body);

      if (validationError) {
        return sendJson(res, 400, {
          error: validationError,
        });
      }

      const lastId = BOOKS.length > 0 ? BOOKS[BOOKS.length - 1].id : 0;

      const newBook = {
        id: lastId + 1,
        title: body.title.trim(),
        author: body.author.trim(),
        year: body.year,
      };

      BOOKS.push(newBook);

      return sendJson(res, 201, {
        message: "Book created successfully",
        book: newBook,
      });
    }

    // PATCH /books/:id
    if (method === "PATCH" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(res, 400, {
          error: "Invalid book id",
        });
      }

      const body = await readBody(req);

      const validationError = validateBookPatch(body);

      if (validationError) {
        return sendJson(res, 400, {
          error: validationError,
        });
      }

      const bookIndex = BOOKS.findIndex((book) => book.id === id);

      if (bookIndex === -1) {
        return sendJson(res, 404, {
          error: "Book not found",
        });
      }

      BOOKS[bookIndex] = {
        ...BOOKS[bookIndex],
        ...body,
        id: BOOKS[bookIndex].id,
      };

      return sendJson(res, 200, {
        message: "Book updated successfully",
        book: BOOKS[bookIndex],
      });
    }

    // PUT /books/:id
    if (method === "PUT" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(res, 400, {
          error: "Invalid book id",
        });
      }

      const body = await readBody(req);

      const validationError = validateBookCreate(body);

      if (validationError) {
        return sendJson(res, 400, {
          error: validationError,
        });
      }

      const bookIndex = BOOKS.findIndex((book) => book.id === id);

      if (bookIndex === -1) {
        return sendJson(res, 404, {
          error: "Book not found",
        });
      }

      BOOKS[bookIndex] = {
        id,
        title: body.title.trim(),
        author: body.author.trim(),
        year: body.year,
      };

      return sendJson(res, 200, {
        message: "Book replaced successfully",
        book: BOOKS[bookIndex],
      });
    }

    // DELETE /books/:id
    if (method === "DELETE" && pathname.startsWith("/books/")) {
      const id = getIdFromPath(pathname);

      if (!id) {
        return sendJson(res, 400, {
          error: "Invalid book id",
        });
      }

      const originalLength = BOOKS.length;

      BOOKS = BOOKS.filter((book) => book.id !== id);

      if (BOOKS.length === originalLength) {
        return sendJson(res, 404, {
          error: "Book not found",
        });
      }

      return sendJson(res, 200, {
        message: "Book deleted successfully",
      });
    }

    return sendJson(res, 404, {
      error: "Route not found",
    });
  } catch (error) {
    return sendJson(res, 400, {
      error: error.message,
    });
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
