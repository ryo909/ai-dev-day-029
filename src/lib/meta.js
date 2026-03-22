import rawMeta from '../../meta.json';

const DEFAULT_META = {
  day: 'DayXXX',
  title: 'Untitled Tool',
  description: '説明をここに',
  genre: 'utility',
  theme: 'NeoLab',
  story_summary: '',
  complexity_tier: 'small',
  selected_components: [],
  complexity_prompt_hint: '',
  sample_inputs: [],
  reason_panel_text: ''
};

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSampleInputs(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (typeof item === 'string') {
        const text = item.trim();
        if (!text) {
          return null;
        }
        return {
          label: `Sample ${index + 1}`,
          value: text
        };
      }

      if (item && typeof item === 'object') {
        const valueText = typeof item.value === 'string' ? item.value.trim() : '';
        if (!valueText) {
          return null;
        }

        const labelText = typeof item.label === 'string' && item.label.trim()
          ? item.label.trim()
          : `Sample ${index + 1}`;

        return {
          label: labelText,
          value: valueText
        };
      }

      return null;
    })
    .filter(Boolean);
}

export function loadMeta() {
  const merged = { ...DEFAULT_META, ...(rawMeta || {}) };

  return {
    ...merged,
    complexity_tier: typeof merged.complexity_tier === 'string' && merged.complexity_tier.trim()
      ? merged.complexity_tier.trim().toLowerCase()
      : 'small',
    selected_components: normalizeStringArray(merged.selected_components),
    complexity_prompt_hint: typeof merged.complexity_prompt_hint === 'string' ? merged.complexity_prompt_hint : '',
    sample_inputs: normalizeSampleInputs(merged.sample_inputs),
    reason_panel_text: typeof merged.reason_panel_text === 'string' ? merged.reason_panel_text : ''
  };
}
