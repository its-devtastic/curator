import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";

const icon = (
  <FontAwesomeIcon
    icon={faSpinner}
    style={{ fontSize: 24 }}
    className="animate-spin"
  />
);

const Spinner: React.FC = () => <Spin indicator={icon} />;

export default Spinner;
