export function createLocalStoragePack({ storageKey, getSnapshot, restoreSnapshot }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-local-storage';
  root.setAttribute('data-quality-marker', 'local_storage');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Local Save';

  const controls = document.createElement('div');
  controls.className = 'pack-actions';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn-ghost';
  saveBtn.textContent = 'Save';

  const restoreBtn = document.createElement('button');
  restoreBtn.type = 'button';
  restoreBtn.className = 'btn-ghost';
  restoreBtn.textContent = 'Restore';

  const status = document.createElement('p');
  status.className = 'pack-note';
  status.textContent = 'No saved data';

  function writeStatus(text) {
    status.textContent = text;
  }

  function save(payload) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      const now = new Date().toLocaleString();
      writeStatus(`Saved at ${now}`);
      return true;
    } catch (error) {
      writeStatus('Save failed (storage unavailable)');
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        writeStatus('No saved data');
        return null;
      }
      const parsed = JSON.parse(raw);
      writeStatus('Restored from local storage');
      return parsed;
    } catch (error) {
      writeStatus('Restore failed');
      return null;
    }
  }

  saveBtn.addEventListener('click', () => {
    const snapshot = getSnapshot();
    save(snapshot);
  });

  restoreBtn.addEventListener('click', () => {
    const loaded = load();
    if (loaded && typeof restoreSnapshot === 'function') {
      restoreSnapshot(loaded);
    }
  });

  controls.append(saveBtn, restoreBtn);
  root.append(title, controls, status);

  return {
    name: 'local_storage',
    element: root,
    save,
    load,
    update() {
      return undefined;
    }
  };
}
