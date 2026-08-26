import { NextResponse } from "next/server";
import { analyzeWarehouse } from "../../../../lib/ai/warehouseAiEngine";
import { getWarehouseSummary } from "../../../../lib/warehouse/warehouseService";

export const dynamic = "force-dynamic";

function isAuthenticationError(error: unknown) {
  return (
    error instanceof Error &&
    error.message === "Utilisateur non authentifié."
  );
}

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
    if (isAuthenticationError(error)) {
      return NextResponse.json(
        {
          message: "Utilisateur non authentifié.",
        },
        {
          status: 401,
        }
      );
    }

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