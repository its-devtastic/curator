import React, { useState } from "react";
import { Popover as BasePopover, PopoverProps } from "antd";

const Popover: React.FC<
  { content(close: VoidFunction): React.ReactNode } & Omit<
    PopoverProps,
    "content"
  >
> = ({ content, children, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <BasePopover
      open={open}
      onOpenChange={setOpen}
      content={content(() => setOpen(false))}
      arrow={false}
      {...props}
      overlayClassName="border-solid border border-gray-200/80 rounded-md max-w-[100vw]"
    >
      {children}
    </BasePopover>
  );
};

export default Popover;
