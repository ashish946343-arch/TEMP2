export function routeQuery(query) {
  if (!query) return "SEMANTIC_SEARCH";
  const q = query.toLowerCase();

  if (
    q.includes("what changed") ||
    q.includes("change") ||
    q.includes("difference") ||
    q.includes("before and after")
  ) {
    return "CHANGE_DETECTION";
  }

  if (
    q.includes("similar") ||
    q.includes("like this image")
  ) {
    return "IMAGE_SEARCH";
  }

  return "SEMANTIC_SEARCH";
}
