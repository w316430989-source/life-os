/* Life OS V2.0-03 — 思维停车区 */
const thoughtInbox={
  key:'life-os-thought-inbox-v1',
  load(){try{return JSON.parse(localStorage.getItem(this.key)||'[]')}catch{return[]}},
  save(items){localStorage.setItem(this.key,JSON.stringify(items))},
  add(text){const items=this.load();items.unshift({id:Date.now(),text:text.trim(),createdAt:new Date().toISOString(),status:'待思考'});this.save(items);renderThoughtInbox();return items[0]},
  resolve(id){const items=this.load();const item=items.find(x=>x.id===id);if(item)item.status='已处理';this.save(items);renderThoughtInbox()},
  remove(id){this.save(this.load().filter(x=>x.id!==id));renderThoughtInbox()}
};
function renderThoughtInbox(){const el=document.querySelector('#thoughtInboxList'),count=document.querySelector('#thoughtCount');if(!el)return;const items=thoughtInbox.load();const pending=items.filter(x=>x.status==='待思考');if(count)count.textContent=`${pending.length} 条待处理`;el.innerHTML='';if(!items.length){el.innerHTML='<p class="empty-state">没有停车中的想法。继续当前行动。</p>';return}items.slice(0,12).forEach(item=>{const row=document.createElement('div');row.className='thought-row'+(item.status==='已处理'?' resolved':'');const body=document.createElement('div');const text=document.createElement('strong');text.textContent=item.text;const meta=document.createElement('small');meta.textContent=item.status+' · '+new Date(item.createdAt).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});body.append(text,meta);const actions=document.createElement('div');if(item.status==='待思考'){const done=document.createElement('button');done.className='icon-button';done.textContent='处理';done.onclick=()=>thoughtInbox.resolve(item.id);actions.append(done)}const del=document.createElement('button');del.className='icon-button danger';del.textContent='删除';del.onclick=()=>thoughtInbox.remove(item.id);actions.append(del);row.append(body,actions);el.append(row)})}
document.addEventListener('DOMContentLoaded',()=>{const add=document.querySelector('#addThought');if(add)add.onclick=()=>{const input=document.querySelector('#thoughtInput');const text=input?.value.trim();if(!text)return;if(thoughtInbox.add(text))input.value='';};renderThoughtInbox();});
window.lifeOSThoughtInbox=thoughtInbox;
