export function productImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

export function isPlaceholderImageUrl(url: string | null) {
  if (!url) return false;
  return !url.includes(".supabase.co/");
}
