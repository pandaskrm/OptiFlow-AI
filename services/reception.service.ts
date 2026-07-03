import { Reception } from "../types/reception";

class ReceptionService {
  async getAll(): Promise<Reception[]> {
    const response = await fetch("/api/receptions");
    return response.json();
  }

  async create(data: Omit<Reception, "id">) {
    return fetch("/api/receptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async delete(id: number) {
    return fetch(`/api/receptions/${id}`, {
      method: "DELETE",
    });
  }

  async updateStatus(id: number, status: string) {
    return fetch(`/api/receptions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  }
}

export default new ReceptionService();