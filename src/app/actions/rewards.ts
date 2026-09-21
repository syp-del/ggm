"use server";

import { createClient } from "@/lib/supabase/server";

export async function claimEggplantReward(): Promise<
  { ok: true; points: number } | { ok: false; message: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  const { data, error } = await supabase.rpc("claim_eggplant_reward");

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, points: data as number };
}
