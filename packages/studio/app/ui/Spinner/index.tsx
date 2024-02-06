import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spin } from "antd";
import React from "react";

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <Spin
    indicator={
      <FontAwesomeIcon
        icon={faSpinner}
        style={{ fontSize: size }}
        className="animate-spin"
      />
    }
  />
);

export default Spinner;
