export function parseBooleanParam(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
}

export function parseFilterParams(query) {
  const { isFavourite, type } = query;

  const parsedIsFavourite = parseBooleanParam(isFavourite);

  const allowedTypes = ['work', 'home', 'personal'];
  const parsedType = allowedTypes.includes(type) ? type : undefined;

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
}
