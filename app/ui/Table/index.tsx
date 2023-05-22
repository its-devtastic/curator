import React from "react";
import { Table as BaseTable, TableProps } from "antd";
import { useTranslation } from "react-i18next";

const Table: React.FC<TableProps<any>> = ({ ...props }) => {
  const { t } = useTranslation();

  return <BaseTable pagination={false} {...props} />;
};

export default Table;
