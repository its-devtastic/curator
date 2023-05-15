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
      {...props}
    >
      {children}
    </BasePopover>
  );
};

export default Popover;
