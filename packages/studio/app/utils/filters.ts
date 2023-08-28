import * as R from "ramda";

/**
 * Parses filter search parameters into a nested object.
 *
 * @example
 * filters[$and][0][createdAt][$gte]=2023-12-05 will be parsed as:
 * {
 *    createdAt: {
 *      $gte: "2023-12-05"
 *    }
 * }
 */
export function parseFilterParams(params: URLSearchParams) {
  return Array.from(params.entries()).reduce((result, [key, value]) => {
    if (!key.startsWith("filters")) {
      return result;
    }
    const path = R.pipe(
      R.split(/[\[\]]/g),
      R.reject(R.anyPass([R.isEmpty, R.test(/^\d+$/), R.equals("$and")])),
      R.tail
    )(key);

    return R.assocPath(path as (string | number)[], value, result);
  }, {});
}

export function serializeFilterParams(
  filters: Record<string, Record<string, string>>
): Record<string, string> {
  return Object.entries(filters)
    .map(([path, filter]) => [path, ...Object.entries(filter)])
    .reduce(
      (result, [path, [operator, value]], idx) => ({
        ...result,
        [`filters[$and][${idx}][${path}][${operator}]`]: value,
      }),
      {}
    );
}
