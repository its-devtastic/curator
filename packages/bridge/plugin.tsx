import * as R from "ramda";
import Cookies from "js-cookie";
import { CuratorConfig } from "@curatorjs/studio";

import { COOKIE_NAME } from "./constants";

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
            Cookies.set(COOKIE_NAME, token, {
              domain: options.domain,
            });
          },
        },
        {
          trigger: "logout",
          action() {
            Cookies.remove(COOKIE_NAME, {
              domain: options.domain,
            });
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
