#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const [desktopPath, mobilePath, outPathArg] = process.argv.slice(2);
if (!desktopPath || !mobilePath) {
  console.error('Usage: node qa/llm-evaluate-screenshots.mjs <desktop.png> <mobile.png> [out.md]');
  process.exit(2);
}

const outPath = outPathArg || 'qa/reports/latest-llm-visual-eval.md';
mkdirSync(resolve(outPath, '..'), { recursive: true });

const apiKey = process.env.OPENAI_API_KEY;
const prompt = `You are a brutally honest visual QA reviewer for a luxury art advisory website serving ultra-high-net-worth collectors.

Evaluate the attached LIVE screenshot artifacts, not source code and not a description.

Standard: could this credibly go in front of Steve Wynn or a top-tier art advisory buyer?

Return Markdown with:
1. Verdict: pass / not pass
2. Score out of 5
3. Concrete visual blockers only
4. Required fixes in priority order

Do not flatter. Do not discuss implementation unless the visual artifact proves it.`;

function imageBlock(path) {
  const b64 = readFileSync(path).toString('base64');
  return {
    type: 'input_image',
    image_url: `data:image/png;base64,${b64}`,
  };
}

if (!apiKey) {
  const md = `# LLM Visual Evaluation Pending\n\nNo OPENAI_API_KEY was available in this environment.\n\nScreenshots requiring LLM evaluation:\n- ${desktopPath}\n- ${mobilePath}\n\nThis is a blocking QA gate: do not call the site executive-ready until an LLM vision review evaluates these exact screenshot artifacts.\n`;
  writeFileSync(outPath, md);
  console.log(outPath);
  process.exit(0);
}

const body = {
  model: process.env.VISUAL_QA_MODEL || 'gpt-4.1',
  input: [
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prompt },
        { type: 'input_text', text: `Desktop screenshot artifact: ${basename(desktopPath)}` },
        imageBlock(desktopPath),
        { type: 'input_text', text: `Mobile screenshot artifact: ${basename(mobilePath)}` },
        imageBlock(mobilePath),
      ],
    },
  ],
};

const res = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(`OpenAI visual QA failed ${res.status}: ${text}`);
}
const json = await res.json();
const output = json.output_text || json.output?.flatMap((item) => item.content || []).map((part) => part.text || '').join('\n') || JSON.stringify(json, null, 2);
const md = `# LLM Visual Evaluation\n\nGenerated: ${new Date().toISOString()}\nModel: ${body.model}\n\nScreenshots evaluated:\n- ${desktopPath}\n- ${mobilePath}\n\n---\n\n${output}\n`;
writeFileSync(outPath, md);
console.log(outPath);
