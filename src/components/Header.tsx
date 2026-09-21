import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let nickname: string | null = null;
  let totalRevenue = 0;
  let points = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname, points")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? user.email ?? "회원";
    points = profile?.points ?? 0;

    const { data: soldProducts } = await supabase
      .from("products")
      .select("price")
      .eq("seller_id", user.id)
      .eq("status", "거래완료");
    totalRevenue = (soldProducts ?? []).reduce((sum, p) => sum + p.price, 0);
  }

  return (
    <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-orange-600"
        >
          <span aria-hidden>🍆</span>
          <span>가지가지 마켓</span>
        </Link>

        {user ? (
          <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
            <span className="whitespace-nowrap font-semibold text-emerald-600">
              +{totalRevenue.toLocaleString("ko-KR")}원
            </span>
            <span className="whitespace-nowrap font-semibold text-purple-600">
              🍆 {points.toLocaleString("ko-KR")}원
            </span>
            <Link href="/products/new" className="whitespace-nowrap font-medium text-orange-600">
              판매하기
            </Link>
            <Link href="/profile" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900">
              <span className="font-medium text-zinc-900">{nickname}</span>님
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-700 transition hover:bg-zinc-50"
              >
                로그아웃
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 text-zinc-700 transition hover:bg-zinc-50"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-orange-500 px-3 py-1.5 font-medium text-white transition hover:bg-orange-600"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
