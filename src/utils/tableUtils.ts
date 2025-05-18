export type SortOrder = "asc" | "desc";

export const handleSort = <T extends string>(
  field: T,
  currentField: T,
  currentOrder: SortOrder,
  setSortField: (field: T) => void,
  setSortOrder: (order: SortOrder) => void,
) => {
  if (field === currentField) {
    setSortOrder(currentOrder === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${hours}h ${mins}m ${secs}s`;
};
