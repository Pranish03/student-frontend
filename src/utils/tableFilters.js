export const filterSpecificColumns = (...columns) => {
  return (row, _, filterValue) => {
    if (!filterValue) return true;

    const searchableColumns = columns;

    return searchableColumns.some((columnId) => {
      const value = row.getValue(columnId);
      if (value == null) return false;

      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    });
  };
};
