import { Reception } from "../types/reception";

export async function getReceptions(): Promise<Reception[]> {
  const response = await fetch("/api/receptions");
  return response.json();
}

export async function createReception(data: Omit<Reception, "id">) {
  const response = await fetch("/api/receptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function deleteReceptionById(id: number) {
  const response = await fetch(`/api/receptions/${id}`, {
    method: "DELETE",
  });

  return response;
}