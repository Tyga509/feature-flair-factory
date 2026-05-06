import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
};

export function ImageUpload({ value, onChange, folder = "products" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("flower-storage")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("flower-storage").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image uploadée avec succès");
    } catch (e: any) {
      toast.error("Échec de l'upload : " + (e?.message ?? "erreur"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-secondary/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />
        {value ? (
          <div className="relative">
            <img src={value} alt="Aperçu" className="mx-auto max-h-40 rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow"
              aria-label="Retirer"
            >
              <X size={14} />
            </button>
          </div>
        ) : uploading ? (
          <div className="py-6 flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm">Upload en cours…</span>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2 text-muted-foreground">
            <Upload size={24} />
            <span className="text-sm font-medium">Glissez-déposez ou cliquez pour choisir une image</span>
            <span className="text-xs">JPG, PNG, WEBP — sera enregistré automatiquement</span>
          </div>
        )}
      </div>
    </div>
  );
}
