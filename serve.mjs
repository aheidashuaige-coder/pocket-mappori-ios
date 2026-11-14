import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('www');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.gif':'image/gif','.wav':'audio/wav','.mp3':'audio/mpeg','.webp':'image/webp'};
http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost');let f=path.resolve(root,'.'+(p.pathname==='/'?'/index.html':decodeURIComponent(p.pathname)));if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403);res.end();return}if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':mime[path.extname(f).toLowerCase()]||'application/octet-stream'});fs.createReadStream(f).pipe(res)}).listen(4174,'0.0.0.0',()=>console.log('Pocket Mappori iOS Web: http://localhost:4174'));
