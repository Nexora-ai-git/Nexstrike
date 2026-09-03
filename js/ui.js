import {NexstrikeGame} from './game.js';
const $=s=>document.querySelector(s);
class UI{constructor(){this.views={play:$('#play'),inventory:$('#inventory'),agents:$('#agents'),maps:$('#maps')};document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>this.tab(b.dataset.tab));document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active')});$('#launch').onclick=()=>this.launch();$('#resume').onclick=()=>$('#menu').classList.add('hidden');$('#back').onclick=()=>{this.stop();$('#lobby').classList.remove('hidden')};$('#menuBtn').onclick=()=>$('#menu').classList.toggle('hidden');}
tab(t){Object.entries(this.views).forEach(([k,v])=>v.classList.toggle('hidden',k!==t));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t))}
launch(){if(this.game)return;$('#lobby').classList.add('hidden');$('#game').classList.remove('hidden');this.game=new NexstrikeGame($('#game'),this)}
stop(){location.reload()}
name(){return $('#playerName').value.trim()||'Ryash'}
hp(v){$('#hp').textContent=`${v} HP`}
ammo(v){$('#ammo').textContent=`${v} / 100`}}
window.ui=new UI();
