import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, status, image_path")
    .order("created_at", { ascending: false });

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
          <span className="text-4xl">🍠</span>
          <p>아직 등록된 상품이 없어요.</p>
          <p>첫 상품을 등록해보세요!</p>
        </div>
      )}
    </div>
  );
}
