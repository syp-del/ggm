import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/app/actions/products";
import { formatPrice } from "@/lib/format";
import { productImageUrl } from "@/lib/images";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, title, description, price, category, status, image_path, seller_id, profiles(nickname)"
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === product.seller_id;
  const imageUrl = productImageUrl(product.image_path);
  const nickname =
    (product.profiles as unknown as { nickname: string } | null)?.nickname ?? "알수없음";

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 sm:aspect-video">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🍠</div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5">{product.category}</span>
          <span>{nickname}</span>
        </div>
        <h1 className="text-lg font-bold text-zinc-900">{product.title}</h1>
        <p className="text-xl font-bold text-zinc-900">{formatPrice(product.price)}</p>
        <span className="w-fit rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
          {product.status}
        </span>
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">
          {product.description || "설명이 없어요."}
        </p>
      </div>

      {isOwner && (
        <form action={deleteProduct.bind(null, product.id)} className="mt-6">
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            삭제하기
          </button>
        </form>
      )}
    </div>
  );
}
