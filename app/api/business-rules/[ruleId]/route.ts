import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

type UpdateRuleBody = {
  name?: unknown;
  priority?: unknown;
  badge?: unknown;
  color?: unknown;
  workflow?: unknown;
  explanation?: unknown;
  checklist?: unknown;
  actions?: unknown;
  isActive?: unknown;
};

function readOptionalText(value: unknown) {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const text = value.trim();
  return text || null;
}

function canManageRules(role: string) {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "LOGISTICS_MANAGER"
  );
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      ruleId: string;
    }>;
  },
) {
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

  const { ruleId } = await context.params;

  const existing = await prisma.businessRule.findFirst({
    where: {
      id: ruleId,
      companyId: session.company.id,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Règle introuvable." },
      { status: 404 },
    );
  }

  let body: UpdateRuleBody;

  try {
    body = (await request.json()) as UpdateRuleBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : undefined;

  const priority =
    typeof body.priority === "string"
      ? body.priority.trim().toUpperCase()
      : undefined;

  if (
    priority &&
    !["NORMALE", "HAUTE", "CRITIQUE"].includes(
      priority,
    )
  ) {
    return NextResponse.json(
      { error: "Priorité invalide." },
      { status: 400 },
    );
  }

  const rule = await prisma.businessRule.update({
    where: {
      id: existing.id,
    },
    data: {
      ...(name ? { name } : {}),
      ...(priority ? { priority } : {}),
      ...(body.badge !== undefined
        ? { badge: readOptionalText(body.badge) }
        : {}),
      ...(body.color !== undefined
        ? { color: readOptionalText(body.color) }
        : {}),
      ...(body.workflow !== undefined
        ? { workflow: readOptionalText(body.workflow) }
        : {}),
      ...(body.explanation !== undefined
        ? {
            explanation: readOptionalText(
              body.explanation,
            ),
          }
        : {}),
      ...(Array.isArray(body.checklist)
        ? { checklist: body.checklist }
        : {}),
      ...(Array.isArray(body.actions)
        ? { actions: body.actions }
        : {}),
      ...(typeof body.isActive === "boolean"
        ? { isActive: body.isActive }
        : {}),
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: session.company.id,
      actorId: session.user.id,
      action: "BUSINESS_RULE_UPDATED",
      entityType: "BusinessRule",
      entityId: rule.id,
      details: JSON.stringify({
        name: rule.name,
        isActive: rule.isActive,
        priority: rule.priority,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    rule,
  });
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      ruleId: string;
    }>;
  },
) {
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

  const { ruleId } = await context.params;

  const existing = await prisma.businessRule.findFirst({
    where: {
      id: ruleId,
      companyId: session.company.id,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Règle introuvable." },
      { status: 404 },
    );
  }

  await prisma.businessRule.delete({
    where: {
      id: existing.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: session.company.id,
      actorId: session.user.id,
      action: "BUSINESS_RULE_DELETED",
      entityType: "BusinessRule",
      entityId: existing.id,
      details: JSON.stringify({
        name: existing.name,
        scope: existing.scope,
        targetValue: existing.targetValue,
      }),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
