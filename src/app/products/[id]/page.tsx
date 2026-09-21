import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  deleteProduct,
  updateProductStatus,
  requestPurchase,
  cancelPurchaseRequest,
} from "@/app/actions/products";
import { formatPrice } from "@/lib/format";
import { productImageUrl, isPlaceholderImageUrl } from "@/lib/images";
import { PRODUCT_STATUSES } from "@/lib/categories";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `id, title, description, price, category, status, image_path, seller_id, buyer_id,
       seller:profiles!products_seller_id_fkey(nickname),
       buyer:profiles!products_buyer_id_fkey(nickname)`
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === product.seller_id;
  const isBuyer = !!user && product.buyer_id === user.id;
  const imageUrl = productImageUrl(product.image_path);
  const nickname =
    (product.seller as unknown as { nickname: string } | null)?.nickname ?? "알수없음";
  const buyerNickname =
    (product.buyer as unknown as { nickname: string } | null)?.nickname ?? null;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 sm:aspect-video">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            unoptimized={isPlaceholderImageUrl(imageUrl)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🍆</div>
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

      {isOwner && buyerNickname && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          구매 희망자: <span className="font-semibold">{buyerNickname}</span>님
        </p>
      )}

      {!isOwner && user && product.status === "판매중" && (
        <form action={requestPurchase.bind(null, product.id)} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            구매하기
          </button>
        </form>
      )}

      {!isOwner && !user && product.status === "판매중" && (
        <Link
          href="/login"
          className="mt-6 block w-full rounded-lg bg-orange-500 py-2.5 text-center text-sm font-medium text-white transition hover:bg-orange-600"
        >
          로그인하고 구매하기
        </Link>
      )}

      {isBuyer && (
        <div className="mt-6 flex flex-col gap-2 rounded-lg bg-orange-50 px-3 py-3">
          <p className="text-sm text-orange-700">
            구매 요청을 보냈어요. 판매자 <span className="font-semibold">{nickname}</span>님과 연락해 거래를 진행해주세요.
          </p>
          <form action={cancelPurchaseRequest.bind(null, product.id)}>
            <button
              type="submit"
              className="rounded-full border border-orange-200 px-3 py-1.5 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
            >
              구매 요청 취소
            </button>
          </form>
        </div>
      )}

      {isOwner && (
        <>
          <div className="mt-6 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">거래 상태 변경</span>
            <div className="flex gap-2">
              {PRODUCT_STATUSES.map((status) => (
                <form key={status} action={updateProductStatus.bind(null, product.id, status)}>
                  <button
                    type="submit"
                    disabled={product.status === status}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      product.status === status
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {status}
                  </button>
                </form>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              수정하기
            </Link>
            <form action={deleteProduct.bind(null, product.id)}>
              <button
                type="submit"
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                삭제하기
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
