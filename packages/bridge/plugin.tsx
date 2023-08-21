import * as R from "ramda";
import Cookies from "js-cookie";
import { CuratorConfig } from "@curatorjs/studio";

import {
  CURATOR_BRIDGE_USER_TOKEN,
  CURATOR_BRIDGE_LAST_UPDATE,
} from "./constants";

export default function bridgePlugin(options: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      hooks: R.concat([
        {
          trigger: "login",
          action({ entity: { token } }: any) {
            if (!options.domain) {
              return console.error(
                "[Curator Bridge] You did not include a domain in the bridge plugin settings."
              );
            }
            Cookies.set(CURATOR_BRIDGE_USER_TOKEN, token, {
              domain: options.domain,
            });
          },
        },
        {
          trigger: "logout",
          action() {
            Cookies.remove(CURATOR_BRIDGE_USER_TOKEN, {
              domain: options.domain,
            });
          },
        },
        {
          trigger: "save",
          action() {
            Cookies.set(
              CURATOR_BRIDGE_LAST_UPDATE,
              String(new Date().valueOf()),
              {
                domain: options.domain,
              }
            );
          },
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  /*
   * Domain of your website.
   */
  domain: string;
}
