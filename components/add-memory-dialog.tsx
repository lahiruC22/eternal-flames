"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useImageFocus } from "@/hooks/use-image-focus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X, Loader2 } from "lucide-react";

interface AddMemoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: {
    title: string;
    date: string;
    caption: string;
    imageUrl: string;
  }) => Promise<void>;
}

export function AddMemoryDialog({
  isOpen,
  onClose,
  onAdd,
}: AddMemoryDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const [previewOrientation, setPreviewOrientation] = useState<"portrait" | "landscape" | "square" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { focus, registerImage } = useImageFocus({
    imageUrl: imagePreview ?? "",
    existingFocus: null,
    enabled: Boolean(imagePreview),
  });

  const objectPosition = focus
    ? `${(focus.x * 100).toFixed(2)}% ${(focus.y * 100).toFixed(2)}%`
    : isPortrait
      ? "center top"
      : "center";

  const previewFrameClassName = previewOrientation === "portrait"
    ? "aspect-[4/5]"
    : previewOrientation === "square"
      ? "aspect-square"
      : "aspect-[16/9]";

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "This field is required." }));
    } else {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image (JPEG, PNG, WebP, or GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    setErrors((prev) => {
      const { imageUrl: _, ...rest } = prev;
      return rest;
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
  };

  const validateAllFields = (): boolean => {
    const fields = [
      { name: 'title', value: title },
      { name: 'date', value: date },
      { name: 'caption', value: caption },
    ];

    fields.forEach(field => validateField(field.name, field.value));
    
    // Check image
    if (!imageFile && !imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: "Please upload an image." }));
      return false;
    }
    
    // Check if any field is empty
    return fields.every(field => field.value.trim() !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create a memory.",
        variant: "destructive",
      });
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload image");
        }

        const { url } = await response.json();
        finalImageUrl = url;
        setIsUploading(false);
      }

      await onAdd({
        title,
        date,
        caption,
        imageUrl: finalImageUrl,
      });

      // Reset form
      setTitle("");
      setDate("");
      setCaption("");
      setImageUrl("");
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            Add New Memory
          </DialogTitle>
          <DialogDescription>
            Capture a special moment in our journey together.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pr-1">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {  setTitle(e.target.value); validateField("title", e.target.value);}}
              placeholder="First Meeting"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="text-sm font-medium text-foreground"
            >
              Date
            </label>
            <Input
              id="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); validateField("date", e.target.value); }}
              placeholder="February 14, 2024"
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="text-sm font-medium text-foreground"
            >
              Image
            </label>
            
            {!imagePreview ? (
              <div className="space-y-2">
                <label
                  htmlFor="imageFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP or GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl}</p>
                )}
              </div>
            ) : (
              <div className={`relative w-full ${previewFrameClassName} overflow-hidden rounded-lg`}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                  style={{ objectPosition }}
                  onLoad={(event) => {
                    const img = event.currentTarget;
                    const nextIsPortrait = img.naturalHeight > img.naturalWidth;
                    setIsPortrait((prev) => (prev === nextIsPortrait ? prev : nextIsPortrait));
                    const ratio = img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1;
                    const nextOrientation = ratio > 1.1 ? "portrait" : ratio < 0.9 ? "landscape" : "square";
                    setPreviewOrientation((prev) => (prev === nextOrientation ? prev : nextOrientation));
                    registerImage(img);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="caption"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A beautiful moment we shared..."
              className="min-h-[100px] w-full resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Memory
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
