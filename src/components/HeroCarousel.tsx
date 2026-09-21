"use client";

import { useEffect, useState } from "react";
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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative mb-5 -mx-4 overflow-hidden sm:-mx-0 sm:rounded-2xl">
      <span className="absolute left-4 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow sm:left-3">
        ❤️ 좋아요 많은 인기 상품
      </span>

      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="relative h-full w-full shrink-0">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  unoptimized={isPlaceholderImageUrl(item.imageUrl)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-5xl">
                  🍆
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-6 pt-10">
                <p className="truncate text-sm font-medium text-white/90">{item.title}</p>
                <p className="text-lg font-bold text-white">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
