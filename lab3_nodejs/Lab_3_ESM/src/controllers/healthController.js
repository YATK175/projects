import HTTP_STATUS from '#constants/httpStatus';
import { sendJson } from '#utils/response';

function getHealth(req, res) {
  sendJson(res, HTTP_STATUS.OK, {
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
}

export { getHealth };
