import type { SimulationState } from '../../types/simulation';

export type ExampleDifficulty = '入門' | '基礎' | '進階';

export const EXAMPLE_CATEGORIES = [
  '力學',
  '振動與波動',
  '光學',
  '熱學與統計',
  '電磁學',
  '近代物理',
] as const;

export type ExampleCategory = (typeof EXAMPLE_CATEGORIES)[number];

/**
 * A built-in example: a full simulation plus its lab handout.
 * `description` is the Markdown + KaTeX handout loaded into the 教學描述 tab;
 * `listDescription` is the one-paragraph summary shown on the example card.
 */
export type ExampleDef = SimulationState & {
  id: string;
  description: string;
  listDescription: string;
  difficulty: ExampleDifficulty;
  category: ExampleCategory;
};
