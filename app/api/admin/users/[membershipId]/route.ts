import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

const ALLOWED_ROLES = [
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
  "HR",
  "OPERATOR",
  "READ_ONLY",
] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

type UpdateMembershipBody = {
  role?: string;
  isActive?: boolean;
};

type RouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

function isAllowedRole(value: string): value is AllowedRole {
  return ALLOWED_ROLES.includes(value as AllowedRole);
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(auth.membership.role)) {
      return NextResponse.json(
        { error: "Accès réservé aux administrateurs." },
        { status: 403 }
      );
    }

    const { membershipId } = await context.params;

    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
      },
    });

    if (
      !membership ||
      membership.companyId !== auth.company.id
    ) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (membership.role === "OWNER") {
      return NextResponse.json(
        { error: "Le compte propriétaire ne peut pas être modifié ici." },
        { status: 403 }
      );
    }

    const body =
      (await request.json()) as UpdateMembershipBody;

    if (
      body.role === undefined &&
      body.isActive === undefined
    ) {
      return NextResponse.json(
        { error: "Aucune modification fournie." },
        { status: 400 }
      );
    }

    if (
      body.role !== undefined &&
      !isAllowedRole(body.role)
    ) {
      return NextResponse.json(
        { error: "Le rôle sélectionné est invalide." },
        { status: 400 }
      );
    }

    if (
      body.isActive !== undefined &&
      typeof body.isActive !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Le statut sélectionné est invalide." },
        { status: 400 }
      );
    }

    if (
      membership.userId === auth.user.id &&
      body.role !== undefined &&
      body.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas retirer votre propre rôle administrateur.",
        },
        { status: 400 }
      );
    }

    if (
      membership.userId === auth.user.id &&
      body.isActive === false
    ) {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas désactiver votre propre compte.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (transaction) => {
        const updatedMembership =
          await transaction.membership.update({
            where: {
              id: membership.id,
            },
            data: {
              ...(body.role !== undefined
                ? { role: body.role }
                : {}),
              ...(body.isActive !== undefined
                ? { isActive: body.isActive }
                : {}),
            },
            include: {
              user: true,
            },
          });

        await transaction.auditLog.create({
          data: {
            companyId: auth.company.id,
            actorId: auth.user.id,
            action: "USER_UPDATED",
            entityType: "Membership",
            entityId: membership.id,
            details: JSON.stringify({
              email: membership.user.email,
              previousRole: membership.role,
              newRole: updatedMembership.role,
              previousIsActive: membership.isActive,
              newIsActive: updatedMembership.isActive,
            }),
          },
        });

        return updatedMembership;
      }
    );

    return NextResponse.json({
      message: "Utilisateur mis à jour.",
      user: {
        membershipId: result.id,
        userId: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.role,
        isActive: result.isActive && result.user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      { error: "Impossible de modifier l’utilisateur." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(auth.membership.role)) {
      return NextResponse.json(
        { error: "Accès réservé aux administrateurs." },
        { status: 403 }
      );
    }

    const { membershipId } = await context.params;

    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
      },
    });

    if (
      !membership ||
      membership.companyId !== auth.company.id
    ) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (membership.role === "OWNER") {
      return NextResponse.json(
        { error: "Le compte propriétaire ne peut pas être supprimé." },
        { status: 403 }
      );
    }

    if (membership.userId === auth.user.id) {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas supprimer votre propre accès.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.membership.delete({
        where: {
          id: membership.id,
        },
      });

      await transaction.auditLog.create({
        data: {
          companyId: auth.company.id,
          actorId: auth.user.id,
          action: "USER_REMOVED",
          entityType: "Membership",
          entityId: membership.id,
          details: JSON.stringify({
            userId: membership.userId,
            email: membership.user.email,
            role: membership.role,
          }),
        },
      });
    });

    return NextResponse.json({
      message: "Utilisateur retiré de l’entreprise.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return NextResponse.json(
      { error: "Impossible de supprimer l’utilisateur." },
      { status: 500 }
    );
  }
}
