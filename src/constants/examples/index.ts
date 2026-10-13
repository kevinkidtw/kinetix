import CLASSIC_EXAMPLES from './classic';
import DYNAMICS_EXAMPLES from './dynamics';
import EM_EXAMPLES from './electromagnetism';
import EM2_EXAMPLES from './electromagnetism2';
import FOUNDATION_EXAMPLES from './foundations';
import MECHANICS_EXAMPLES from './mechanics';
import MECHANICS2_EXAMPLES from './mechanics2';
import MODERN_EXAMPLES from './modern';
import OPTICS_EXAMPLES from './optics';
import QUANTUM_EXAMPLES from './quantum';
import THERMAL_EXAMPLES from './thermal';
import THERMAL2_EXAMPLES from './thermal2';
import WAVE_EXAMPLES from './waves';
import type { ExampleDef } from './types';

export * from './types';

/** Built-in examples: the foundational set first, then the university-physics labs by topic. */
const EXAMPLES: ExampleDef[] = [
  ...FOUNDATION_EXAMPLES,
  ...CLASSIC_EXAMPLES,
  ...MECHANICS_EXAMPLES,
  ...MECHANICS2_EXAMPLES,
  ...DYNAMICS_EXAMPLES,
  ...WAVE_EXAMPLES,
  ...OPTICS_EXAMPLES,
  ...THERMAL_EXAMPLES,
  ...THERMAL2_EXAMPLES,
  ...EM_EXAMPLES,
  ...EM2_EXAMPLES,
  ...MODERN_EXAMPLES,
  ...QUANTUM_EXAMPLES,
];

export default EXAMPLES;
