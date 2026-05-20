import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "فشل جلب العروض" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("offers")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ offer: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء العرض" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabaseAdmin
      .from("offers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ offer: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل تحديث العرض" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "معرف العرض مطلوب" }, { status: 400 });

    const { error } = await supabaseAdmin.from("offers").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ message: "تم حذف العرض بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل حذف العرض" }, { status: 500 });
  }
}
