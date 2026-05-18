#!/usr/bin/env node
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(`${process.cwd()}/`);
const playwrightPath = process.env.PLAYWRIGHT_REQUIRE_PATH || 'playwright';
const { chromium } = require(playwrightPath);

const url = process.argv[2] || 'http://127.0.0.1:4173/';
const out = resolve(process.argv[3] || 'qa/reports/functional-qa.json');
mkdirSync(resolve(out, '..'), { recursive: true });

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || process.env.CHROME_BIN;
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const events = [];
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') events.push(`console:${msg.type()}:${msg.text()}`);
});
page.on('pageerror', (err) => events.push(`pageerror:${err.message}`));

const checks = [];
const assertText = async (label, text) => {
  const found = await page.getByText(text, { exact: false }).first().isVisible().catch(() => false);
  checks.push({ label, pass: found, expectedText: text });
  if (!found) throw new Error(`${label} failed: missing ${text}`);
};

await page.goto(url, { waitUntil: 'networkidle' });
await assertText('public hero readable', 'Stewardship for important collections');
await page.getByRole('button', { name: /private client portal/i }).click();
await assertText('login screen opens', 'Secure portal access');
await page.getByLabel(/role preview/i).selectOption('Owner');
await page.getByRole('button', { name: /enter secure portal/i }).click();
await assertText('owner portal opens', 'Tristan Bultman');

await page.getByRole('button', { name: /mark done/i }).first().click();
await assertText('action completion changes state', 'Completed and audit logged');

await page.getByRole('button', { name: /add artwork/i }).click();
await assertText('add artwork button creates intake', 'Prototype artwork intake added');
await assertText('artwork workspace opens', 'New work added to review queue');
await assertText('new artwork visible', 'Alma Thomas');

await page.getByRole('button', { name: /manage users/i }).click();
await assertText('manage users opens', 'Portal access roster');
await assertText('user roster visible', 'Leigh Mozes');

await page.getByPlaceholder(/write a secure message/i).fill('Functional QA confirms secure messaging works.');
await page.getByRole('button', { name: /send message/i }).click();
await assertText('message send creates thread item', 'Functional QA confirms secure messaging works.');

await page.getByRole('button', { name: /reset demo data/i }).click();
await assertText('reset demo button reports state', 'Demo data reset.');

await page.getByRole('button', { name: /sign out/i }).click();
await assertText('sign out returns to public site', 'Private art advisory');

const result = { url, generatedAt: new Date().toISOString(), pass: checks.every((item) => item.pass) && events.length === 0, checks, events };
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

if (!result.pass) process.exit(1);
