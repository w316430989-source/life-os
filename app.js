const fixedDefaults = [
  '7:00 起床', '送孩子上学', '到店开始工作', '完成今日核心工作',
  '20 分钟散步', '阅读 1 小时', '控制短视频时间', '23:30 睡觉'
];

const key = 'life-os-v02-' + new Date().toISOString().slice(0,10);
const saved = JSON.parse(localStorage.getItem(key) || '{}');
saved.fixed ??= fixedDefaults.map(text => ({ text, done:false }));
saved.extra ??= [];
saved.metrics ??= {};

const fixedEl = document.querySelector('#fixedTasks');
const extraEl = document.querySelector('#extraTasks');

function renderTasks() {
  fixedEl.innerHTML = '';
  extraEl.innerHTML = '';
  [...saved.fixed, ...saved.extra].forEach((task, index) => {
    const isExtra = index >= saved.fixed.length;
    const realIndex = isExtra ? index - saved.fixed.length : index;
    const row = document.createElement('label');
    row.className = 'task' + (task.done ? ' done' : '');
    row.innerHTML = `<input type="checkbox" ${task.done ? 'checked' : ''}><span></span>`;
    row.querySelector('span').textContent = task.text;
    row.querySelector('input').addEventListener('change', e => {
      task.done = e.target.checked;
      save();
      renderTasks();
    });
    (isExtra ? extraEl : fixedEl).appendChild(row);
  });
  updateRate();
}

function updateRate() {
  const all = [...saved.fixed, ...saved.extra];
  const rate = all.length ? Math.round(all.filter(t => t.done).length / all.length * 100) : 0;
  document.querySelector('#rate').textContent = rate + '%';
}

function save() {
  localStorage.setItem(key, JSON.stringify(saved));
}

document.querySelector('#addTask').addEventListener('click', () => {
  if (saved.extra.length >= 8) return alert('额外任务最多 8 项。');
  const text = prompt('输入额外任务：');
  if (!text?.trim()) return;
  saved.extra.push({ text: text.trim(), done:false });
  save();
  renderTasks();
});

['thinking','indulgence','reading','phone','sleep'].forEach(id => {
  const input = document.querySelector('#' + id);
  input.value = saved.metrics[id] ?? '';
  input.addEventListener('input', () => {
    saved.metrics[id] = input.value;
    save();
  });
});

document.querySelector('#date').textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle:'full' }).format(new Date());
renderTasks();
save();
