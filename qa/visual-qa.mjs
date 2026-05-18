#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.argv[2] || 'https://c3po-ravejedi.github.io/bultman-advisory-client-portal/';
const outDir = resolve(process.argv[3] || 'qa/reports');
mkdirSync(outDir, { recursive: true });

const rubric = [
  ['First impression', 'Does the hero immediately feel like private wealth / art advisory, not generic SaaS?'],
  ['Brand fidelity', 'Does the tone echo BultmanAdvisory.com: editorial, legacy-led, restrained, high-trust?'],
  ['Luxury polish', 'Are typography, spacing, color, borders, and CTAs quiet and expensive?'],
  ['Narrative depth', 'Does it explain why Bultman is credible before introducing product/portal mechanics?'],
  ['Portal credibility', 'Does the client portal feel useful without cheapening the advisory brand?'],
  ['Executive-readiness', 'Could this sit in front of Steve Wynn without feeling amateur, underbuilt, or startup-y?'],
];

const report = `# Bultman Advisory Visual QA Harness\n\nURL: ${url}\nGenerated: ${new Date().toISOString()}\n\n## Rubric\n\n${rubric.map(([name, prompt], i) => `${i + 1}. **${name}** — ${prompt}`).join('\n')}\n\n## Required Evidence\n\n- Capture full-page desktop screenshot at 1440px width.\n- Capture mobile screenshot around 390px width.\n- Verify live deployed assets, not local dev server.\n- Score each rubric item 1-5. Anything below 4 requires a patch before calling it client-ready.\n\n## Manual Steve Wynn Gate\n\nPass only if the page feels like an extension of a discreet art advisory practice, not a pitch deck, generic portal product, or AI-generated brochure.\n`;

writeFileSync(resolve(outDir, 'visual-qa-rubric.md'), report);
console.log(resolve(outDir, 'visual-qa-rubric.md'));
