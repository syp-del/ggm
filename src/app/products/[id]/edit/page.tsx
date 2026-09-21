import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/app/actions/products";
import { CATEGORIES, PRODUCT_STATUSES } from "@/lib/categories";
import { productImageUrl, isPlaceholderImageUrl } from "@/lib/images";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("id, title, description, price, category, status, image_path, seller_id")
    .eq("id", id)
    .single();

  if (!product) notFound();
  if (product.seller_id !== user.id) redirect(`/products/${id}`);

  const imageUrl = productImageUrl(product.image_path);
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-zinc-900">상품 수정</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form action={updateProductWithId} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">사진</label>
          {imageUrl && (
            <div className="relative aspect-square w-24 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized={isPlaceholderImageUrl(imageUrl)}
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-orange-600"
          />
          <p className="text-xs text-zinc-400">새 사진을 선택하지 않으면 기존 사진이 그대로 유지돼요.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">제목</label>
          <input
            type="text"
            name="title"
            defaultValue={product.title}
            required
            maxLength={100}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">카테고리</label>
          <select
            name="category"
            defaultValue={product.category}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">거래 상태</label>
          <select
            name="status"
            defaultValue={product.status}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          >
            {PRODUCT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">가격 (원, 0이면 나눔)</label>
          <input
            type="number"
            name="price"
            min={0}
            step={100}
            defaultValue={product.price}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">설명</label>
          <textarea
            name="description"
            rows={5}
            defaultValue={product.description}
            className="resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          수정하기
        </button>
      </form>
    </div>
  );
}
