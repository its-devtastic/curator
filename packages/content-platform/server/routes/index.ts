export default [
  {
    method: "GET",
    path: "/secrets",
    handler: "secretsController.index",
    config: {},
  },
  {
    method: "GET",
    path: "/dashboard",
    handler: "dashboardController.index",
    config: {},
  },
  {
    method: "GET",
    path: "/versioning/:uid/:id",
    handler: "versioningController.list",
    config: {},
  },
];
