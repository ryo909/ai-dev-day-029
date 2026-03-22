/**
 * AI個人開発実験 — Dayテンプレート ロジック
 *
 * - meta.json から表示情報を読み込み
 * - theme は CSS variables を適用
 * - 入力→処理→出力のベースを提供
 * - selected_components に応じて安全な component packs を追加
 */

import { loadMeta } from './lib/meta';
import {
  buildComponentPackManifest,
  publishComponentPackManifest,
  resolveSelectedComponents
} from './lib/componentPacks';
import { createComparisonViewPack } from './components/packs/comparisonView';
import { createExportSuitePack } from './components/packs/exportSuite';
import { createHistoryPanelPack } from './components/packs/historyPanel';
import { createLocalStoragePack } from './components/packs/localStorage';
import { createReasonPanelPack } from './components/packs/reasonPanel';
import { createSampleInputsPack } from './components/packs/sampleInputs';
import { createStepUiPack } from './components/packs/stepUi';
import { applyTheme } from './themes';
import './style.css';

const meta = loadMeta();
applyTheme(meta.theme);

document.documentElement.setAttribute('data-complexity-tier', meta.complexity_tier || 'small');

const headerBadge = document.getElementById('headerBadge');
const headerTitle = document.getElementById('headerTitle');
const headerDesc = document.getElementById('headerDesc');
const footerDay = document.getElementById('footerDay');
const actionBtn = document.getElementById('actionBtn');
const toolInput = document.getElementById('toolInput');
const toolOutput = document.getElementById('toolOutput');
const outputGroup = document.getElementById('outputGroup');
const toolArea = document.querySelector('.tool-area');
const inputGroup = document.querySelector('.input-group');

headerBadge.textContent = meta.day || 'DayXXX';
headerTitle.textContent = meta.title || 'Untitled Tool';
headerDesc.textContent = meta.description || '説明をここに';
footerDay.textContent = `${meta.day || 'DayXXX'} / #100日開発`;

const storageSlug = (meta.repo_name || meta.title || 'tool')
  .toLowerCase()
  .replace(/[^a-z0-9-_]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'tool';
const storageKey = `ai-dev-exp-template:${storageSlug}`;

const state = {
  input: '',
  result: '',
  history: []
};

const packControllers = [];
const renderedComponentNames = [];
let localStoragePack = null;

const selectedComponents = resolveSelectedComponents(meta);

function processInput(input) {
  const charCount = input.length;
  const wordCount = input.split(/\s+/).filter(Boolean).length;
  const lineCount = input.split('\n').length;

  return `Analysis:\n- Characters: ${charCount}\n- Words: ${wordCount}\n- Lines: ${lineCount}`;
}

function showOutput(content, type = 'info') {
  outputGroup.style.display = '';
  toolOutput.className = `output-area output-${type}`;
  toolOutput.textContent = content;

  outputGroup.style.animation = 'none';
  outputGroup.offsetHeight;
  outputGroup.style.animation = 'fadeSlideIn 0.25s ease';
}

function getSnapshot() {
  return {
    input: state.input,
    result: state.result,
    history: state.history.slice(0, 5)
  };
}

function notifyPacks(eventName) {
  const payload = {
    eventName,
    input: state.input,
    result: state.result,
    history: state.history.slice(0, 5)
  };

  packControllers.forEach((controller) => {
    if (typeof controller.update === 'function') {
      controller.update(payload);
    }
  });

  if (eventName === 'run' && localStoragePack && typeof localStoragePack.save === 'function') {
    localStoragePack.save(getSnapshot());
  }
}

function setInputValue(value) {
  toolInput.value = value;
  state.input = value;
  notifyPacks('input');
}

function applyRunResult(inputText, outputText) {
  state.input = inputText;
  state.result = outputText;

  const entry = {
    input: inputText,
    result: outputText,
    timestamp: Date.now()
  };

  state.history = [entry, ...state.history].slice(0, 5);
  showOutput(outputText, 'success');
  notifyPacks('run');
}

function restoreSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return;
  }

  if (typeof snapshot.input === 'string') {
    toolInput.value = snapshot.input;
    state.input = snapshot.input;
  }

  if (typeof snapshot.result === 'string' && snapshot.result) {
    state.result = snapshot.result;
    showOutput(snapshot.result, 'success');
  }

  if (Array.isArray(snapshot.history)) {
    state.history = snapshot.history
      .filter((item) => item && typeof item.input === 'string' && typeof item.result === 'string')
      .slice(0, 5);
  }

  notifyPacks('restore');
}

function registerPack(controller, mountPoint, beforeNode = null) {
  if (!controller || !controller.element || !mountPoint) {
    return;
  }

  if (beforeNode) {
    mountPoint.insertBefore(controller.element, beforeNode);
  } else {
    mountPoint.appendChild(controller.element);
  }
  renderedComponentNames.push(controller.name);

  if (typeof controller.update === 'function') {
    packControllers.push(controller);
  }
}

const packArea = document.createElement('section');
packArea.className = `pack-area pack-tier-${meta.complexity_tier || 'small'}`;
toolArea.appendChild(packArea);

if (selectedComponents.includes('step_ui')) {
  const stepPack = createStepUiPack({ meta });
  registerPack(stepPack, toolArea, inputGroup);
}

if (selectedComponents.includes('sample_inputs')) {
  const samplePack = createSampleInputsPack({
    meta,
    inputElement: toolInput,
    onSamplePick: (value) => {
      state.input = value;
      notifyPacks('sample');
    }
  });

  registerPack(samplePack, inputGroup);
}

if (selectedComponents.includes('reason_panel')) {
  const reasonPack = createReasonPanelPack({ meta });
  registerPack(reasonPack, packArea);
}

if (selectedComponents.includes('local_storage')) {
  localStoragePack = createLocalStoragePack({
    storageKey,
    getSnapshot,
    restoreSnapshot
  });

  registerPack(localStoragePack, packArea);

  const loaded = localStoragePack.load();
  if (loaded) {
    restoreSnapshot(loaded);
  }
}

if (selectedComponents.includes('comparison_view')) {
  const comparisonPack = createComparisonViewPack({ analyzeInput: processInput });
  registerPack(comparisonPack, packArea);
}

if (selectedComponents.includes('history_panel')) {
  const historyPack = createHistoryPanelPack({
    onHistoryPick: (entry) => {
      if (!entry || typeof entry.input !== 'string' || typeof entry.result !== 'string') {
        return;
      }

      toolInput.value = entry.input;
      state.input = entry.input;
      state.result = entry.result;
      showOutput(entry.result, 'success');
      notifyPacks('history-pick');
    }
  });
  registerPack(historyPack, packArea);
}

if (selectedComponents.includes('export_suite')) {
  const exportPack = createExportSuitePack({ getSnapshot });
  registerPack(exportPack, packArea);
}

const manifest = buildComponentPackManifest(meta, renderedComponentNames);
publishComponentPackManifest(manifest);

actionBtn.addEventListener('click', () => {
  const input = toolInput.value.trim();

  if (!input) {
    state.input = '';
    showOutput('Please enter input text.', 'warning');
    notifyPacks('warning');
    return;
  }

  const result = processInput(input);
  applyRunResult(input, result);
});

toolInput.addEventListener('input', () => {
  state.input = toolInput.value;
  notifyPacks('input');
});

notifyPacks('init');
