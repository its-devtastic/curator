import React from "react";
import { useSecrets } from "@curatorjs/core";

const PlausibleDashboard: React.FC<{ sharedLink: string }> = ({
  sharedLink,
}) => {
  const { getSecret } = useSecrets();

  return (
    <div className="flex-1 overflow-hidden">
      <iframe
        plausible-embed
        src={getSecret(sharedLink)}
        loading="lazy"
        className="min-w-full h-full border-0"
      />
    </div>
  );
};

export default PlausibleDashboard;
