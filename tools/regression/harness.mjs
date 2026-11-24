// Usage: node harness.mjs <site-dir> <out.json> [states,comma] [click-indexes,comma]
// Loads <site-dir>/index.html, clicks every clickable on each screen state (fresh load per click)
// and records a DOM hash after each click. Date/Math.random are frozen for determinism.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
const [,, dir, out, only, idxs] = process.argv; const IDX=idxs?idxs.split(',').map(Number):null;
const CHROME=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port=10000+(process.pid%50000);
const ch=spawn(CHROME,['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--window-size=1440,900',`--user-data-dir=${os.tmpdir()}/_regprof_${process.pid}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ver; for(let i=0;i<50;i++){try{ver=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();break}catch{await sleep(200)}}
const page=ver.find(t=>t.type==='page');
const ws=new WebSocket(page.webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0; const pend=new Map(); const errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)} else if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)};
const hung=[];
const send=(method,params={})=>new Promise(r=>{const i=++id;const t=setTimeout(()=>{pend.delete(i);hung.push(method);r({result:{result:{value:'__HUNG__'}}})},15000);pend.set(i,m=>{clearTimeout(t);r(m)});ws.send(JSON.stringify({id:i,method,params}))});
const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});return r.result?.result?.value};
await send('Page.enable');await send('Runtime.enable');
await send('Page.addScriptToEvaluateOnNewDocument',{source:`
 (()=>{let s=12345;Math.random=()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296};
 const T=1700000000000;const D=Date;class FD extends D{constructor(...a){a.length?super(...a):super(T)}static now(){return T}};window.Date=FD;
 window.alert=m=>{(window.__alerts=window.__alerts||[]).push(String(m))};window.confirm=()=>true;window.prompt=()=>null;window.open=()=>null;
 })();`});
const url='file://'+dir+'/index.html';
const SNAP=`(()=>{const c=document.documentElement.cloneNode(true);c.querySelectorAll('script,style,link,noscript').forEach(n=>n.remove());
 let h=c.outerHTML.replace(/\\s+/g,' ');let x=0;for(let i=0;i<h.length;i++){x=(x*31+h.charCodeAt(i))|0}
 return {h:x,len:h.length,alerts:(window.__alerts||[]).join('|'),scroll:0}})()`;
const ready=async()=>{for(let i=0;i<100;i++){const ok=await ev(`typeof goToScreen==='function'&&typeof toggleAiOpsModal==='function'&&document.readyState==='complete'&&getComputedStyle(document.body).display==='flex'`);if(ok)break;await sleep(150)}await sleep(500)};
const nav=async()=>{await send('Page.navigate',{url});await sleep(300);await ready()};
const states=[
 ['init',''],['s1','goToScreen(1)'],['s3','goToScreen(3)'],['s3in',"goToScreen(3,null,'inward')"],['s3out',"goToScreen(3,null,'outward')"],
 ['s3guw',"goToScreen(3,'WH-02 Guwahati')"],['s3bhi',"goToScreen(3,'WH-01 Bhiwandi','outward')"],['s4','goToScreen(4)'],['s5','goToScreen(5)'],
 ['stored',"typeof goToScreen==='function'&&goToScreen('stored')"],['disp',"goToScreen('dispatched')"]];
const COLLECT=`(()=>{const sel='[onclick],button,a,[role=button],summary,input,select,.cursor-pointer';
 const vis=[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest('[hidden]')});
 vis.forEach((e,i)=>e.setAttribute('data-hx',i));return vis.length})()`;
const result={};
for(const [name,setup] of states){
  if(only&&!only.split(',').includes(name))continue;
  await nav();
  if(setup){await ev(`try{${setup}}catch(e){}`);await sleep(500)}
  const n=await ev(COLLECT); result[name]={n,clicks:[]};
  result[name].base=await ev(SNAP);console.log(name,'clickables',n);
  for(let i=0;i<n;i++){
    if(IDX&&!IDX.includes(i))continue;
    await nav();
    if(setup){await ev(`try{${setup}}catch(e){}`);await sleep(200)}
    await ev(COLLECT);
    const desc=await ev(`(()=>{const e=document.querySelector('[data-hx="${i}"]');if(!e)return 'gone';const d=(e.getAttribute('onclick')||e.id||e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,60);try{e.click()}catch(x){return d+'!ERR'}return d})()`);
    await sleep(200);
    result[name].clicks.push({i,desc,snap:await ev(SNAP)});
  }
}
result.__errors=errors; result.__hung=hung;
fs.writeFileSync(out,JSON.stringify(result));
ws.close();ch.kill();process.exit(0);
