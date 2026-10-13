import CLASSIC_EXAMPLES from './classic';
import EM_EXAMPLES from './electromagnetism';
import MECHANICS_EXAMPLES from './mechanics';
import MODERN_EXAMPLES from './modern';
import THERMAL_EXAMPLES from './thermal';
import WAVE_EXAMPLES from './waves';
import type { ExampleDef } from './types';

export * from './types';

/** Built-in examples: the original set first, then the university-physics labs. */
const EXAMPLES: ExampleDef[] = [...CLASSIC_EXAMPLES, ...MECHANICS_EXAMPLES, ...WAVE_EXAMPLES, ...THERMAL_EXAMPLES, ...EM_EXAMPLES, ...MODERN_EXAMPLES];

export default EXAMPLES;
