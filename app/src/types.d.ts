// Módulos JS compartidos con la landing (generadores SVG sin tipos).
declare module '@landing/lib/art.js' {
  export function logoIconSVG(w: number, dark: boolean): string;
}
declare module '@landing/lib/scene.js' {
  export function heroSceneSVG(): string;
}
