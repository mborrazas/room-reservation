export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccessBody<T> {
  data: T;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}
