"use client";

import { useState } from "react";
import { useEditResource } from "./useEditResource";
import { RiEdit2Fill } from "react-icons/ri";
import EditResourceModal from "./editResourceModal";
import type { Resource } from "@prisma/client";

interface EditResourceSectionProps {
  resource: Resource;
}

export function EditResourceSection({ resource }: EditResourceSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { editResource, isLoading } = useEditResource();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-green-500/30"
      >
        <RiEdit2Fill size={18} />
      </button>

      <EditResourceModal
        resource={resource}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          editResource(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
