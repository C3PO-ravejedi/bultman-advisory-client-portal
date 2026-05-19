import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { demoUsers, artworks, documents } from './demoData';

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

async function click(name: RegExp) {
  await act(async () => {
    button(name).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
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

  it('makes key portal buttons perform visible actions', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    await act(async () => createRoot(host).render(<App />));

    await click(/private client portal/i);
    expect(document.body.textContent).toContain('Private Client Portal');
    expect(document.body.textContent).toContain('Bultman Advisory');
    expect(document.body.textContent).toContain('Secure access to collection records');
    expect(document.body.textContent).toContain('Demo access level');
    expect((document.querySelector('input[type="email"]') as HTMLInputElement | null)?.value).toBe('client@example.com');
    expect(document.querySelector('input[type="password"]')).toBeTruthy();

    const roleSelect = document.querySelector('select') as HTMLSelectElement;
    await act(async () => {
      roleSelect.value = 'Owner';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await click(/enter secure portal/i);
    expect(document.body.textContent).toContain('Tristan Bultman');

    await click(/mark done/i);
    expect(document.body.textContent).toContain('Completed and audit logged');

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
});
