export function createStepUiPack({ meta }) {
  const root = document.createElement('section');
  root.className = 'pack-card pack-step-ui';
  root.setAttribute('data-quality-marker', 'step_ui');

  const title = document.createElement('h3');
  title.className = 'pack-title';
  title.textContent = 'Flow';

  const stepLine = document.createElement('p');
  stepLine.className = 'step-line';
  stepLine.textContent = meta.complexity_tier === 'large'
    ? 'Step 1 Input -> Step 2 Analyze -> Step 3 Compare -> Step 4 Export'
    : 'Step 1 Input -> Step 2 Analyze -> Step 3 Review';

  const current = document.createElement('p');
  current.className = 'pack-note';
  current.textContent = 'Current: waiting for input';

  root.append(title, stepLine, current);
  return {
    name: 'step_ui',
    element: root,
    update({ eventName }) {
      if (eventName === 'input' || eventName === 'sample') {
        current.textContent = 'Current: input ready';
        return;
      }

      if (eventName === 'run') {
        current.textContent = 'Current: result generated';
      }
    }
  };
}
