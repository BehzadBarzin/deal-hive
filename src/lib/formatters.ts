// -------------------------------------------------------------------------------------------------
// Format number: 100000 → 100K
const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

// -------------------------------------------------------------------------------------------------
