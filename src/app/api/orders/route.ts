import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    const baseQuery = supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    let query: any = baseQuery;
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء الطلب" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });

    const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ message: "تم حذف الطلب بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل حذف الطلب" }, { status: 500 });
  }
}
