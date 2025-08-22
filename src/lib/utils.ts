// Minimal cn helper used by UI components
// Accepts strings/booleans/undefined and joins truthy class names
export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(" ");
}
