const config = require('#config/config');

function pad(value) {
  return String(value).padStart(2, '0');
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

function shouldLogRequest(statusCode) {
  return config.NODE_ENV === 'development' || statusCode >= 400;
}

function writeLog({ level = 'INFO', method = '-', url = '-', status = '-', message = '' }) {
  const base = `[${formatDate()}] [${level}] - - > ${method} ${url} | Status: ${status}`;
  const line = message ? `${base} | Message: ${message}` : base;

  if (level === 'ERROR') {
    process.stderr.write(`${line}\n`);
    return;
  }

  process.stdout.write(`${line}\n`);
}

function logRequest(req, res) {
  const statusCode = res.statusCode;

  if (!shouldLogRequest(statusCode)) {
    return;
  }

  writeLog({
    level: statusCode >= 400 ? 'ERROR' : 'INFO',
    method: req.method,
    url: req.url,
    status: statusCode,
  });
}

function logError(message, meta = {}) {
  writeLog({
    level: 'ERROR',
    method: meta.method || '-',
    url: meta.url || '-',
    status: meta.status || 500,
    message,
  });
}

function logInfo(message) {
  writeLog({
    level: 'INFO',
    message,
  });
}

module.exports = {
  logRequest,
  logError,
  logInfo,
};
