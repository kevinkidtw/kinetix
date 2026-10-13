import type { SimulationVariable, ViewElement } from '../../types/simulation';
import { DRAW_LIB } from './drawLib';

// Compact builders for the example definitions.

/** Builds global `double` variables from compact `[name, value, comment]` rows. */
export function doubles(prefix: string, rows: [string, string, string][]): SimulationVariable[] {
  return rows.map(([name, value, comment]) => ({
    id: `${prefix}-${name}`,
    name,
    value,
    type: 'double',
    comment,
    page: 'Variables',
    scope: 'global',
  }));
}

/** A square-ish drawing panel. Ranges are world coordinates. */
export function drawingPanel(
  id: string,
  width: number,
  height: number,
  [minX, maxX, minY, maxY]: [number, number, number, number],
  squareAspect = false
): ViewElement {
  return {
    id,
    type: 'Elements.DrawingPanel',
    name: 'DrawingPanel1',
    parent: '',
    properties: {
      Width: String(width),
      Height: String(height),
      MinimumX: String(minX),
      MaximumX: String(maxX),
      MinimumY: String(minY),
      MaximumY: String(maxY),
      Background: '"#FFFDF8"',
      SquareAspect: String(squareAspect),
    },
  };
}

export function slider(
  id: string,
  variable: string,
  min: number,
  max: number,
  step: number,
  label: string
): ViewElement {
  return {
    id,
    type: 'Elements.Slider',
    name: `滑桿_${variable}`,
    parent: '',
    properties: { Variable: variable, Minimum: String(min), Maximum: String(max), Step: String(step), Label: label },
  };
}

export function button(id: string, text: string, onClick: string): ViewElement {
  return {
    id,
    type: 'Elements.Button',
    name: text,
    parent: '',
    properties: { Text: `"${text}"`, OnClick: onClick },
  };
}

/** CustomDraw element whose code is prefixed with the shared DRAW_LIB helpers. */
export function customDraw(id: string, name: string, code: string): ViewElement {
  return {
    id,
    type: 'Elements.CustomDraw',
    name,
    parent: 'DrawingPanel1',
    properties: { Code: DRAW_LIB + code.trim() + '\n' },
  };
}
