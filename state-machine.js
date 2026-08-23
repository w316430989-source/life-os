/* Life OS V2.0-05 — 统一状态机 */
const lifeOSState={
 key:'life-os-state-v1',
 states:['执行中','思维停车','放纵中','恢复中','已归位'],
 load(){try{return JSON.parse(localStorage.getItem(this.key)||'null')}catch{return null}},
 set(state,reason=''){if(!this.states.includes(state))return;const current=this.load();const next={state,reason,changedAt:Date.now(),previous:current?.state||null};localStorage.setItem(this.key,JSON.stringify(next));renderLifeOSState();return next},
 get(){return this.load()||{state:'执行中',reason:'系统默认状态',changedAt:Date.now(),previous:null}},
 transition(target,reason){const current=this.get().state;const allowed={执行中:['思维停车','放纵中'],思维停车:['执行中','恢复中'],放纵中:['恢复中','已归位'],恢复中:['执行中','已归位'],已归位:['执行中']};if(!(allowed[current]||[]).includes(target))return false;this.set(target,reason);return true}
};
function renderLifeOSState(){const s=lifeOSState.get();document.querySelectorAll('[data-life-state]').forEach(el=>el.textContent=s.state);const mode=document.querySelector('#executionMode');if(mode)mode.textContent=s.state;const cockpit=document.querySelector('#executionCore');if(cockpit)cockpit.dataset.state=s.state;const reason=document.querySelector('#stateReason');if(reason)reason.textContent=s.reason||'当前状态正常运行'}
function bindStateActions(){document.querySelector('#stateThinking')?.addEventListener('click',()=>lifeOSState.transition('思维停车','执行中产生想法，先记录后处理'));document.querySelector('#stateRecovery')?.addEventListener('click',()=>lifeOSState.transition('放纵中','状态需要暂时恢复'));document.querySelector('#stateReturn')?.addEventListener('click',()=>lifeOSState.transition('执行中','完成归位，返回当前行动'));renderLifeOSState()}
document.addEventListener('DOMContentLoaded',bindStateActions);window.lifeOSState=lifeOSState;window.lifeOSStateMachine={render:renderLifeOSState};
