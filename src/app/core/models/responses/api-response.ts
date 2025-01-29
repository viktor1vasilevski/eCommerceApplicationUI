import { NotificationType } from "../../enums/notification-type.enum";

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string | null;
  totalCount: number | null;
  errors: { [key: string]: string[] } | null;
  notificationType: NotificationType;
}