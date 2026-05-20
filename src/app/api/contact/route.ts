import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: "تم إرسال رسالتك بنجاح" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إرسال الرسالة" }, { status: 500 });
  }
}
