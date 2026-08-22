const fixedDefaults = [
  '7:00 起床', '送孩子上学', '到店开始工作', '完成今日核心工作',
  '20 分钟散步', '阅读 1 小时', '控制短视频时间', '23:30 睡觉'
];

const dateKey = new Date().toISOString().slice(0, 10);
const key = 'life-os-v03-' + dateKey;
const historyKey = 'life-os-history-v03';
const saved = JSON.parse(localStorage.getItem(key) || '{}');
saved.fixed ??= fixedDefaults.map(text => ({ text, done: false }));
saved.extra ??= [];
saved.metrics ??= {};
const history = JSON.parse(localStorage.getItem(historyKey) || '{}');

const fixedEl = document.querySelector('#fixedTasks');
const extraEl = document.querySelector('#extraTasks');

function save() {
  localStorage.setItem(key, JSON.stringify(saved));
  const all = [...saved.fixed, ...saved.extra];
  history[dateKey] = {
    completed: all.filter(t => t.done).length,
    total: all.length,
    rate: all.length ? Math.round(all.filter(t => t.done).length / all.length * 100) : 0
  };
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function renderTasks() {
  fixedEl.innerHTML = '';
  extraEl.innerHTML = '';
  saved.fixed.forEach((task, index) => fixedEl.appendChild(createTaskRow(task, false, index)));
  saved.extra.forEach((task, index) => extraEl.appendChild(createTaskRow(task, true, index)));
  updateRate();
}

function createTaskRow(task, isExtra, index) {
  const row = document.createElement('div');
  row.className = 'task' + (task.done ? ' done' : '');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    save();
    renderTasks();
  });
  const text = document.createElement('span');
  text.textContent = task.text;
  const actions = document.createElement('div');
  actions.className = 'task-actions';
  const edit = document.createElement('button');
  edit.className = 'icon-button';
  edit.textContent = '编辑';
  edit.addEventListener('click', () => {
    const next = prompt('修改任务：', task.text);
    if (!next?.trim()) return;
    task.text = next.trim();
    save();
    renderTasks();
  });
  actions.append(edit);
  if (isExtra) {
    const remove = document.createElement('button');
    remove.className = 'icon-button danger';
    remove.textContent = '删除';
    remove.addEventListener('click', () => {
      saved.extra.splice(index, 1);
      save();
      renderTasks();
    });
    actions.append(remove);
  }
  row.append(checkbox, text, actions);
  return row;
}

function updateRate() {
  const all = [...saved.fixed, ...saved.extra];
  const completed = all.filter(t => t.done).length;
  const rate = all.length ? Math.round(completed / all.length * 100) : 0;
  document.querySelector('#rate').textContent = rate + '%';
  document.querySelector('#completedCount').textContent = `${completed}/${all.length}`;
  document.querySelector('#progressBar').style.width = rate + '%';
  document.querySelector('#streak').textContent = calculateStreak();
}

function calculateStreak() {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const d = cursor.toISOString().slice(0, 10);
    if (!history[d] || history[d].rate < 100) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

document.querySelector('#addTask').addEventListener('click', () => {
  if (saved.extra.length >= 8) return alert('额外任务最多 8 项。');
  const text = prompt('输入额外任务：');
  if (!text?.trim()) return;
  saved.extra.push({ text: text.trim(), done: false });
  save();
  renderTasks();
});

['thinking', 'indulgence', 'reading', 'phone', 'sleep'].forEach(id => {
  const input = document.querySelector('#' + id);
  input.value = saved.metrics[id] ?? '';
  input.addEventListener('input', () => {
    saved.metrics[id] = input.value;
    save();
  });
});

document.querySelector('#resetToday').addEventListener('click', () => {
  if (!confirm('确定清空今天所有任务完成状态和额外任务吗？')) return;
  saved.fixed = fixedDefaults.map(text => ({ text, done: false }));
  saved.extra = [];
  saved.metrics = {};
  save();
  ['thinking', 'indulgence', 'reading', 'phone', 'sleep'].forEach(id => {
    document.querySelector('#' + id).value = '';
  });
  renderTasks();
});

document.querySelector('#date').textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full' }).format(new Date());
renderTasks();
save();
