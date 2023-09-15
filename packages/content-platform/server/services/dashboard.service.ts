import { Strapi } from "@strapi/strapi";
import * as R from "ramda";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getData() {
    const ctx = strapi.requestContext.get();

    const recent = await this.getRecent(ctx);
    const drafts = await this.getDrafts(ctx);

    return { recent, drafts };
  },
  /**
   * Get recently created or updated items.
   */
  async getRecent(ctx: any) {
    const user = ctx.state.user;
    const query = await strapi.entityService.findMany(
      "plugin::curator.curator-audit-log",
      {
        sort: "updatedAt:DESC",
        filters: {
          subjectId: user.id,
          objectUid: {
            $startsWith: "api::",
          },
          action: ["update", "create"],
        },
      },
    );

    const distinct: Record<string, any>[] = R.uniqBy(
      R.props(["objectId", "objectUid"]),
      query as any[],
    ).slice(0, 5);

    let results: any[] = [];

    for await (const item of distinct) {
      try {
        const data = await strapi.entityService.findOne(
          item.objectUid,
          item.objectId,
        );

        if (data) {
          results = [
            ...results,
            { uid: item.objectUid, id: item.objectId, attributes: data },
          ];
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return results;
  },

  /**
   * Get draft content created by the current user.
   */
  async getDrafts(ctx: any) {
    const user = ctx.state.user;

    const modelsWithDraftState = Object.values(strapi.contentTypes)
      .filter(R.path(["options", "draftAndPublish"]))
      .map<string>(R.prop<string>("uid"));

    let results: any[] = [];

    for await (const uid of modelsWithDraftState) {
      try {
        const data = (await strapi.entityService.findMany(uid as any, {
          sort: "updatedAt:DESC",
          filters: {
            createdBy: user.id,
            publishedAt: {
              $null: true,
            },
          },
        })) as any[];

        results = [
          ...results,
          ...data.map(({ id, ...attributes }) => ({ id, uid, attributes })),
        ];
      } catch (e) {
        console.warn(e);
      }
    }

    return results.slice(0, 10);
  },
});
