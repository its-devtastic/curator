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
      /*
       * Relations are filtered in Strapi using a nested filter ([id][$eq]).
       * Because Curator doesn't support nested filters we translate it to a
       * special operator called `$relation`.
       */
      R.replace(/]\[id]\[\$eq]/g, "[$relation]"),
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
    .map(([path, filter]) => [path, Object.entries(filter)[0]])
    .reduce(
      (result, [path, condition], idx) =>
        condition
          ? {
              ...result,
              [`filters[$and][${idx}][${path}]${
                condition[0] === "$relation" ? "[id][$eq]" : `[${condition[0]}]`
              }`]: condition[1],
            }
          : result,
      {}
    );
}

/**
 * Serializes a nested object to the form [key1][key2][key3]=value
 *
 * Expects each nested object to only contain one key.
 */
function serializeObj(obj: Record<string, any>): string {
  const key = Object.keys(obj)[0];
  const value = Object.values(obj)[0];

  return `[${key}]${
    typeof value === "string" ? `=${value}` : serializeObj(value)
  }`;
}
