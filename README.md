# ai-dev-exp-template

Vite-based single-page template for `ai-dev-day-XXX` repositories.

## Required meta.json fields

- `day` (e.g. `Day001`)
- `title`
- `description`
- `genre`
- `theme`
- `story_summary`

## Theme behavior

- `src/themes.js` defines 8 visual themes.
- Runtime applies `meta.json.theme` using CSS variables.
- Day repos should set `theme` with a day-seeded deterministic selector.

## Component Packs (tiered build)

- Template reads `complexity_tier` / `selected_components` from `meta.json`.
- `selected_components` is missing: runs as small tier baseline with all packs OFF.
- Unknown component names are ignored safely.
- Each pack can be toggled independently and app core flow still works.

Supported packs:

- `reason_panel`
- `sample_inputs`
- `local_storage`
- `comparison_view`
- `history_panel`
- `export_suite`
- `step_ui`

### Quality/Fallback integration

- Every pack root includes `data-quality-marker="<pack_name>"` for evaluator detection.
- Runtime manifest is published to `window.__COMPONENT_PACKS__` and script node `#componentPackManifest`.
- Static fallback manifest exists at `public/component-pack-manifest.json`.
- Medium/Large can increase visual depth safely by selecting more packs without changing core logic.
