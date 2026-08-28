import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";
import {
  buildPreparationQueues,
  type PreparationQueueOrder,
  type PreparationQueueZone,
} from "../../../../../lib/preparation/preparationQueue";
import { routePreparationOrder } from "../../../../../lib/preparation/preparationRouting";

type NextPdaBody = {
  zone?: unknown;
};

const allowedZones: PreparationQueueZone[] = [
  "CONFIRME",
  "EXPERT",
  "GROSSISTE",
];

function readZone(value: unknown): PreparationQueueZone | null {
  if (typeof value !== "string") {
    return null;
  }

  const zone = value.trim().toUpperCase();

  return allowedZones.includes(zone as PreparationQueueZone)
    ? (zone as PreparationQueueZone)
    : null;
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  let body: NextPdaBody;

  try {
    body = (await request.json()) as NextPdaBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const zone = readZone(body.zone);

  if (!zone) {
    return NextResponse.json(
      {
        error:
          "Zone PDA invalide. Valeurs autorisées : CONFIRME, EXPERT, GROSSISTE.",
      },
      { status: 400 },
    );
  }

  const companyId = session.company.id;
  const preparerId = session.user.id;

  const businessRules = await prisma.businessRule.findMany({
    where: {
      companyId,
      isActive: true,
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      companyId,
      orderDate: {
        not: null,
      },
      pdaReservedBy: null,
      pdaReservedAt: null,
      pdaReservationToken: null,
      completedAt: null,
    },
    orderBy: [
      {
        orderDate: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  const routedOrders: PreparationQueueOrder[] = orders.map((order) => {
    const routing = routePreparationOrder(
      {
        customer: order.customer,
        customerCode: order.customerCode,
        country: order.country,
        carrier: order.carrier,
        paymentMethod: order.paymentMethod,
        priority: order.priority,
        totalLines: order.totalLines,
        totalQuantity: order.totalQuantity,
      },
      businessRules,
    );

    return {
      id: order.id,
      number: order.number,
      orderDate: order.orderDate,
      group: routing.group,
      isPriority: routing.isPriority,
    };
  });

  const queue = buildPreparationQueues(routedOrders);
  const candidates = queue.queues[zone];

  for (const candidate of candidates) {
    const token = randomUUID();
    const reservedAt = new Date();

    const claim = await prisma.order.updateMany({
      where: {
        id: Number(candidate.id),
        companyId,
        completedAt: null,
        pdaReservedBy: null,
        pdaReservedAt: null,
        pdaReservationToken: null,
      },
      data: {
        pdaReservedBy: preparerId,
        pdaReservedAt: reservedAt,
        pdaReservationToken: token,
      },
    });

    if (claim.count !== 1) {
      continue;
    }

    const reservedOrder = await prisma.order.findFirst({
      where: {
        id: Number(candidate.id),
        companyId,
        pdaReservationToken: token,
        pdaReservedBy: preparerId,
      },
    });

    if (!reservedOrder) {
      return NextResponse.json(
        {
          error:
            "La commande a été réservée mais sa relecture a échoué.",
        },
        { status: 500 },
      );
    }

    const routing = routePreparationOrder(
      {
        customer: reservedOrder.customer,
        customerCode: reservedOrder.customerCode,
        country: reservedOrder.country,
        carrier: reservedOrder.carrier,
        paymentMethod: reservedOrder.paymentMethod,
        priority: reservedOrder.priority,
        totalLines: reservedOrder.totalLines,
        totalQuantity: reservedOrder.totalQuantity,
      },
      businessRules,
    );

    return NextResponse.json({
      success: true,
      zone,
      reservation: {
        token,
        reservedAt,
        reservedBy: preparerId,
      },
      order: reservedOrder,
      routing,
    });
  }

  return NextResponse.json({
    success: true,
    zone,
    order: null,
    message: "Aucune commande disponible dans cette zone.",
  });
}