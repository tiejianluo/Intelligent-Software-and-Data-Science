import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..',process.env.DEMO_ROOT||'.');
const port=Number(process.env.PORT||4178),prefix='/ase/en/capstone/';
const allowed=new Set(['.html','.js','.css','.svg','.json']);
createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/'||pathname===prefix.slice(0,-1)){res.writeHead(302,{Location:prefix});res.end();return;}
    if(!pathname.startsWith(prefix)){res.writeHead(404);res.end('Not found');return;}
    const path=resolve(root,pathname.slice(prefix.length)||'index.html');
    if(!path.startsWith(root+sep)||!allowed.has(extname(path))){res.writeHead(404);res.end('Not found');return;}
    const data=await readFile(path);
    res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'})[extname(path)],'Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Parking Evidence: http://127.0.0.1:${port}${prefix}`));
