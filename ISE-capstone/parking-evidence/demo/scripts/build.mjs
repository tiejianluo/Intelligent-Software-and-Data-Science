import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const files=['index.html','styles.css','icon.svg','src/domain.js','src/store.js','src/experiments.js','src/curriculum.js','src/app.js'];
const manifest={version:'1.0.0',destination:'/ase/en/capstone/',files:{}};
for(const f of files){
  await mkdir(dirname(resolve(root,'dist',f)),{recursive:true});
  await copyFile(resolve(root,f),resolve(root,'dist',f));
  manifest.files[f]=createHash('sha256').update(await readFile(resolve(root,f))).digest('hex');
}
await writeFile(resolve(root,'dist/release.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Built ${files.length} static assets and release.json for ${manifest.destination}`);
