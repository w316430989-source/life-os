/* Life OS V2.0 — 执行中枢
 * 目标：把“思维不打断执行”与“状态可恢复”变成系统行为。
 */
const CORE_DATE=new Date();
const CORE_DATE_KEY=`${CORE_DATE.getFullYear()}-${String(CORE_DATE.getMonth()+1).padStart(2,'0')}-${String(CORE_DATE.getDate()).padStart(2,'0')}`;
const CORE_INBOX_KEY='life-os-thought-inbox-v1';
const CORE_STATE_KEY='life-os-execution-core-v1-'+CORE_DATE_KEY;
let coreState=JSON.parse(localStorage.getItem(CORE_STATE_KEY)||'{"mode":"execute","startedAt":null}');
let coreInbox=JSON.parse(localStorage.getItem(CORE_INBOX_KEY)||'[]');

function coreSave(){localStorage.setItem(CORE_STATE_KEY,JSON.stringify(coreState));localStorage.setItem(CORE_INBOX_KEY,JSON.stringify(coreInbox));}
function coreScheduledProgram(){const h=new Date().getHours();if(h>=7&&h<8)return'life';if(h>=8&&h<15)return'work';if(h>=15&&h<17)return'learning';if(h>=17&&h<20)return'education';if(h>=20&&h<22)return'recreation';return'body';}
function coreProgramName(id){return document.querySelector(`.program-tab[data-program="${id}"]`)?.textContent||id;}
function coreCurrentTask(){const active=document.querySelector('.program-tab.active');const program=active?.dataset.program||coreScheduledProgram();const rows=[...document.querySelectorAll('#fixedTasks .task,#extraTasks .task')];return rows.find(r=>!r.classList.contains('done'))||null;}
function coreRule(){const title=document.querySelector('#ruleTitle')?.textContent||'洗衣论';const text=document.querySelector('#ruleText')?.textContent||'';return{title,text};}
function coreRender(){
 const mode=coreState.mode;const task=coreCurrentTask();const scheduled=coreScheduledProgram();
 const panel=document.querySelector('#executionCore');if(!panel)return;
 const rule=coreRule();
 panel.querySelector('[data-core="mode"]').textContent=mode==='execute'?'执行模式':mode==='thinking'?'思维时间':'恢复模式';
 panel.querySelector('[data-core="program"]').textContent=coreProgramName(document.querySelector('.program-tab.active')?.dataset.program||scheduled);
 panel.querySelector('[data-core="task"]').textContent=task?.querySelector('span')?.textContent||'当前程序已完成，进入下一程序';
 panel.querySelector('[data-core="rule"]').textContent=rule.title;
 panel.querySelector('[data-core="rule-text"]').textContent=rule.text;
 panel.querySelector('[data-core="inbox-count"]').textContent=coreInbox.filter(x=>x.status==='pending').length;
 panel.classList.toggle('core-thinking',mode==='thinking');panel.classList.toggle('core-recovery',mode==='recovery');
 panel.querySelector('[data-core="execute"]').disabled=mode!=='execute'||!task;
 panel.querySelector('[data-core="thinking"]').textContent=mode==='thinking'?'返回执行':'进入思维时间';
 panel.querySelector('[data-core="recovery"]').textContent=mode==='recovery'?'返回执行':'进入恢复模式';
 const list=panel.querySelector('[data-core="inbox-list"]');list.innerHTML='';
 coreInbox.slice().reverse().slice(0,5).forEach(item=>{const row=document.createElement('div');row.className='core-inbox-row';row.innerHTML=`<span>${item.text}</span><small>${item.status==='done'?'已处理':'待处理'}</small>`;list.append(row)});
}
function coreFocusTask(){const task=coreCurrentTask();if(!task)return;task.scrollIntoView({behavior:'smooth',block:'center'});task.classList.add('focus-task');setTimeout(()=>task.classList.remove('focus-task'),1000);}
function coreAddThought(){const text=prompt('记录一个现在不需要处理的想法：');if(!text?.trim())return;coreInbox.push({id:Date.now(),text:text.trim(),createdAt:new Date().toISOString(),status:'pending'});coreSave();coreRender();}
function coreOpenInbox(){const pending=coreInbox.filter(x=>x.status==='pending');if(!pending.length){alert('思维停车区目前没有待处理想法。');return}const text=pending.map((x,i)=>`${i+1}. ${x.text}`).join('\n');if(confirm(`思维停车区\n\n${text}\n\n确定将全部标记为已处理吗？`)){coreInbox.forEach(x=>{if(x.status==='pending')x.status='done'});coreSave();coreRender();}}
function coreBuild(){
 const anchor=document.querySelector('#cockpitPanel')||document.querySelector('.header');if(!anchor)return;
 const panel=document.createElement('section');panel.id='executionCore';panel.className='execution-core card';panel.innerHTML=`<div class="core-head"><div><p class="eyebrow">LIFE OS / V2.0</p><h2>执行中枢</h2><p>执行优先。其他想法先归位，不进入当前任务。</p></div><span class="core-mode" data-core="mode">执行模式</span></div><div class="core-grid"><div><span>当前程序</span><strong data-core="program">—</strong></div><div><span>当前定论</span><strong data-core="rule">—</strong><small data-core="rule-text"></small></div><div class="core-main-task"><span>唯一行动</span><strong data-core="task">—</strong></div></div><div class="core-actions"><button data-core="execute">执行当前行动</button><button class="secondary" data-core="thinking">进入思维时间</button><button class="secondary" data-core="recovery">进入恢复模式</button><button class="secondary" data-core="thought">记录想法</button><button class="secondary" data-core="open-inbox">思维停车区 <b data-core="inbox-count">0</b></button></div><div class="core-inbox"><div class="card-title"><h3>最近想法</h3><span>不打断当前执行</span></div><div data-core="inbox-list"></div></div>`;
 anchor.insertAdjacentElement('afterend',panel);
 panel.querySelector('[data-core="execute"]').onclick=()=>{coreState.mode='execute';coreState.startedAt=new Date().toISOString();coreSave();coreFocusTask();coreRender()};
 panel.querySelector('[data-core="thinking"]').onclick=()=>{coreState.mode=coreState.mode==='thinking'?'execute':'thinking';coreSave();coreRender()};
 panel.querySelector('[data-core="recovery"]').onclick=()=>{coreState.mode=coreState.mode==='recovery'?'execute':'recovery';coreSave();coreRender()};
 panel.querySelector('[data-core="thought"]').onclick=coreAddThought;
 panel.querySelector('[data-core="open-inbox"]').onclick=coreOpenInbox;
 document.querySelectorAll('.program-tab,.program-map-item').forEach(b=>b.addEventListener('click',()=>setTimeout(coreRender,30)));
 new MutationObserver(()=>setTimeout(coreRender,0)).observe(document.querySelector('#fixedTasks'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 new MutationObserver(()=>setTimeout(coreRender,0)).observe(document.querySelector('#extraTasks'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 coreRender();
}
window.addEventListener('load',()=>setTimeout(coreBuild,50));
