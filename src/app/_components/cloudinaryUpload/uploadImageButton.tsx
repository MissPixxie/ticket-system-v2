"use client";

import { CldUploadWidget } from "next-cloudinary";
import { FiUpload } from "react-icons/fi";

type Props = {
  onUpload: (publicId: string) => void;
  children?: (open: () => void) => React.ReactNode;
};

export function UploadImageButton({ onUpload, children }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="dev_preset"
      onSuccess={(result) => {
        const info = result.info;

        if (info && typeof info === "object" && "public_id" in info) {
          setTimeout(() => {
            document.body.style.overflow = "";
          }, 300);

          onUpload(info.public_id as string);
        }
      }}
    >
      {({ open }) => {
        if (children) {
          return children(() => open?.());
        }

        return (
          <button
            type="button"
            onClick={() => open?.()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/5 py-8 transition-all duration-200 hover:border-purple-400 hover:bg-white/10"
          >
            <FiUpload size={34} className="text-purple-300" />

            <div className="text-center">
              <p className="font-semibold text-white">Lägg till bild</p>

              <p className="mt-1 text-sm text-white/50">
                Klicka för att välja en bild
              </p>
            </div>
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
