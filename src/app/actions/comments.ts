"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addComment(productId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    redirect(`/products/${productId}?error=` + encodeURIComponent("댓글 내용을 입력해주세요."));
  }

  const { error } = await supabase
    .from("product_comments")
    .insert({ product_id: productId, author_id: user.id, content });

  if (error) {
    redirect(`/products/${productId}?error=` + encodeURIComponent(error.message));
  }

  redirect(`/products/${productId}`);
}

export async function deleteComment(productId: string, commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("product_comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  redirect(`/products/${productId}`);
}
