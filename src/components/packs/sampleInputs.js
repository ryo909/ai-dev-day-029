const FALLBACK_SAMPLES = [
  {
    label: 'Short',
    value: 'Ship a tiny feature this week.'
  },
  {
    label: 'Paragraph',
    value: 'I need to summarize this text quickly and understand what to improve before publishing.'
  },
  {
    label: 'Multi-line',
    value: 'Line 1: collect data\\nLine 2: compare candidates\\nLine 3: publish result'
  }
];

export function createSampleInputsPack({ meta, inputElement, onSamplePick }) {
  const root = document.createElement('section');
  root.className = 'pack-inline pack-sample-inputs';
  root.setAttribute('data-quality-marker', 'sample_inputs');

  const title = document.createElement('span');
  title.className = 'pack-inline-label';
  title.textContent = 'Samples';

  const list = document.createElement('div');
  list.className = 'chip-list';

  const samples = Array.isArray(meta.sample_inputs) && meta.sample_inputs.length
    ? meta.sample_inputs
    : FALLBACK_SAMPLES;

  samples.forEach((sample) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip-btn';
    button.textContent = sample.label;
    button.addEventListener('click', () => {
      inputElement.value = sample.value;
      if (typeof onSamplePick === 'function') {
        onSamplePick(sample.value);
      }
    });
    list.appendChild(button);
  });

  root.append(title, list);
  return { name: 'sample_inputs', element: root };
}
