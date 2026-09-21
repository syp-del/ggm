import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/categories";
import { productImageUrl } from "@/lib/images";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string }>;
}) {
  const { category, region } = await searchParams;
  const activeCategory = (CATEGORIES as readonly string[]).includes(category ?? "")
    ? (category as string)
    : null;

  const supabase = await createClient();

  const { data: regionRows } = await supabase.from("products").select("region");
  const regions = Array.from(new Set((regionRows ?? []).map((r) => r.region))).sort();
  const activeRegion = regions.includes(region ?? "") ? (region as string) : null;

  function buildHref(next: { category?: string | null; region?: string | null }) {
    const params = new URLSearchParams();
    const nextCategory = next.category !== undefined ? next.category : activeCategory;
    const nextRegion = next.region !== undefined ? next.region : activeRegion;
    if (nextCategory) params.set("category", nextCategory);
    if (nextRegion) params.set("region", nextRegion);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  let productsQuery = supabase
    .from("products")
    .select("id, title, price, status, image_path, region")
    .order("created_at", { ascending: false });

  if (activeCategory) productsQuery = productsQuery.eq("category", activeCategory);
  if (activeRegion) productsQuery = productsQuery.eq("region", activeRegion);

  const { data: products } = await productsQuery;

  const { data: heroProducts } = await supabase
    .from("products")
    .select("id, title, price, image_path")
    .eq("status", "판매중")
    .not("image_path", "is", null)
    .order("like_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  const heroItems = (heroProducts ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    imageUrl: productImageUrl(p.image_path),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <HeroCarousel items={heroItems} />

      <hr className="mb-4 border-t border-zinc-200" />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">우리 동네 중고거래</h1>
        <Link
          href="/products/new"
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          + 글쓰기
        </Link>
      </div>

      <hr className="mb-4 border-t border-zinc-200" />

      <div className="mb-3 flex flex-wrap gap-2">
        <Link
          href={buildHref({ category: null })}
          className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !activeCategory
              ? "bg-orange-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <span aria-hidden>🛍️</span>전체
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={buildHref({ category: c })}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === c
                ? "bg-orange-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <span aria-hidden>{CATEGORY_ICONS[c]}</span>
            {c}
          </Link>
        ))}
      </div>

      {regions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            href={buildHref({ region: null })}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !activeRegion
                ? "bg-purple-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <span aria-hidden>📍</span>전체 지역
          </Link>
          {regions.map((r) => (
            <Link
              key={r}
              href={buildHref({ region: r })}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeRegion === r
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <span aria-hidden>📍</span>
              {r}
            </Link>
          ))}
        </div>
      )}

      <hr className="mb-4 border-t border-zinc-200" />

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              status={product.status}
              imagePath={product.image_path}
              region={product.region}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-24 text-center text-zinc-500">
          <span className="text-4xl">🍆</span>
          <p>
            {activeCategory || activeRegion
              ? "조건에 맞는 상품이 없어요."
              : "아직 등록된 상품이 없어요."}
          </p>
          {!activeCategory && !activeRegion && <p>첫 상품을 등록해보세요!</p>}
        </div>
      )}
    </div>
  );
}
