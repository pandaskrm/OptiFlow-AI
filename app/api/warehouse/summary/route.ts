import { NextResponse } from "next/server";
import { getWarehouseSummary } from "../../../../lib/warehouse/warehouseService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await getWarehouseSummary();

    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Warehouse summary error:", error);

    return NextResponse.json(
      {
        message:
          "Impossible de récupérer les données globales de l'entrepôt.",
      },
      {
        status: 500,
      }
    );
  }
}