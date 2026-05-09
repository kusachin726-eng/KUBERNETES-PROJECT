"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const TITLE_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const META_KEY_REGEX = /^[A-Za-z\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
const META_VALUE_REGEX = /^[1-9][0-9]*$/;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: {
    title?: string;
    metadata?: Record<string, number>;
  };
  onSubmit: (values: {
    title: string;
    metadata: Record<string, number>;
  }) => void;
}

export default function AddEditSettingsModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<{ title?: string }>({});
  const [titleError, setTitleError] = useState("");

  const [extraMeta, setExtraMeta] = useState<{ key: string; value: string }[]>(
    [],
  );

  const [metaErrors, setMetaErrors] = useState<
    { key?: string; value?: string }[]
  >([]);

  useEffect(() => {
    if (!open) return;

    if (mode === "add") {
      setForm({});
      setTitleError("");
      setExtraMeta([]);
      setMetaErrors([]);
      return;
    }

    if (mode === "edit" && initialValues) {
      setForm({ title: initialValues.title ?? "" });

      const meta = initialValues.metadata
        ? Object.entries(initialValues.metadata).map(([k, v]) => ({
            key: k,
            value: String(v),
          }))
        : [];

      setExtraMeta(meta);
      setMetaErrors(meta.map(() => ({})));
      setTitleError("");
    }
  }, [open, mode, initialValues]);

  const onTitleChange = (val: string) => {
    if (val && !TITLE_REGEX.test(val)) {
      setTitleError("Only characters allowed");
    } else {
      setTitleError("");
    }
    setForm({ title: val });
  };

  const submit = () => {
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    if (titleError) {
      toast.error("Fix title error");
      return;
    }

    if (metaErrors.some((e) => e.key || e.value)) {
      toast.error("Please fix field errors");
      return;
    }

    const metadata: Record<string, number> = Object.fromEntries(
      extraMeta.map(({ key, value }) => [key, Number(value)]),
    );

    onSubmit({
      title: form.title,
      metadata,
    });

    onOpenChange(false);
  };

  const addMetaField = () => {
    setExtraMeta((p) => [...p, { key: "", value: "" }]);
    setMetaErrors((p) => [...p, {}]);
  };

  const removeMetaField = (idx: number) => {
    setExtraMeta((prev) => prev.filter((_, i) => i !== idx));
    setMetaErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMetaKey = (idx: number, val: string) => {
    const copy = [...extraMeta];
    const err = [...metaErrors];

    if (!META_KEY_REGEX.test(val)) {
      err[idx] = {
        ...err[idx],
        key: "Only characters and special characters allowed",
      };
    } else {
      copy[idx].key = val;
      err[idx] = { ...err[idx], key: "" };
    }

    setExtraMeta(copy);
    setMetaErrors(err);
  };

  const updateMetaValue = (idx: number, val: string) => {
    const copy = [...extraMeta];
    const err = [...metaErrors];

    copy[idx].value = val;

    if (val === "") {
      err[idx] = { ...err[idx], value: "" };
    } else if (!META_VALUE_REGEX.test(val)) {
      err[idx] = {
        ...err[idx],
        value: "Only numbers greater than 0 allowed",
      };
    } else {
      err[idx] = { ...err[idx], value: "" };
    }

    setExtraMeta(copy);
    setMetaErrors(err);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="bg-primary px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-white">
            {mode === "add" ? "Add Pricing Setting" : "Edit Pricing Setting"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          <div className="relative">
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder=" "
              className={`peer w-full h-12 px-4 rounded-lg border ${
                titleError ? "border-red-500" : "border-zinc-300"
              } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            />
            <label
              className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                ${form.title ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
              `}
            >
              Title <span className="text-red-500">*</span>
            </label>
            {titleError && (
              <p className="text-xs text-red-600 mt-1">{titleError}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700">
                Metadata Fields
              </h3>
              <Button
                type="button"
                onClick={addMetaField}
                variant="outline"
                size="sm"
                className="h-9 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>

            {extraMeta.length === 0 && (
              <div className="text-center py-8 text-sm text-zinc-500 bg-zinc-50 rounded-lg border border-zinc-200">
                No metadata fields added yet. Click "Add Field" to get started.
              </div>
            )}

            {extraMeta.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => updateMetaKey(idx, e.target.value)}
                      placeholder=" "
                      className={`peer w-full h-12 px-4 rounded-lg border ${
                        metaErrors[idx]?.key
                          ? "border-red-500"
                          : "border-zinc-300"
                      } bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                    />
                    <label
                      className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                        ${item.key ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
                      `}
                    >
                      Field Name <span className="text-red-500">*</span>
                    </label>
                    {metaErrors[idx]?.key && (
                      <p className="text-xs text-red-600 mt-1">
                        {metaErrors[idx].key}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateMetaValue(idx, e.target.value)}
                      placeholder=" "
                      className={`peer w-full h-12 px-4 rounded-lg border ${
                        metaErrors[idx]?.value
                          ? "border-red-500"
                          : "border-zinc-300"
                      } bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                    />
                    <label
                      className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                        ${item.value ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
                      `}
                    >
                      Field Value <span className="text-red-500">*</span>
                    </label>
                    {metaErrors[idx]?.value && (
                      <p className="text-xs text-red-600 mt-1">
                        {metaErrors[idx].value}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMetaField(idx)}
                    className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 border border-zinc-300 hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button onClick={submit} className="h-11 px-8 font-semibold">
              {mode === "add" ? "Save Setting" : "Update Setting"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
