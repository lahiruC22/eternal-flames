/**
 * Calculate masonry pattern for memory grid
 * Every 4th item (index 0, 4, 8...) spans 2 columns for visual rhythm
 */
export function getMasonryPattern(index: number): {
  isWide: boolean;
  colSpan: string;
} {
  const position = index % 4;
  const isWide = position === 0 && index > 0;
  const colSpan = isWide ? 'col-span-2' : 'col-span-1';

  return { isWide, colSpan };
}
