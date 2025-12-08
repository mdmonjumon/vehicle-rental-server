const filterWithoutUndefined = (obj: Record<string, unknown>) => {
  let parameterIndex = 1;
  const columnNameWithParameterIndex = [];
  const parameterValue = [];
  for (const key in obj) {
    if (obj[key] !== undefined) {
      columnNameWithParameterIndex.push(`${key}=$${parameterIndex}`);
      parameterValue.push(obj[key]);
      parameterIndex++;
    }
  }
  return { columnNameWithParameterIndex, parameterValue };
};

export default filterWithoutUndefined;
