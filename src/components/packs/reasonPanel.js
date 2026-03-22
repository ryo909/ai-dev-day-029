export function createReasonPanelPack({ meta }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-reason-panel';
  root.setAttribute('data-quality-marker', 'reason_panel');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Reason';

  const body = document.createElement('p');
  body.className = 'pack-body';
  body.textContent = meta.reason_panel_text || 'この結果は入力テキストの長さ・語数・行数から構造を把握しやすい形に整形しています。';

  root.append(title, body);
  return { name: 'reason_panel', element: root };
}
