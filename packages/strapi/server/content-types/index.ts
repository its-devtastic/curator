import secretSchema from "./secret";
import auditSchema from "./audit";

export default {
  "curator-secret": { schema: secretSchema },
  "curator-audit-log": { schema: auditSchema },
};
