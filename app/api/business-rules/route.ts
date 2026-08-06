import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../lib/auth/session";
import { prisma } from "../../../lib/prisma";

const allowedScopes = [
  "CLIENT",
  "PAYS",
  "TRANSPORTEUR",
  "ARTICLE",
] as const;

const allowedPriorities = [
  "NORMALE",
  "HAUTE",
  "CRITIQUE",
] as const;

type CreateRuleBody = {
  name?: unknown;
  scope?: unknown;
  targetValue?: unknown;
  priority?: unknown;
  badge?: unknown;
  color?: unknown;
  workflow?: unknown;
  explanation?: unknown;
  checklist?: unknown;
  actions?: unknown;
  isActive?: unknown;
};

function readText(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function readOptionalText(value: unknown) {
  const text = readText(value);
  return text || null;
}

function canManageRules(role: string) {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "LOGISTICS_MANAGER"
  );
}

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  const rules = await prisma.businessRule.findMany({
    where: {
      companyId: session.company.id,
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        scope: "asc",
      },
      {
        targetValue: "asc",
      },
    ],
  });

  return NextResponse.json({
    rules,
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (!canManageRules(session.membership.role)) {
    return NextResponse.json(
      { error: "Droits insuffisants." },
      { status: 403 },
    );
  }

  let body: CreateRuleBody;

  try {
    body = (await request.json()) as CreateRuleBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const name = readText(body.name);
  const scope = readText(body.scope).toUpperCase();
  const targetValue = readText(body.targetValue);
  const priority =
    readText(body.priority).toUpperCase() || "NORMALE";

  if (!name || !targetValue) {
    return NextResponse.json(
      {
        error:
          "Le nom et la valeur ciblée sont obligatoires.",
      },
      { status: 400 },
    );
  }

  if (
    !allowedScopes.includes(
      scope as (typeof allowedScopes)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Type de règle invalide." },
      { status: 400 },
    );
  }

  if (
    !allowedPriorities.includes(
      priority as (typeof allowedPriorities)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Priorité invalide." },
      { status: 400 },
    );
  }

  try {
    const rule = await prisma.businessRule.create({
      data: {
        companyId: session.company.id,
        name,
        scope,
        targetValue,
        priority,
        badge: readOptionalText(body.badge),
        color: readOptionalText(body.color),
        workflow: readOptionalText(body.workflow),
        explanation: readOptionalText(
          body.explanation,
        ),
        checklist: Array.isArray(body.checklist)
          ? body.checklist
          : [],
        actions: Array.isArray(body.actions)
          ? body.actions
          : [],
        isActive:
          typeof body.isActive === "boolean"
            ? body.isActive
            : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId: session.company.id,
        actorId: session.user.id,
        action: "BUSINESS_RULE_CREATED",
        entityType: "BusinessRule",
        entityId: rule.id,
        details: JSON.stringify({
          name: rule.name,
          scope: rule.scope,
          targetValue: rule.targetValue,
          priority: rule.priority,
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        rule,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Création impossible.";

    if (
      message.includes("Unique constraint") ||
      message.includes("P2002")
    ) {
      return NextResponse.json(
        {
          error:
            "Cette règle existe déjà pour cette entreprise.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Création de la règle impossible." },
      { status: 500 },
    );
  }
}
