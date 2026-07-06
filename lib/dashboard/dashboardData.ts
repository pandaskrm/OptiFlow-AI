import { prisma } from "../prisma";

export async function getDashboardData() {
  const totalReceptions = await prisma.reception.count();

  const pendingReceptions = await prisma.reception.count({
    where: {
      status: "En attente",
    },
  });

  const completedReceptions = await prisma.reception.count({
    where: {
      status: "Terminée",
    },
  });

  return {
    totalReceptions,
    pendingReceptions,
    completedReceptions,
  };
}