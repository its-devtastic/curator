/**
 * Takes a URLSearchParams instance and returns a plain javascript object.
 */
export function convertSearchParamsToObject(
  params: URLSearchParams
): Record<string, any> {
  return Array.from(params.entries()).reduce(
    (result, [key, value]) => ({ ...result, [key]: value }),
    {}
  );
}
