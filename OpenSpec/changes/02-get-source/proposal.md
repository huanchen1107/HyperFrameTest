# Proposal for Change 02-get-source

**Goal:** Acquire all necessary source assets (images, videos, templates, data files) required for the PPT animation project.

**Background:** The project relies on external media assets to generate animations via HyperFrame. Currently these assets are not centrally managed.

**Scope:** Identify, download, and organize source files into the `src/` directory. Ensure licensing compliance and version control.

**Success Criteria:**
- All required assets are present in the repository under `src/`.
- Asset list documented in `assets.txt`.
- CI job validates asset presence.
