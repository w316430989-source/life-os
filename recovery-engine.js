/* Life OS V2.0-04 — 放纵 / 恢复引擎 */
const recoveryEngine={
 key:'life-os-recovery-v1',
 state(){try{return JSON.parse(localStorage.getItem(this.key)||'null')}catch{return null}},
 save(s){localStorage.setItem(this.key,JSON.stringify(s))},
 start(minutes=30){const m=Math.max(1,Number(minutes)||30);const s={mode:'放纵中',startedAt:Date.now(),endsAt:Date.now()+m*60000,duration:m};this.save(s);renderRecovery();return s},
 stop(){this.save({mode:'执行中',endedAt:Date.now()});renderRecovery()},
 remaining(){const s=this.state();return s&&s.endsAt?Math.max(0,s.endsAt-Date.now()):0}
};
function renderRecovery(){const el=document.querySelector('#recoveryStatus');if(!el)return;const s=recoveryEngine.state();if(!s||s.mode!=='放纵中'){el.textContent='执行中';return}const left=recoveryEngine.remaining();if(left<=0){recoveryEngine.stop();el.textContent='已归位';if(window.lifeOSExecutionCore?.refresh)window.lifeOSExecutionCore.refresh();return}const min=Math.floor(left/60000),sec=Math.floor(left/1000)%60;el.textContent=`放纵中 · ${min}:${String(sec).padStart(2,'0')}`}
function initRecovery(){const start=document.querySelector('#startIndulgence'),stop=document.querySelector('#stopIndulgence'),input=document.querySelector('#indulgenceMinutes');start?.addEventListener('click',()=>recoveryEngine.start(input?.value||30));stop?.addEventListener('click',()=>recoveryEngine.stop());renderRecovery();setInterval(renderRecovery,1000)}
document.addEventListener('DOMContentLoaded',initRecovery);window.lifeOSRecovery=recoveryEngine;
