import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { productImageUrl, isPlaceholderImageUrl } from "@/lib/images";

type Props = {
  id: string;
  title: string;
  price: number;
  status: string;
  imagePath: string | null;
  region?: string;
};

export default function ProductCard({ id, title, price, status, imagePath, region }: Props) {
  const imageUrl = productImageUrl(imagePath);

  return (
    <Link
      href={`/products/${id}`}
      className="flex flex-col gap-2 rounded-xl transition hover:opacity-90"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover"
            unoptimized={isPlaceholderImageUrl(imageUrl)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🍆</div>
        )}
        {status !== "판매중" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {status}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="line-clamp-1 text-sm text-zinc-800">{title}</p>
        <p className="text-sm font-semibold text-zinc-900">{formatPrice(price)}</p>
        {region && <p className="text-xs text-zinc-400">📍 {region}</p>}
      </div>
    </Link>
  );
}
