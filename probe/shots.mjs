import { chromium } from 'playwright';
import { resolve } from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
const srv=http.createServer((q,r)=>{const f=resolve('probe'+(q.url==='/'?'/index.html':q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':'text/html'});r.end(d)})}).listen(8123);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errs=[];page.on('pageerror',e=>errs.push(e.message));
await page.route('**/*', r => { const u=r.request().url(); if (/open-meteo|api\.weather\.gov|rcc-acis|rainviewer|ntfy/.test(u)) return r.abort(); return r.continue(); });
await page.goto('http://localhost:8123/index.html');
await page.waitForFunction(()=>typeof usStates!=='undefined'&&usStates&&usStates.TX&&stateGeo.PA,null,{timeout:60000});
fs.mkdirSync('shots',{recursive:true});
await page.evaluate(()=>{outLoad()});await page.waitForFunction(()=>outData.status!=='loading',null,{timeout:30000});
fs.writeFileSync('shots/info.txt',JSON.stringify(await page.evaluate(()=>{const M=outMatch(outData);return[outData.status,outData.c.length,stateGeo.PA.rings.length,M&&M.length,M&&new Set(M.map(x=>x[1].fips)).size]})));
for (const [k,m] of [['paonly','count'],['scpa','count']]) {
  const d = await page.evaluate(([k,m])=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const sc=newScene('outages',{region:k,oMode:m});renderScene(g,sc,6,{});drawChrome(g,0);const o=document.createElement('canvas');o.width=1280;o.height=720;o.getContext('2d').drawImage(c,0,0,1280,720);return o.toDataURL('image/jpeg',.88)},[k,m]);
  fs.writeFileSync('shots/'+k+'_'+m+'.jpg', Buffer.from(d.split(',')[1],'base64'));
}
fs.writeFileSync('shots/errs.txt',JSON.stringify(errs.slice(0,10)));
await browser.close();srv.close();
