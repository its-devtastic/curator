import React from "react";
import { Table as BaseTable, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

const Table: React.FC<TableProps<any>> = ({ className, ...props }) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        "border border-solid border-gray-200 rounded-lg overflow-hidden shadow-sm",
        className,
      )}
    >
      <BaseTable
        pagination={false}
        bordered={false}
        scroll={{ x: true }}
        {...props}
      />
    </div>
  );
};

export default Table;
