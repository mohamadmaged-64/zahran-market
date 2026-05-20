import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "فشل جلب التصنيفات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء التصنيف" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ category: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل تحديث التصنيف" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "معرف التصنيف مطلوب" }, { status: 400 });

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ message: "تم حذف التصنيف بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل حذف التصنيف" }, { status: 500 });
  }
}
