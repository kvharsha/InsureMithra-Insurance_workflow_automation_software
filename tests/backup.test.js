const fs = require('fs-extra');
const path = require('path');
const { cleanupOldBackups } = require('../services/backup.service');

describe('backup retention', () => {
  const backupsDir = path.join(process.cwd(), 'backups');
  beforeEach(async () => {
    await fs.ensureDir(backupsDir);
    // create 5 dummy backup files
    for (let i = 0; i < 5; i++) {
      const name = `db-2025010${i}-000${i}.tar.gz`;
      await fs.writeFile(path.join(backupsDir, name), 'dummy');
      // ensure mtime differs
      await new Promise(r => setTimeout(r, 10));
    }
  });

  afterEach(async () => {
    await fs.remove(backupsDir);
  });

  test('keeps only last 3 backups', async () => {
    const res = await cleanupOldBackups(3);
    expect(res.removed).toBe(2);
    const files = await fs.readdir(backupsDir);
    const tars = files.filter(f => f.endsWith('.tar.gz'));
    expect(tars.length).toBe(3);
  });
});
