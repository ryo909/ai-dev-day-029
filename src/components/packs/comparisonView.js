export function createComparisonViewPack({ analyzeInput }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-comparison-view';
  root.setAttribute('data-quality-marker', 'comparison_view');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Comparison';

  const grid = document.createElement('div');
  grid.className = 'comparison-grid';

  function buildCases(input) {
    const source = input && input.trim() ? input.trim() : 'Example input text for comparison.';
    return [
      { label: 'Current', value: source },
      { label: 'Shortened', value: source.slice(0, Math.max(8, Math.floor(source.length * 0.6))) },
      { label: 'Extended', value: `${source} Additional reference line.` }
    ];
  }

  function render(input) {
    grid.innerHTML = '';

    const cases = buildCases(input);
    cases.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'comparison-card';

      const head = document.createElement('h4');
      head.className = 'comparison-title';
      head.textContent = item.label;

      const body = document.createElement('pre');
      body.className = 'comparison-body';
      body.textContent = analyzeInput(item.value);

      card.append(head, body);
      grid.appendChild(card);
    });
  }

  root.append(title, grid);
  render('');

  return {
    name: 'comparison_view',
    element: root,
    update({ input }) {
      render(input || '');
    }
  };
}
