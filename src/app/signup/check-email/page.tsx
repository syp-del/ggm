import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-4xl">📩</span>
      <h1 className="text-xl font-bold text-zinc-900">이메일을 확인해주세요</h1>
      <p className="text-sm text-zinc-500">
        입력하신 이메일로 인증 링크를 보냈어요. 링크를 눌러 인증을 마치면 로그인할 수 있어요.
      </p>
      <Link href="/login" className="text-sm font-medium text-orange-600">
        로그인 화면으로 가기
      </Link>
    </div>
  );
}
