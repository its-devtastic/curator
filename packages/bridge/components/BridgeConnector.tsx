"use client";
import React from "react";

import useBridge from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

const BridgeConnector: React.FC<BridgeConnectorProps> = ({ apiID, id }) => {
  const { token, studioUrl } = useBridge();

  return token ? (
    <div>
      <div className="cb-bridge-item-backdrop -cb-z-10 cb-bg-blue-500/10 cb-absolute -cb-top-2 -cb-left-2 -cb-right-2 -cb-bottom-2 cb-rounded-lg" />
      <div className="cb-bridge-actions cb-absolute cb-z-40 cb-whitespace-nowrap cb-translate-x-full cb-right-0 cb-top-0 cb-bg-white cb-rounded-md cb-shadow-lg cb-shadow-slate-700/5">
        <a
          href={`${studioUrl}/content-manager/${apiID}/${id}`}
          target="_blank"
          rel="noreferrer nofollow noopener"
          className="cb-p-2 cb-space-x-2 cb-text-xs hover:cb-bg-slate-50 first-of-type:cb-rounded-l-md last-of-type:cb-rounded-r-md"
        >
          <span>View in Studio</span>
          <FontAwesomeIcon icon={faExternalLink} />
        </a>
      </div>
    </div>
  ) : null;
};

export default BridgeConnector;

interface BridgeConnectorProps {
  /*
   * The content type's API ID.
   */
  apiID: string;
  /*
   * The content's ID.
   */
  id: number;
}
