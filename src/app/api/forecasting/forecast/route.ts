import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://pukpuk-api.elginbrian.com");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(`${API_BASE_URL}/forecasting/forecast`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to run forecast" }, { status: 500 });
  }
}
