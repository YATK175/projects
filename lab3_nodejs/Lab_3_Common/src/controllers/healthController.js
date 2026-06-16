const HTTP_STATUS = require('#constants/httpStatus');
const { sendJson } = require('#utils/response');

function getHealth(req, res) {
  sendJson(res, HTTP_STATUS.OK, {
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
}

module.exports = {
  getHealth,
};
