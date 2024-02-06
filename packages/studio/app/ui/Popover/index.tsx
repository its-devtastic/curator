import { Popover as BasePopover, PopoverProps } from "antd";
import React, { useState } from "react";

const Popover: React.FC<
  { content(close: VoidFunction): React.ReactNode } & Omit<
    PopoverProps,
    "content"
  >
> = ({ content, children, onOpenChange, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <BasePopover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange?.(open);
      }}
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
