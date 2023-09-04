export default (options, { strapi }) => {
  return async (ctx, next) => {
    await next();
  };
};
