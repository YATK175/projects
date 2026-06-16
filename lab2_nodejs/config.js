function fail(message) {
  console.error(`[CONFIG_ERROR] ${message}`);
  process.exit(1);
}

const allowedNodeEnv = ["development", "production"];

const PORT = Number(process.env.PORT);
const HOSTNAME = process.env.HOSTNAME;
const NODE_ENV = process.env.NODE_ENV;

if (!process.env.PORT) {
  fail("PORT is required");
}

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  fail("PORT must be an integer from 1 to 65535");
}

if (!HOSTNAME || HOSTNAME.trim().length === 0) {
  fail("HOSTNAME is required");
}

if (!NODE_ENV || !allowedNodeEnv.includes(NODE_ENV)) {
  fail("NODE_ENV must be development or production");
}

module.exports = {
  PORT,
  HOSTNAME,
  NODE_ENV,
};
