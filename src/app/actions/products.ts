"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, PRODUCT_STATUSES } from "@/lib/categories";

function isStoragePath(path: string) {
  return !path.startsWith("http://") && !path.startsWith("https://");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceDigits = String(formData.get("price") ?? "0").replace(/[^0-9]/g, "");
  const price = priceDigits ? Number(priceDigits) : 0;
  const categoryInput = String(formData.get("category") ?? "기타");
  const category = (CATEGORIES as readonly string[]).includes(categoryInput)
    ? categoryInput
    : "기타";
  const file = formData.get("image") as File | null;

  if (!title) {
    redirect("/products/new?error=" + encodeURIComponent("제목을 입력해주세요."));
  }

  let imagePath: string | null = null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, bytes, { contentType: file.type || "image/jpeg" });

    if (uploadError) {
      redirect(
        "/products/new?error=" +
          encodeURIComponent("이미지 업로드에 실패했어요: " + uploadError.message)
      );
    }
    imagePath = path;
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title,
      description,
      price,
      category,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error || !product) {
    redirect("/products/new?error=" + encodeURIComponent(error?.message ?? "등록에 실패했어요."));
  }

  redirect(`/products/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("products")
    .select("seller_id, image_path")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== user.id) {
    redirect("/");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceDigits = String(formData.get("price") ?? "0").replace(/[^0-9]/g, "");
  const price = priceDigits ? Number(priceDigits) : 0;
  const categoryInput = String(formData.get("category") ?? "기타");
  const category = (CATEGORIES as readonly string[]).includes(categoryInput)
    ? categoryInput
    : "기타";
  const statusInput = String(formData.get("status") ?? "판매중");
  const status = (PRODUCT_STATUSES as readonly string[]).includes(statusInput)
    ? statusInput
    : "판매중";

  if (!title) {
    redirect(`/products/${id}/edit?error=` + encodeURIComponent("제목을 입력해주세요."));
  }

  let imagePath = existing.image_path;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, bytes, { contentType: file.type || "image/jpeg" });

    if (uploadError) {
      redirect(
        `/products/${id}/edit?error=` +
          encodeURIComponent("이미지 업로드에 실패했어요: " + uploadError.message)
      );
    }

    if (existing.image_path && isStoragePath(existing.image_path)) {
      await supabase.storage.from("product-images").remove([existing.image_path]);
    }
    imagePath = path;
  }

  const { error } = await supabase
    .from("products")
    .update({ title, description, price, category, status, image_path: imagePath })
    .eq("id", id);

  if (error) {
    redirect(`/products/${id}/edit?error=` + encodeURIComponent(error.message));
  }

  redirect(`/products/${id}`);
}

export async function updateProductStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(PRODUCT_STATUSES as readonly string[]).includes(status)) {
    redirect(`/products/${id}`);
  }

  const { data: existing } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== user.id) {
    redirect("/");
  }

  const updates: { status: string; buyer_id?: null } = { status };
  if (status === "판매중") {
    updates.buyer_id = null;
  }
  await supabase.from("products").update(updates).eq("id", id);

  redirect(`/products/${id}`);
}

export async function requestPurchase(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("request_purchase", { product_id: id });

  if (error) {
    redirect(`/products/${id}?error=` + encodeURIComponent(error.message));
  }

  redirect(`/products/${id}`);
}

export async function cancelPurchaseRequest(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("cancel_purchase_request", { product_id: id });

  if (error) {
    redirect(`/products/${id}?error=` + encodeURIComponent(error.message));
  }

  redirect(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("image_path, seller_id")
    .eq("id", id)
    .single();

  if (!product || product.seller_id !== user.id) {
    redirect("/");
  }

  await supabase.from("products").delete().eq("id", id);

  if (product.image_path && isStoragePath(product.image_path)) {
    await supabase.storage.from("product-images").remove([product.image_path]);
  }

  redirect("/");
}
