import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://pukpuk-api.elginbrian.com");

export async function GET() {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecasting/metrics`);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
