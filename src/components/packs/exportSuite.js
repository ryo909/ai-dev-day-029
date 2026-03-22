function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function createExportSuitePack({ getSnapshot }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-export-suite';
  root.setAttribute('data-quality-marker', 'export_suite');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Export';

  const controls = document.createElement('div');
  controls.className = 'pack-actions';

  const txtBtn = document.createElement('button');
  txtBtn.type = 'button';
  txtBtn.className = 'btn-ghost';
  txtBtn.textContent = 'Export TXT';

  const jsonBtn = document.createElement('button');
  jsonBtn.type = 'button';
  jsonBtn.className = 'btn-ghost';
  jsonBtn.textContent = 'Export JSON';

  txtBtn.addEventListener('click', () => {
    const snapshot = getSnapshot();
    const content = `Input:\n${snapshot.input}\n\nOutput:\n${snapshot.result}`;
    downloadBlob('result.txt', content, 'text/plain');
  });

  jsonBtn.addEventListener('click', () => {
    const snapshot = getSnapshot();
    const payload = JSON.stringify(snapshot, null, 2);
    downloadBlob('result.json', payload, 'application/json');
  });

  controls.append(txtBtn, jsonBtn);
  root.append(title, controls);

  return { name: 'export_suite', element: root };
}
