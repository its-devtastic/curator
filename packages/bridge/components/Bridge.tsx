"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { createRoot } from "react-dom/client";

import {
  CURATOR_BRIDGE_USER_TOKEN,
  CURATOR_BRIDGE_LAST_UPDATE,
} from "../constants";
import useBridge from "../store";
import BridgeConnector from "./BridgeConnector";

const Bridge: React.FC<BridgeProps> = ({
  studioUrl,
  strapiUrl,
  refreshAfterChanges = false,
}) => {
  const { token, user, setState } = useBridge();
  useEffect(() => {
    (async () => {
      const token = Cookies.get(CURATOR_BRIDGE_USER_TOKEN);

      if (!token) {
        return;
      }

      setState({ token, strapiUrl, studioUrl });

      try {
        const response = await fetch(`${strapiUrl}/admin/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = (await response.json()).data;
        setState({ user });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      document
        .querySelectorAll("[data-bridge-connect]:not([data-bridge-init])")
        .forEach((element) => {
          element.setAttribute("data-bridge-init", "");
          const apiID =
            element.attributes.getNamedItem("data-bridge-api-id")?.value;
          const id = element.attributes.getNamedItem("data-bridge-id")?.value;

          if (!apiID || !id) {
            return console.error(
              "API ID or ID missing. Make sure to set both using `data-bridge-id` and `data-bridge-api-id` attributes."
            );
          }

          const entryPoint = document.createElement("div");
          element.append(entryPoint);
          element.classList.add("cb-bridge-item");

          const root = createRoot(entryPoint);
          root.render(<BridgeConnector apiID={apiID} id={Number(id)} />);
        });
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let lastUpdated: number | null = null;

    const interval = setInterval(() => {
      const time = Cookies.get(CURATOR_BRIDGE_LAST_UPDATE);

      if (time) {
        if (lastUpdated && lastUpdated < Number(time)) {
          // @ts-ignore
          refreshAfterChanges && window.location.reload(true);
        }
        lastUpdated = Number(time);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return token ? (
    <div className="cb-h-8">
      <div className="cb-h-8 cb-px-4 cb-font-sans cb-bg-emerald-300 cb-text-slate-600 cb-text-xs cb-font-semibold cb-flex cb-items-center cb-justify-between cb-fixed cb-z-50 cb-left-0 cb-top-0 cb-right-0">
        <div className="cb-flex cb-items-center cb-gap-3">
          <FontAwesomeIcon
            icon={faTowerBroadcast}
            title="Connected to Strapi"
          />
          <span>
            {user ? (
              <div>
                {["Logged in as", user.firstname, user.lastname]
                  .filter(Boolean)
                  .join(" ")}
              </div>
            ) : (
              "Connecting..."
            )}
          </span>
        </div>
        <div className="cb-flex cb-items-center">
          <a
            href={studioUrl}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="cb-cursor-pointer cb-inline-flex cb-items-center cb-gap-1 cb-px-2 cb-py-1 cb-rounded-md hover:cb-bg-emerald-400"
          >
            Go to Studio <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Bridge;

interface BridgeProps {
  /*
   * URL of the Curator Studio application.
   */
  studioUrl: string;
  /*
   * URL of the Strapi instance.
   */
  strapiUrl: string;
  /*
   * Reload website page after changes have been detected in Curator Studio.
   */
  refreshAfterChanges?: boolean;
}
