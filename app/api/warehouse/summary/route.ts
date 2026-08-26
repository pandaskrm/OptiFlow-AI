import { NextResponse } from "next/server";
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

    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
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