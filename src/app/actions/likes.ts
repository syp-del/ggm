"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleLike(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("product_likes")
    .select("product_id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("product_likes")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("product_likes").insert({ product_id: productId, user_id: user.id });
  }

  redirect(`/products/${productId}`);
}
