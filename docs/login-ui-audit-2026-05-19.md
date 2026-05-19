# Bultman Advisory Login UI Audit + Fix Plan

Date: 2026-05-19
Owner: Kassandra
Scope: client portal login in `src/App.tsx` (`PortalLogin`) and related CSS in `src/style.css`.
Evidence reviewed:
- `src/App.tsx`, especially `PortalLogin`
- `src/style.css`, especially `.login-shell`, `.login-card`, form/button styles
- Existing functional tests in `src/App.test.tsx`
- Local validation: `pnpm test` passed, `pnpm run build` passed with only the existing large chunk warning.

## Executive summary

The public Bultman site has been polished toward a serious advisory-house feel, but the portal login still reads like a prototype checkpoint instead of a private client access experience. It is functional, but it exposes implementation language (`prototype-only`, `Working prototype mode`, `Firebase connected`) too prominently and gives users a role preview selector on the login card. For a high-net-worth art advisory client portal, that weakens trust immediately.

This should be a targeted login-screen polish pass, not a full product redesign. Keep demo/prototype functionality available, but move it out of the primary visual hierarchy.

## Audit findings

### P0 / Must fix

1. **Prototype language is too visible**
   - Current UI shows `Working prototype mode` / `Firebase connected` near the top of the card.
   - Fine print says `Demo password: prototype-only`.
   - This is useful for demos, but it should not be the emotional headline of a private client portal.
   - Recommendation: replace with client-safe trust copy, then tuck demo details into a subdued helper/details block.

2. **Role preview selector breaks the illusion of secure access**
   - `Role preview` is useful for reviewers, but real users should not see a role chooser before authentication.
   - Recommendation: keep demo role switching available in prototype mode, but label it clearly as `Demo access level` and visually separate it from real credential fields; or hide it behind a `Demo controls` disclosure.

3. **Login card copy is generic**
   - Current: `Art · Legacy · Stewardship` and `Secure portal access for clients, advisors, and collaborators.`
   - Better for the actual portal:
     - Eyebrow: `Private Client Portal`
     - Title: `Bultman Advisory`
     - Subtitle: `Secure access to collection records, documents, messages, and advisory updates.`
   - Preserve the brand tone: calm, private, institutional, not SaaS-y.

4. **Primary CTA hierarchy should privilege secure entry**
   - `Enter secure portal` and `Continue with Google` are both full-width buttons but not staged as clearly as primary vs secondary.
   - Recommendation: make `Enter secure portal` primary, make Google a restrained secondary option, and add a small separator/helper line if needed.

### P1 / Should fix

5. **The login screen is visually less refined than the public site**
   - Public site has editorial typography and carefully tuned art/advisory tone.
   - Login is mostly a floating form over a stock art background.
   - Recommendation: create a two-panel/login dossier layout on desktop: editorial trust panel + credential card. Mobile can stay single-card.

6. **Background image dependency/stock feel**
   - Login background uses an Unsplash art image. The public-site work already had multiple corrections to avoid stock-photo luxury.
   - Recommendation: use a local asset if available, a refined gradient/archival paper treatment, or a subtle abstract art-panel motif instead of relying on a remote photo.

7. **Missing explicit privacy/trust cues**
   - The portal handles documents, collection inventory, valuations, messages, and audit trail.
   - Recommendation: add a small trust row/list: `Role-based access`, `Document audit trail`, `Private collection workspace`.

8. **Form lacks basic UX hardening**
   - Inputs do not specify `type="email"`, `autoComplete`, etc.
   - Login action can be clicked with empty email/password in demo mode.
   - Google login has no visible loading/error state.
   - Recommendation: add semantic input types/autocomplete, disabled/loading states, and a simple inline error/fallback message.

### P2 / Nice polish

9. **Mobile spacing and viewport fit**
   - Login card uses fixed-ish padding and may feel large on mobile.
   - Recommendation: QA at 390px/430px widths; ensure CTA and fine print fit without cramped line breaks.

10. **Regression coverage**
   - Current tests click into portal and assert login copy exists.
   - Add assertions for the upgraded login default state so future changes do not regress the trust language.

## Recommended design direction

- Mood: discreet private office, not demo app.
- Visual language: cream/paper, navy, gold, Cormorant + Libre Franklin; match existing Bultman site.
- Desktop layout:
  - Left/side editorial panel: `Private Client Portal`, short trust copy, three trust bullets.
  - Right credential card: email/password, primary CTA, secondary Google CTA, subdued demo controls.
- Mobile layout:
  - Single card, title first, trust cues compact, demo controls below primary form.
- Avoid:
  - Big `prototype` labels in the hero hierarchy.
  - Anything that suggests users can choose their own permissions.
  - More stock-photo luxury.

## Implementation plan

### Task 1 — Login copy + trust hierarchy

Update `PortalLogin` in `src/App.tsx`.

Acceptance criteria:
- Replace primary login copy with client-safe language.
- Use `Private Client Portal` as the primary eyebrow.
- Title should be `Bultman Advisory` or similarly brand-forward.
- Add 2–3 trust cues: role-based access, document audit trail, private collection workspace.
- Move `prototype-only`, `Working prototype mode`, and Firebase/demo details out of the main hierarchy.
- Do not remove demo functionality.

Validation:
- `pnpm test`
- `pnpm run build`

### Task 2 — Demo role controls separation

Update `PortalLogin` in `src/App.tsx`.

Acceptance criteria:
- Rename `Role preview` to `Demo access level` or similar.
- Visually separate demo controls from real login fields.
- Make clear that role selection is demo-only/prototype-only.
- Preserve current role-preview behavior for reviewers.
- Avoid making the screen feel insecure to actual client viewers.

Validation:
- Existing `App.test.tsx` role-switch/login test still passes.
- Add/update test text if the label changes.

### Task 3 — Premium login layout and CSS polish

Update `.login-shell`, `.login-card`, and related auth styles in `src/style.css`.

Acceptance criteria:
- Login visual style matches the refined public site: paper/cream/navy/gold, editorial typography, restrained private-office feel.
- Desktop layout can be a two-panel shell or an enhanced card; mobile must remain readable.
- Remove or reduce dependency on remote stock-image background if possible.
- CTA hierarchy is clear: primary secure portal button, secondary Google button.
- Inputs have clear focus states and enough contrast.

Validation:
- `pnpm run build`
- Manual screenshot or visual QA at desktop and mobile sizes if browser tooling is available.

### Task 4 — Login UX/accessibility/regression coverage

Update tests in `src/App.test.tsx`.

Acceptance criteria:
- Assert login screen shows the new private-client copy.
- Assert email and password fields are present and semantically typed where possible.
- Assert demo access-level control remains available in prototype mode.
- Existing portal action test still passes.
- Add coverage for empty/error/loading states if implementation introduces those states.

Validation:
- `pnpm test`
- `pnpm run build`

## Notes for implementation agents

- This is the Bultman project: `C3PO-ravejedi/bultman-advisory-client-portal`.
- Do not touch Flambé Automation.
- Do not remove demo login behavior; this prototype still needs reviewer-friendly access.
- Do not introduce a full routing/auth refactor.
- Keep changes small, reviewable, and aligned with the current site tone.
