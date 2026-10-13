import { describe, expect, it } from 'vitest';
import { computePanelLayout, type LayoutElement } from '../layout';

const ctrl = (id: string, extra: Partial<LayoutElement> = {}): LayoutElement => ({
  id,
  type: 'Elements.Button',
  name: id,
  properties: {},
  ...extra,
});

describe('control layout', () => {
  it('places controls without coordinates side by side', () => {
    const { ctrlItems } = computePanelLayout([ctrl('a'), ctrl('b'), ctrl('c', { type: 'Elements.CheckBox' })]);
    expect(new Set(ctrlItems.map((i) => i.x)).size).toBe(3);
  });

  it('ignores coordinates that stack every control on one spot', () => {
    // Older editor versions gave every new element x = y = 20.
    const { ctrlItems } = computePanelLayout([ctrl('a', { x: 20, y: 20 }), ctrl('b', { x: 20, y: 20 })]);
    expect(ctrlItems[0].x).not.toBe(ctrlItems[1].x);
  });

  it('keeps a hand-made layout', () => {
    const { ctrlItems } = computePanelLayout([ctrl('a', { x: 0, y: 0 }), ctrl('b', { x: 0, y: 50 })]);
    expect(ctrlItems.map((i) => [i.x, i.y])).toEqual([[0, 0], [0, 50]]);
  });
});
