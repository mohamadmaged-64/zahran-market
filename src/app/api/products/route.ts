import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const categoryId = searchParams.get("category_id");
    const featured = searchParams.get("featured");
    const offers = searchParams.get("offers");

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    let query: any = supabaseAdmin
      .from("products")
      .select("*, category:categories(*)");

    if (categoryId) query = query.eq("category_id", categoryId);
    if (featured === "true") query = query.eq("is_featured", true);
    if (offers === "true") query = query.eq("is_offer", true);

    query = query.eq("is_available", true).order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء المنتج" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل حذف المنتج" }, { status: 500 });
  }
}
