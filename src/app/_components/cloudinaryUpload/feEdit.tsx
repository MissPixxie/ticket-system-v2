"use client";

import { FaEdit } from "react-icons/fa";
import { UploadImageButton } from "./uploadImageButton";

type Props = {
  onUpload: (publicId: string) => void;
};

export function EditImageButton({ onUpload }: Props) {
  return (
    <UploadImageButton onUpload={onUpload}>
      {(open) => (
        <button
          type="button"
          className="rounded-full bg-black/50 p-2 text-white transition hover:bg-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          <FaEdit size={16} />
        </button>
      )}
    </UploadImageButton>
  );
}
