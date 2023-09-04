export default {
  default: {
    audit: true,
  },
  validator(config: Record<string, any>) {
    if (typeof config.audit !== "boolean" && typeof config.audit !== "object") {
      throw new Error("`audit` has to be either boolean or an object.");
    }
  },
};
