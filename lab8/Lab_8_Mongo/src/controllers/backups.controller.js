import { createReadStream } from 'fs';
import path from 'path';
import { MESSAGES } from '#constants/messages';
import { getBackupFilePath } from '#utils/backup';

export const backupsController = {
  async downloadBackup(request, reply) {
    const backupPath = await getBackupFilePath(request.params.timestamp);

    if (!backupPath) {
      throw reply.notFound(MESSAGES.BACKUP_NOT_FOUND);
    }

    return reply
      .type('application/gzip')
      .header('Content-Disposition', `attachment; filename="${path.basename(backupPath)}"`)
      .send(createReadStream(backupPath));
  },
};
