import { NonGenericApiResponse } from "./non-generic-api-response";

export interface ApiResponse<T> extends NonGenericApiResponse {
  data: T | null;
  totalCount: number | null;
}