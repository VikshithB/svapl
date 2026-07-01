import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? "your_project_id",
  dataset: import.meta.env.VITE_SANITY_DATASET ?? "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION ?? "2024-01-01",
  useCdn: true,
});

export function imageUrl(ref: string): string {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "your_project_id";
  const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
  // ref format: image-{id}-{width}x{height}-{ext}
  const [, id, dims, ext] = ref.split("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${ext}`;
}
