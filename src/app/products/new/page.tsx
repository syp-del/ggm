import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/app/actions/products";
import { CATEGORIES } from "@/lib/categories";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-zinc-900">상품 등록</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form action={createProduct} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">사진</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-orange-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">제목</label>
          <input
            type="text"
            name="title"
            placeholder="글 제목"
            required
            maxLength={100}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">카테고리</label>
          <select
            name="category"
            defaultValue="기타"
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
          <label className="text-sm font-medium text-zinc-700">가격 (원, 0이면 나눔)</label>
          <input
            type="number"
            name="price"
            min={0}
            step={100}
            placeholder="0"
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">설명</label>
          <textarea
            name="description"
            rows={5}
            placeholder="상품 상태, 거래 방법 등을 적어주세요."
            className="resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
