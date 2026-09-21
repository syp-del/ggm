import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { isPlaceholderImageUrl } from "@/lib/images";

type HeroItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
};

export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  if (items.length === 0) return null;

  const track = [...items, ...items];

  return (
    <div className="relative mb-5 -mx-4 overflow-hidden sm:-mx-0 sm:rounded-2xl">
      <span className="absolute left-4 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow sm:left-3">
        🔥 조회가 많은 핫한 상품
      </span>
      <div className="hero-marquee-track flex w-max gap-3 pb-3 pl-4 pt-12">
        {track.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            href={`/products/${item.id}`}
            className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 shadow-sm transition hover:opacity-90 sm:h-36 sm:w-36"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="150px"
                className="object-cover"
                unoptimized={isPlaceholderImageUrl(item.imageUrl)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">🍆</div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
              <p className="truncate text-[11px] font-medium text-white">{item.title}</p>
              <p className="text-[11px] font-bold text-white">{formatPrice(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
