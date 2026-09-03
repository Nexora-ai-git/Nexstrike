import http from 'node:http';
import { WebSocketServer } from 'ws';
import crypto from 'node:crypto';

const PORT = process.env.PORT || 3000;
const players = new Map();
const rooms = new Map([['haven-x', new Set()]]);
const server = http.createServer((req,res)=>{
  res.writeHead(200, {'content-type':'text/plain; charset=utf-8'});
  res.end('Nexstrike multiplayer server online');
});
const wss = new WebSocketServer({server});
function send(ws,type,data={}){ if(ws.readyState===1) ws.send(JSON.stringify({type,...data})); }
function broadcast(room,type,data,except=null){ for(const id of room){ const p=players.get(id); if(p && p.ws!==except) send(p.ws,type,data); } }
function snapshot(room){ return [...room].map(id=>{const p=players.get(id); return {id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch,hp:p.hp,weapon:p.weapon,team:p.team};}); }
wss.on('connection',(ws)=>{
  const id=crypto.randomUUID();
  const p={id,ws,name:'Player',x:0,y:1.7,z:12,yaw:0,pitch:0,hp:100,weapon:'NX-9',team:'attackers',room:'haven-x'};
  players.set(id,p); rooms.get(p.room).add(id);
  send(ws,'welcome',{id,room:p.room,players:snapshot(rooms.get(p.room))});
  broadcast(rooms.get(p.room),'player_joined',{player:{id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch,hp:p.hp,weapon:p.weapon,team:p.team}},ws);
  ws.on('message',(raw)=>{
    let m; try{m=JSON.parse(raw)}catch{return}
    if(m.type==='hello'){p.name=String(m.name||'Player').slice(0,18); send(ws,'state',{players:snapshot(rooms.get(p.room))}); return;}
    if(m.type==='state'){Object.assign(p,{x:Number(m.x)||0,y:Number(m.y)||1.7,z:Number(m.z)||0,yaw:Number(m.yaw)||0,pitch:Number(m.pitch)||0,hp:Math.max(0,Math.min(100,Number(m.hp)||0)),weapon:String(m.weapon||p.weapon).slice(0,20)}); broadcast(rooms.get(p.room),'player_state',{player:{id:p.id,x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch,hp:p.hp,weapon:p.weapon}},ws);}
    if(m.type==='fire'){broadcast(rooms.get(p.room),'remote_fire',{id:p.id,origin:m.origin||{},direction:m.direction||{},weapon:p.weapon},ws);}
    if(m.type==='hit'){broadcast(rooms.get(p.room),'hit_confirmed',{shooter:p.id,target:String(m.target||''),damage:Math.max(0,Math.min(100,Number(m.damage)||0))});}
    if(m.type==='chat'){broadcast(rooms.get(p.room),'chat',{name:p.name,text:String(m.text||'').slice(0,160)});}
  });
  ws.on('close',()=>{players.delete(id); rooms.get(p.room)?.delete(id); broadcast(rooms.get(p.room),'player_left',{id});});
});
server.listen(PORT,()=>console.log(`Nexstrike server listening on ${PORT}`));
