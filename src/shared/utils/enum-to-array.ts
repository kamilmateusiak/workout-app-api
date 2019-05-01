export function enumToArray(enumVariable: any): string[] {
  return Object.keys(enumVariable).map(key => enumVariable[key]);
}
