// Utility function to reuse search bar filter logic
export function searchRows(rows: any, searchTerm: string) {
  if (!searchTerm) return rows;

  const term = searchTerm.toLowerCase();

  return rows.filter((row: any) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(term)
    )
  );
}
