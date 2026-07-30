import { NextResponse } from "next/server";
import { getErpConnector } from "../../../../lib/erp/erpConnectorFactory";

export async function GET() {
  const connector = getErpConnector();
  const dataSource = await connector.getDataSource();

  return NextResponse.json(dataSource);
}
