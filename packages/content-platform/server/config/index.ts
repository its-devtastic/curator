export default {
  default: {
    /*
     * Eiter a boolean to enable/disable or a configuration object:
     * {
     *  include: ['plugin::my-plugin.my-content-type'],
     *  exclude: ['api::page.page']
     * }
     */
    audit: true,
  },
  validator(config: Record<string, any>) {
    if (typeof config.audit !== "boolean" && typeof config.audit !== "object") {
      throw new Error("`audit` has to be either boolean or an object.");
    }
  },
};
