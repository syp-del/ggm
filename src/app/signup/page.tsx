import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-xl font-bold text-zinc-900">회원가입</h1>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form action={signup} className="flex flex-col gap-3">
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          required
          maxLength={20}
          className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          required
          className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (6자 이상)"
          required
          minLength={6}
          className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
        />
        <button
          type="submit"
          className="mt-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          가입하기
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-medium text-orange-600">
          로그인
        </Link>
      </p>
    </div>
  );
}
