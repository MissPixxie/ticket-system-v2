"use client";

import ReactDOM from "react-dom";
import { CldImage } from "next-cloudinary";

type ImagePreviewModalProps = {
  isOpen: boolean;
  imagePublicId: string;
  onClose: () => void;
};

export function ImagePreviewModal({
  isOpen,
  imagePublicId,
  onClose,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <CldImage
          src={imagePublicId}
          width={1600}
          height={1600}
          alt="Förhandsvisning"
          className="max-h-[90vh] w-auto rounded-2xl object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
