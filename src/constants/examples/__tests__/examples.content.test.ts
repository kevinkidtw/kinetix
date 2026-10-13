import { describe, expect, it } from 'vitest';
import EXAMPLES, { EXAMPLE_CATEGORIES } from '..';

const REQUIRED_SECTIONS = ['實驗目的', '課前預報', '實驗原理', '實驗步驟', '探究問題', '延伸閱讀'];

/** Math segments ($$…$$ and $…$) of a Markdown handout. */
function mathSegments(md: string): string[] {
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push(m[1] ?? m[2]);
  return out;
}

describe('built-in example library', () => {
  it('has unique ids and complete card metadata', () => {
    const ids = EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const ex of EXAMPLES) {
      expect(ex.listDescription.length, ex.id).toBeGreaterThan(10);
      expect(EXAMPLE_CATEGORIES, ex.id).toContain(ex.category);
      expect(['入門', '基礎', '進階'], ex.id).toContain(ex.difficulty);
    }
  });

  it('gives every example a full lab handout', () => {
    for (const ex of EXAMPLES) {
      for (const section of REQUIRED_SECTIONS) {
        expect(ex.description, `${ex.id} is missing「${section}」`).toContain(section);
      }
    }
  });

  it('keeps handout math safe from Markdown escaping', () => {
    // marked runs before KaTeX, so these sequences would be mangled inside math.
    const forbidden: [RegExp, string][] = [
      [/\\[,;!{}\\()[\]_|#]/, 'Markdown backslash escape (\\, \\; \\! \\{ \\} \\\\ \\( \\[ \\_ \\| \\#)'],
      [/\*/, 'asterisk'],
      [/~/, 'tilde'],
      [/<[A-Za-z]/, '"<" followed by a letter (use \\lt)'],
      [/[)}\]]_/, 'subscript after a bracket (Markdown may read "_" as emphasis)'],
    ];
    for (const ex of EXAMPLES) {
      for (const seg of mathSegments(ex.description)) {
        for (const [re, what] of forbidden) {
          expect(re.test(seg), `${ex.id}: ${what} in math "${seg}"`).toBe(false);
        }
      }
      for (const line of ex.description.split('\n').filter((l) => l.trim().startsWith('|'))) {
        for (const seg of mathSegments(line)) {
          expect(seg.includes('|'), `${ex.id}: "|" inside math breaks the table row: ${line}`).toBe(false);
        }
      }
    }
  });

  it('compiles every CustomDraw script', () => {
    for (const ex of EXAMPLES) {
      for (const el of ex.viewElements.filter((e) => e.type === 'Elements.CustomDraw')) {
        expect(
          () => new Function('ctx', 'vars', 'toPixX', 'toPixY', 'toPixLen', 'W', 'H', 'drawVectorField', 'setVars', el.properties.Code),
          `${ex.id}/${el.name}`
        ).not.toThrow();
      }
    }
  });

  it('gives every example a data dashboard', () => {
    for (const ex of EXAMPLES) {
      const cards = ex.viewElements.filter((e) => e.type === 'Elements.Readout');
      expect(cards.length, `${ex.id} has too few dashboard cards`).toBeGreaterThanOrEqual(4);
    }
  });

  it('binds sliders and draggable shapes to declared variables', () => {
    for (const ex of EXAMPLES) {
      const names = new Set(ex.variables.map((v) => v.name));
      for (const el of ex.viewElements) {
        if (el.type === 'Elements.Slider') expect(names.has(el.properties.Variable), `${ex.id}: ${el.properties.Variable}`).toBe(true);
        if (el.type === 'Elements.Shape2D' && el.properties.Draggable === 'true') {
          expect(names.has(el.properties.X) && names.has(el.properties.Y), `${ex.id}: ${el.name}`).toBe(true);
        }
      }
    }
  });
});
