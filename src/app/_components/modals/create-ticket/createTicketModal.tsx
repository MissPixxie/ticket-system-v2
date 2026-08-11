"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  FaHandHoldingHeart,
  FaLaptop,
  FaShopify,
  FaShoppingCart,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSearchPlus,
} from "react-icons/fa";
import { UploadImageButton } from "../../cloudinaryUpload/uploadImageButton";
import { CldImage } from "next-cloudinary";
import { ImagePreviewModal } from "../imagePreviewModal";
import { EditImageButton } from "../../cloudinaryUpload/feEdit";
import CustomSelect from "../../customSelect";

export type Department = "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB";
export type Priority = "LOW" | "MEDIUM" | "URGENT";

export interface CreateTicketData {
  title: string;
  issue: string;
  department: Department;
  isAnonymous?: boolean;
  priority?: Priority;
  imagePublicId?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketData) => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<Priority>("LOW");
  const [department, setDepartment] = useState<Department>("IT");
  const [isSelected, setIsSelected] = useState<null | number>(null);
  const [imagePublicId, setImagePublicId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const departments = [
    { id: 1, value: "IT", label: "IT", icon: <FaLaptop size={22} /> },
    { id: 2, value: "HR", label: "HR", icon: <FaUsers size={22} /> },
    {
      id: 3,
      value: "CAMPAIGN",
      label: "Kampanj",
      icon: <FaShopify size={22} />,
    },
    {
      id: 4,
      value: "PRODUCT",
      label: "Produkt",
      icon: <FaShoppingCart size={22} />,
    },
    {
      id: 5,
      value: "CUSTOMERCLUB",
      label: "Kundklubb",
      icon: <FaHandHoldingHeart size={22} />,
    },
  ];

  const orderedDepartments = [...departments];
  if (isSelected !== null) {
    const index = orderedDepartments.findIndex((dep) => dep.id === isSelected);
    if (index !== -1) {
      const [selected] = orderedDepartments.splice(index, 1);
      if (selected) {
        orderedDepartments.splice(2, 0, selected);
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      issue,
      department,
      isAnonymous,
      priority,
      imagePublicId,
    });
    setTitle("");
    setIssue("");
    setDepartment("IT");
    setIsSelected(null);
    setIsAnonymous(false);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b from-[#3b0e7a]/70 to-[#282a53]/70 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {orderedDepartments.map((dep) => {
            const selected = isSelected === dep.id;

            return (
              <button
                key={dep.id}
                type="button"
                onClick={() => {
                  setDepartment(dep.value as Department);
                  setIsSelected(dep.id);
                }}
                className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border shadow-lg/40 transition-all duration-300 ${
                  selected
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : isSelected !== null
                      ? "notSelected"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <div
                  className={`transition-transform duration-200 ${
                    selected ? "scale-110" : ""
                  }`}
                >
                  {dep.icon}
                </div>

                <span className="text-sm font-medium">{dep.label}</span>
              </button>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input rounded-lg p-7 px-4 py-2 required:border-red-500 required:text-red-500"
          />
          <label htmlFor="issue">Beskriv problemet...</label>
          <textarea
            placeholder="Beskriv problemet"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="input h-full min-h-44 rounded-lg p-7 px-4 py-2 required:border-red-500 required:text-red-500"
          />
          <label className="mt-3 text-sm font-semibold">Bilaga</label>

          {!imagePublicId ? (
            <UploadImageButton
              onUpload={(publicId) => {
                setImagePublicId(publicId);
              }}
            />
          ) : (
            <div className="space-y-3">
              <div
                className="group relative overflow-hidden rounded-2xl"
                onClick={() => setIsPreviewOpen(true)}
              >
                <CldImage
                  src={imagePublicId}
                  width={600}
                  height={400}
                  alt="Förhandsvisning"
                  className="w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <EditImageButton
                    onUpload={(publicId) => setImagePublicId(publicId)}
                  />

                  <button
                    type="button"
                    className="rounded-full bg-black/50 p-2 text-white transition hover:bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation();

                      setImagePublicId("");
                    }}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                    <FaSearchPlus size={22} />
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Prioritet</label>
              <CustomSelect
                value={priority}
                onChange={(value) => setPriority(value as Priority)}
                options={[
                  {
                    value: "LOW",
                    label: "Låg",
                  },
                  {
                    value: "MEDIUM",
                    label: "Medium",
                  },
                  {
                    value: "URGENT",
                    label: "Hög",
                  },
                ]}
                size="sm"
                className="w-32"
              />
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-white">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-200 ${
                  isAnonymous
                    ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/10"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only"
                />

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                    isAnonymous
                      ? "border-blue-400 bg-blue-500 text-white"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {isAnonymous && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        d="M4 10.5L8 14L16 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className="text-sm font-medium">Skicka anonymt</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="abort-button">
              Avbryt
            </button>
            <button type="submit" className="submit-button">
              Skicka
            </button>
          </div>
        </form>
      </div>
      {isPreviewOpen && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          imagePublicId={imagePublicId}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>,
    document.body,
  );
};

export default CreateTicketModal;
