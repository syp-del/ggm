import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/actions/profile";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-xl font-bold text-zinc-900">내 정보 수정</h1>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          저장했어요.
        </p>
      )}

      <form action={updateProfile} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">이메일</label>
          <input
            type="text"
            value={user.email ?? ""}
            disabled
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">닉네임</label>
          <input
            type="text"
            name="nickname"
            defaultValue={profile?.nickname ?? ""}
            required
            maxLength={20}
            className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
