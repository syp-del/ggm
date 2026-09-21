import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/categories";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = (CATEGORIES as readonly string[]).includes(category ?? "")
    ? (category as string)
    : null;

  const supabase = await createClient();
  const productsQuery = supabase
    .from("products")
    .select("id, title, price, status, image_path")
    .order("created_at", { ascending: false });

  const { data: products } = activeCategory
    ? await productsQuery.eq("category", activeCategory)
    : await productsQuery;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-900">우리 동네 중고거래</h1>
        <Link
          href="/products/new"
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          + 글쓰기
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/"
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !activeCategory
              ? "bg-orange-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          전체
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/?category=${encodeURIComponent(c)}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === c
                ? "bg-orange-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

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
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-24 text-center text-zinc-500">
          <span className="text-4xl">🍆</span>
          <p>
            {activeCategory ? "이 카테고리엔 등록된 상품이 없어요." : "아직 등록된 상품이 없어요."}
          </p>
          {!activeCategory && <p>첫 상품을 등록해보세요!</p>}
        </div>
      )}
    </div>
  );
}
