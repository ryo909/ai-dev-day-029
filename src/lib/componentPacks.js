export const SUPPORTED_COMPONENT_PACKS = [
  'reason_panel',
  'sample_inputs',
  'local_storage',
  'comparison_view',
  'history_panel',
  'export_suite',
  'step_ui'
];

export function resolveSelectedComponents(meta) {
  const selected = Array.isArray(meta?.selected_components) ? meta.selected_components : [];

  return selected
    .filter((name) => typeof name === 'string')
    .map((name) => name.trim())
    .filter((name) => SUPPORTED_COMPONENT_PACKS.includes(name));
}

export function buildComponentPackManifest(meta, renderedComponents) {
  return {
    complexity_tier: meta?.complexity_tier || 'small',
    selected_components: Array.isArray(meta?.selected_components) ? meta.selected_components : [],
    rendered_components: renderedComponents
  };
}

export function publishComponentPackManifest(manifest) {
  window.__COMPONENT_PACKS__ = manifest;

  const scriptId = 'componentPackManifest';
  let manifestNode = document.getElementById(scriptId);
  if (!manifestNode) {
    manifestNode = document.createElement('script');
    manifestNode.id = scriptId;
    manifestNode.type = 'application/json';
    document.body.appendChild(manifestNode);
  }

  manifestNode.textContent = JSON.stringify(manifest, null, 2);
}
