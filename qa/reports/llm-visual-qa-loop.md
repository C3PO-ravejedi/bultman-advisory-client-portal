# LLM Visual QA Loop

This project must not rely on build success or subjective status updates for visual quality.

Required loop:

1. Deploy the live site.
2. Capture live desktop and mobile screenshots through the Visual QA workflow.
3. Evaluate the screenshot artifacts themselves with an LLM vision model.
4. Treat LLM findings as the patch list.
5. Rebuild, redeploy, recapture, and re-evaluate until no blocker remains.

Current standard: the site must be credible in front of Steve Wynn / ultra-high-net-worth art advisory buyers.

Artifacts:
- `qa/screenshots/desktop-1440.png`
- `qa/screenshots/mobile-390.png`
- `qa/screenshots/llm-visual-eval.md`

If `llm-visual-eval.md` says evaluation is pending because no `OPENAI_API_KEY` exists, the gate is incomplete.
