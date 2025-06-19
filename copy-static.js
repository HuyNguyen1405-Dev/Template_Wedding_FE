const fs = require('fs-extra');

async function copyPublic() {
  const folder = 'public';
  const dest = 'build';
  await fs.ensureDir(dest);
  await fs.copy(folder, dest);
  console.log(`✅ Static files from "${folder}/" copied to "${dest}/"`);
}

copyPublic();
