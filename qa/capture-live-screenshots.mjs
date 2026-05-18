#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.argv[2] || 'https://c3po-ravejedi.github.io/bultman-advisory-client-portal/';
const outDir = resolve(process.argv[3] || 'qa/screenshots');
mkdirSync(outDir, { recursive: true });

async function capture(page, width, height, name) {
  await page.setViewportSize({ width, height });
  await page.goto(`${url}?visualQa=${Date.now()}-${name}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.images];
    await Promise.all(images.map((img) => img.complete && img.naturalWidth > 0 ? true : new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
  });
  await page.waitForTimeout(750);
  await page.screenshot({ path: resolve(outDir, name), fullPage: true });
}

const browser = await chromium.launch();
const page = await browser.newPage();
await capture(page, 1440, 1800, 'desktop-1440.png');
await capture(page, 390, 844, 'mobile-390.png');
await browser.close();

writeFileSync(resolve(outDir, 'README.md'), `# Live Visual QA Screenshots\n\nURL: ${url}\nCaptured: ${new Date().toISOString()}\n\nFiles:\n- desktop-1440.png\n- mobile-390.png\n`);
