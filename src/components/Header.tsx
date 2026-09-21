import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let nickname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? user.email ?? "회원";
  }

  return (
    <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-orange-600">
          <span aria-hidden>🍠</span>
          <span>고구마마켓</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/products/new" className="font-medium text-orange-600">
              판매하기
            </Link>
            <Link href="/profile" className="text-zinc-600 hover:text-zinc-900">
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
