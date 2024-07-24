"use client";

import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

function Modal({
  visible,
  onClose,
  children,
  width
}: {
  visible: boolean;
  onClose: VoidFunction;
  children: ReactNode;
  width: string
}) {
  const handleOnClose = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (document.getElementById("container") == event.target) {
      onClose();
    }
  };

  if (!visible) return null;
  return (
    <div
      id="container"
      onClick={(e) => handleOnClose(e)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-md"
    >
      <div className={`h-auto max-h-[95%] ${width} overflow-auto rounded-[28px] bg-white px-[5.75%] py-12 lg:py-16 relative`} style={{boxShadow: "0px 4px 20px 2px rgba(0, 0, 0, 0.25)"}}>
        <div className="absolute top-4 lg:top-8 right-4 lg:right-8 text-[20px] md:text-[24px] lg:text-[28px] cursor-pointer" onClick={() => onClose()}><IoMdClose/></div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
