"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nickname = String(formData.get("nickname") ?? "").trim();

  if (!nickname) {
    redirect("/profile?error=" + encodeURIComponent("닉네임을 입력해주세요."));
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nickname })
    .eq("id", user.id);

  if (error) {
    redirect("/profile?error=" + encodeURIComponent(error.message));
  }

  redirect("/profile?success=1");
}
