type ErpApiClientOptions = {
  baseUrl: string;
  apiKey?: string | null;
  externalCompanyId?: string | null;
  timeoutMs?: number;
};

export class ErpApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ErpApiError";
  }
}

export class ErpApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly options: ErpApiClientOptions,
  ) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 15000;
  }

  async get<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeoutMs,
    );

    try {
      const headers = new Headers({
        Accept: "application/json",
      });

      if (this.options.apiKey) {
        headers.set(
          "Authorization",
          `Bearer ${this.options.apiKey}`,
        );
      }

      if (this.options.externalCompanyId) {
        headers.set(
          "X-Company-Id",
          this.options.externalCompanyId,
        );
      }

      const response = await fetch(
        `${this.baseUrl}/${path.replace(/^\/+/, "")}`,
        {
          method: "GET",
          headers,
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const details = await response
          .text()
          .catch(() => "");

        throw new ErpApiError(
          details ||
            `API ERP indisponible : HTTP ${response.status}.`,
          response.status,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        throw new ErpApiError(
          "Le délai de réponse de l'ERP est dépassé.",
        );
      }

      if (error instanceof ErpApiError) {
        throw error;
      }

      throw new ErpApiError(
        error instanceof Error
          ? `Connexion ERP impossible : ${error.message}`
          : "Connexion ERP impossible.",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
