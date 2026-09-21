import { createBrowserClient } from "@supabase/ssr";

// 이 파일은 브라우저에서 실행되므로 이름에 NEXT_PUBLIC_이 붙은 값만 읽을 수 있음.
// 실제로 이 파일을 쓰게 되면 Vercel에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY도 추가해야 함.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
