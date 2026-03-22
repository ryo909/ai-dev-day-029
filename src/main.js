import './style.css';
const PROFILE = {"day":"Day029","title":"Flow Board Builder","one_sentence":"作業カードを流しながらボトルネックを見つけるボード型ツール。（話題:Zenn Feed）","core_action":"flow","family":"flow_board","mechanic":"lane_movement","input_style":"card_creation","output_style":"lane_board","audience_promise":"clearer_flow_visibility","publish_hook":"詰まりレーンを可視化して改善","engine":"flow_board","interaction_archetype":"board_flow_builder","page_archetype":"kanban_board","output_shape":"lane_columns","state_model":"cards_by_lane","core_loop":"add card -> move lane -> review bottleneck","component_pack":"lane_columns+bottleneck_hint","scaffold_id":"flow_board","single_shot_text_generator":false};
const byId = (id) => document.getElementById(id);
const state = {
  tokens: ['UI', 'API', 'Habit', 'Team'],
  lock: false,
  history: [],
  wizardStep: 0,
  wizardAnswers: {},
  matrix: { HH: [], HL: [], LH: [], LL: [] },
  options: [],
  slots: { morning: [], afternoon: [], evening: [] },
  board: { todo: [], doing: [], done: [] },
  missions: ['5分で試す', '2案比較する', '短文で説明する'],
  score: 0,
  round: 0
};

boot();

function boot() {
  switch (PROFILE.scaffold_id) {
    case 'card_deck_board': return setupCardDeck();
    case 'wizard_stepper': return setupWizard();
    case 'matrix_mapper': return setupMatrix();
    case 'weighted_calculator': return setupWeightedCalc();
    case 'slot_checklist_planner': return setupSlotPlanner();
    case 'flow_board': return setupFlowBoard();
    case 'roulette_game': return setupRoulette();
    default: return setupFallback();
  }
}

function setupCardDeck() {
  const tokenInput = byId('tokenInput');
  const tokenList = byId('tokenList');
  const cardStack = byId('cardStack');
  const historyList = byId('historyList');
  byId('addTokenBtn').addEventListener('click', () => {
    const v = (tokenInput.value || '').trim();
    if (!v) return;
    state.tokens.push(v);
    tokenInput.value = '';
    renderTokenPool(tokenList);
  });
  byId('drawBtn').addEventListener('click', () => {
    if (state.lock) return;
    const picks = shuffle([...state.tokens]).slice(0, Math.min(3, state.tokens.length));
    cardStack.innerHTML = picks.map((x) => `<div class="card">${escapeHtml(x)}</div>`).join('');
    state.history.unshift(picks.join(' × '));
    state.history = state.history.slice(0, 12);
    historyList.innerHTML = state.history.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  });
  byId('lockBtn').addEventListener('click', () => { state.lock = !state.lock; });
  renderTokenPool(tokenList);
}

function renderTokenPool(el) {
  el.innerHTML = state.tokens.map((x) => `<span class="chip">${escapeHtml(x)}</span>`).join('');
}

function setupWizard() {
  const questions = [
    { key: 'speed', q: '最優先はどれ?', c: ['速度', '品質', 'コスト'] },
    { key: 'risk', q: '許容できるリスクは?', c: ['低い', '中くらい', '高い'] },
    { key: 'ownership', q: '主導者は?', c: ['自分', 'チーム', '外部'] }
  ];
  const stepBadge = byId('stepBadge');
  const questionText = byId('questionText');
  const choiceGroup = byId('choiceGroup');
  const summary = byId('wizardSummary');
  byId('prevStepBtn').addEventListener('click', () => { state.wizardStep = Math.max(0, state.wizardStep - 1); renderStep(); });
  byId('nextStepBtn').addEventListener('click', () => {
    const cur = questions[state.wizardStep];
    const selected = document.querySelector('input[name="wizardChoice"]:checked');
    if (selected) state.wizardAnswers[cur.key] = selected.value;
    state.wizardStep = Math.min(questions.length - 1, state.wizardStep + 1);
    renderStep();
  });
  function renderStep() {
    const cur = questions[state.wizardStep];
    stepBadge.textContent = `Step ${state.wizardStep + 1}/${questions.length}`;
    questionText.textContent = cur.q;
    choiceGroup.innerHTML = cur.c.map((x) => `<label class="choice"><input type="radio" name="wizardChoice" value="${escapeHtml(x)}" ${state.wizardAnswers[cur.key]===x?'checked':''}>${escapeHtml(x)}</label>`).join('');
    summary.textContent = Object.entries(state.wizardAnswers).map(([k,v]) => `${k}: ${v}`).join('\n') || 'まだ回答がありません';
  }
  renderStep();
}

function setupMatrix() {
  const inputName = byId('matrixItemName');
  const impact = byId('impactRange');
  const urgency = byId('urgencyRange');
  byId('addMatrixItemBtn').addEventListener('click', () => {
    const name = (inputName.value || '').trim();
    if (!name) return;
    const i = Number(impact.value);
    const u = Number(urgency.value);
    const key = i >= 3 && u >= 3 ? 'HH' : i >= 3 ? 'HL' : u >= 3 ? 'LH' : 'LL';
    state.matrix[key].push(name);
    inputName.value = '';
    renderMatrix();
  });
  renderMatrix();
}

function renderMatrix() {
  byId('qHH').innerHTML = state.matrix.HH.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  byId('qHL').innerHTML = state.matrix.HL.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  byId('qLH').innerHTML = state.matrix.LH.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  byId('qLL').innerHTML = state.matrix.LL.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
}

function setupWeightedCalc() {
  const meter = byId('weightMeter');
  const scoreTable = byId('scoreTable');
  const recalc = () => {
    const ws = Number(byId('wSpeed').value), wq = Number(byId('wQuality').value), wc = Number(byId('wCost').value);
    const sum = ws + wq + wc || 1;
    meter.textContent = `weight ratio => speed:${ws} quality:${wq} cost:${wc}`;
    const rows = state.options.map((o) => {
      const score = (o.speed * ws + o.quality * wq + (6 - o.cost) * wc) / sum;
      return { name: o.name, score: score.toFixed(2) };
    }).sort((a,b) => Number(b.score) - Number(a.score));
    scoreTable.innerHTML = rows.map((r) => `<tr><td>${escapeHtml(r.name)}</td><td>${r.score}</td></tr>`).join('');
  };
  ['wSpeed','wQuality','wCost'].forEach((id) => byId(id).addEventListener('input', recalc));
  byId('addOptionBtn').addEventListener('click', () => {
    const name = (byId('optionName').value || '').trim();
    const speed = Number(byId('optionSpeed').value || 0);
    const quality = Number(byId('optionQuality').value || 0);
    const cost = Number(byId('optionCost').value || 0);
    if (!name || !speed || !quality || !cost) return;
    state.options.push({ name, speed, quality, cost });
    byId('optionName').value = '';
    byId('optionSpeed').value = '';
    byId('optionQuality').value = '';
    byId('optionCost').value = '';
    recalc();
  });
  byId('recalcBtn').addEventListener('click', recalc);
  recalc();
}

function setupSlotPlanner() {
  byId('addTaskBtn').addEventListener('click', () => {
    const task = (byId('taskInput').value || '').trim();
    const slot = byId('slotSelect').value;
    if (!task) return;
    state.slots[slot].push({ text: task, done: false });
    byId('taskInput').value = '';
    renderSlots();
  });
  byId('carryBtn').addEventListener('click', () => {
    carry('morning', 'afternoon');
    carry('afternoon', 'evening');
    renderSlots();
  });
  renderSlots();
}

function carry(from, to) {
  const stay = [];
  state.slots[from].forEach((t) => {
    if (t.done) stay.push(t);
    else state.slots[to].push({ text: t.text, done: false });
  });
  state.slots[from] = stay;
}

function renderSlots() {
  renderSlot('morning', byId('slotMorning'));
  renderSlot('afternoon', byId('slotAfternoon'));
  renderSlot('evening', byId('slotEvening'));
}

function renderSlot(key, el) {
  el.innerHTML = state.slots[key].map((t, i) => `<label class="task"><input type="checkbox" ${t.done?'checked':''} data-slot="${key}" data-idx="${i}">${escapeHtml(t.text)}</label>`).join('');
  el.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', (e) => {
      const slot = e.target.dataset.slot;
      const idx = Number(e.target.dataset.idx);
      state.slots[slot][idx].done = e.target.checked;
    });
  });
}

function setupFlowBoard() {
  byId('addFlowCardBtn').addEventListener('click', () => {
    const title = (byId('cardTitleInput').value || '').trim();
    if (!title) return;
    state.board.todo.push({ id: Date.now(), title });
    byId('cardTitleInput').value = '';
    renderBoard();
  });
  renderBoard();
}

function renderBoard() {
  renderLane('todo', byId('laneTodo'), 'doing');
  renderLane('doing', byId('laneDoing'), 'done');
  renderLane('done', byId('laneDone'), null);
}

function renderLane(key, el, next) {
  el.innerHTML = state.board[key].map((c, i) => `<div class="card"><div>${escapeHtml(c.title)}</div>${next ? `<button data-lane="${key}" data-idx="${i}" data-next="${next}">→ ${next}</button>` : ''}</div>`).join('');
  el.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lane = btn.dataset.lane;
      const idx = Number(btn.dataset.idx);
      const to = btn.dataset.next;
      const [card] = state.board[lane].splice(idx, 1);
      state.board[to].push(card);
      renderBoard();
    });
  });
}

function setupRoulette() {
  const wheel = byId('wheelFace');
  const score = byId('scoreValue');
  const round = byId('roundValue');
  const missionPool = byId('missionPool');
  const history = byId('roundHistory');

  byId('addMissionBtn').addEventListener('click', () => {
    const m = (byId('missionInput').value || '').trim();
    if (!m) return;
    state.missions.push(m);
    byId('missionInput').value = '';
    renderPool();
  });
  byId('spinBtn').addEventListener('click', () => {
    if (state.missions.length === 0) return;
    const picked = state.missions[Math.floor(Math.random() * state.missions.length)];
    wheel.textContent = picked;
    state.round += 1;
    state.score += 10;
    state.history.unshift(`R${state.round}: ${picked}`);
    state.history = state.history.slice(0, 12);
    round.textContent = String(state.round);
    score.textContent = String(state.score);
    history.innerHTML = state.history.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  });
  byId('clearRoundBtn').addEventListener('click', () => {
    state.round = 0; state.score = 0; state.history = []; wheel.textContent = 'SPIN';
    round.textContent = '0'; score.textContent = '0'; history.innerHTML = '';
  });
  function renderPool() {
    missionPool.innerHTML = state.missions.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
  }
  renderPool();
}

function setupFallback() {
  const input = byId('toolInput');
  const output = byId('toolOutput');
  const btn = byId('actionBtn');
  if (!input || !output || !btn) return;
  btn.addEventListener('click', () => {
    const txt = (input.value || '').trim();
    output.textContent = txt ? `chars=${txt.length}` : '入力してください';
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
