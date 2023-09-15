import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";

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
