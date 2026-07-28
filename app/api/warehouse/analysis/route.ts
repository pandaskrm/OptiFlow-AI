import { NextResponse } from "next/server";
import { analyzeWarehouse } from "../../../../lib/ai/warehouseAiEngine";
import { getWarehouseSummary } from "../../../../lib/warehouse/warehouseService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await getWarehouseSummary();
    const analysis = analyzeWarehouse(summary);

    return NextResponse.json(
      {
        summary,
        analysis,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Warehouse analysis error:", error);

    return NextResponse.json(
      {
        message:
          "Impossible de générer l'analyse opérationnelle de l'entrepôt.",
      },
      {
        status: 500,
      }
    );
  }
}
