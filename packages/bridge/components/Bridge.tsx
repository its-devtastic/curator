"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";

import { COOKIE_NAME } from "../constants";
import useBridge from "../store";

const Bridge: React.FC<BridgeProps> = ({ studioUrl, strapiUrl }) => {
  const { token, user, setState } = useBridge();

  useEffect(() => {
    (async () => {
      const token = Cookies.get(COOKIE_NAME);

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
            className="cb-cursor-pointer cb-inline-flex cb-items-center cb-gap-1 cb-px-2 cb-py-1 cb-rounded-sm hover:cb-bg-emerald-400"
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
}
