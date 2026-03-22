export function createHistoryPanelPack({ onHistoryPick }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-history-panel';
  root.setAttribute('data-quality-marker', 'history_panel');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Recent History';

  const list = document.createElement('ul');
  list.className = 'history-list';

  function render(history) {
    list.innerHTML = '';

    if (!history.length) {
      const empty = document.createElement('li');
      empty.className = 'history-empty';
      empty.textContent = 'No history yet';
      list.appendChild(empty);
      return;
    }

    history.forEach((entry, index) => {
      const item = document.createElement('li');
      item.className = 'history-item';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'history-btn';
      button.textContent = `${index + 1}. ${entry.input.slice(0, 28)}`;
      button.title = entry.input;
      button.addEventListener('click', () => {
        if (typeof onHistoryPick === 'function') {
          onHistoryPick(entry);
        }
      });

      const sub = document.createElement('p');
      sub.className = 'history-sub';
      sub.textContent = entry.result.replaceAll('\n', ' ').slice(0, 72);

      item.append(button, sub);
      list.appendChild(item);
    });
  }

  root.append(title, list);
  render([]);

  return {
    name: 'history_panel',
    element: root,
    update({ history }) {
      render(Array.isArray(history) ? history : []);
    }
  };
}
