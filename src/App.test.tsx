import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { demoUsers, artworks, documents } from './demoData';
import { MAX_CLIENT_DOCUMENT_BYTES, sanitizeStorageFileName, validateClientDocumentFile } from './firebase';

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  window.localStorage.clear();
  document.body.innerHTML = '';
});

function button(name: RegExp) {
  const buttons = [...document.querySelectorAll('button')];
  const match = buttons.find((item) => name.test(item.textContent ?? ''));
  if (!match) throw new Error(`Missing button: ${name}`);
  return match as HTMLButtonElement;
}

async function renderApp() {
  const host = document.createElement('div');
  document.body.appendChild(host);
  await act(async () => createRoot(host).render(<App />));
}

async function click(name: RegExp) {
  await act(async () => {
    button(name).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function emailInput() {
  const input = document.querySelector('input[type="email"]') as HTMLInputElement | null;
  if (!input) throw new Error('Missing email input');
  return input;
}

function passwordInput() {
  const input = document.querySelector('input[type="password"]') as HTMLInputElement | null;
  if (!input) throw new Error('Missing password input');
  return input;
}

function demoAccessSelect() {
  const select = document.querySelector('#demo-access-level') as HTMLSelectElement | null;
  if (!select) throw new Error('Missing demo access level select');
  return select;
}

describe('Bultman portal prototype data model', () => {
  it('ships all required role previews', () => {
    expect(demoUsers.map((user) => user.role)).toEqual(['Owner', 'Advisor', 'Client']);
  });

  it('has collection inventory and secure document examples', () => {
    expect(artworks.length).toBeGreaterThanOrEqual(3);
    expect(documents.some((doc) => doc.storagePath.startsWith('clients/'))).toBe(true);
  });

  it('keeps valuation data numeric for reporting', () => {
    expect(artworks.reduce((sum, art) => sum + art.valuation, 0)).toBeGreaterThan(1_000_000);
  });

  it('starts on the public advisory site, not the private portal', async () => {
    await renderApp();

    expect(document.body.textContent).toContain('Stewardship for');
    expect(document.body.textContent).toContain('Private art advisory');
    expect(document.querySelector('input[type="email"]')).toBeNull();
    expect(document.body.textContent).not.toContain('Welcome back');
  });

  it('opens the login screen with safe client demo defaults', async () => {
    await renderApp();

    await click(/client portal/i);

    expect(document.body.textContent).toContain('Private Client Portal');
    expect(emailInput().value).toBe('client@example.com');
    expect(passwordInput().value).toBe('prototype-only');
    expect(demoAccessSelect().value).toBe('Client');
    expect(document.body.textContent).toContain('Demo workspace active');
    expect(document.body.textContent).toContain('Prototype access uses prototype-only');
    expect(document.body.textContent).not.toContain('Welcome back');
  });

  it('enters the portal as the selected demo access level', async () => {
    await renderApp();
    await click(/client portal/i);

    const roleSelect = demoAccessSelect();
    await act(async () => {
      roleSelect.value = 'Advisor';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await click(/enter secure portal/i);

    expect(document.body.textContent).toContain('Welcome back');
    expect(document.body.textContent).toContain('Leigh Mozes');
    expect(document.body.textContent).toContain('Advisor access · Whitfield Family Collection');
    expect(document.body.textContent).toContain('Audit & Compliance');
    expect(document.body.textContent).not.toContain('Portal access roster');
  });

  it('makes key portal buttons perform visible actions', async () => {
    await renderApp();

    await click(/private client portal/i);
    expect(document.body.textContent).toContain('Private Client Portal');
    expect(document.body.textContent).toContain('Bultman Advisory');
    expect(document.body.textContent).toContain('Secure access to collection records');
    expect(document.body.textContent).toContain('Demo controls');
    expect(document.body.textContent).toContain('Demo access level');
    const emailInput = document.querySelector('#client-email') as HTMLInputElement | null;
    const passwordInput = document.querySelector('#client-password') as HTMLInputElement | null;
    expect(emailInput?.type).toBe('email');
    expect(emailInput?.value).toBe('client@example.com');
    expect(passwordInput?.type).toBe('password');
    expect(document.querySelector('label[for="client-email"]')?.textContent).toBe('Email');
    expect(document.querySelector('label[for="client-password"]')?.textContent).toBe('Password');
    expect(document.querySelector('fieldset.demo-access-box select#demo-access-level')).toBeTruthy();

    const roleSelect = document.querySelector('select') as HTMLSelectElement;
    await act(async () => {
      roleSelect.value = 'Owner';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await click(/enter secure portal/i);
    expect(document.body.textContent).toContain('Tristan Bultman');

    await click(/mark done/i);
    expect(document.body.textContent).toContain('Completed and audit logged');

    expect(document.body.textContent).toContain('Decision queue');
    await click(/^approve$/i);
    expect(document.body.textContent).toContain('approved and audit logged');

    await click(/open dossier/i);
    expect(document.body.textContent).toContain('Artwork Dossier');
    expect(document.body.textContent).toContain('Risk queue');
    expect(document.body.textContent).toContain('Related documents');

    await click(/add artwork/i);
    expect(document.body.textContent).toContain('Prototype artwork intake added');
    expect(document.body.textContent).toContain('Alma Thomas');
    expect(document.body.textContent).toContain('New work added to review queue');

    await click(/manage users/i);
    expect(document.body.textContent).toContain('Portal access roster');
    expect(document.body.textContent).toContain('Leigh Mozes');
  });

  it('sanitizes and validates client document uploads before Firebase Storage', () => {
    expect(sanitizeStorageFileName('../Estate Packet May 2026.pdf')).toBe('Estate-Packet-May-2026.pdf');
    expect(validateClientDocumentFile(new File(['ok'], 'condition.pdf', { type: 'application/pdf' }))).toBe('');
    expect(validateClientDocumentFile(new File(['bad'], 'script.html', { type: 'text/html' }))).toContain('Upload a PDF');
    const largeFile = new File([new Uint8Array(MAX_CLIENT_DOCUMENT_BYTES + 1)], 'large.pdf', { type: 'application/pdf' });
    expect(validateClientDocumentFile(largeFile)).toContain('25 MB');
  });
});
