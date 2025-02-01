import { NotificationType } from "../../enums/notification-type.enum";

export interface NonGenericApiResponse {
    success: boolean;
    message: string | null;
    errors: { [key: string]: string[] } | null;
    notificationType: NotificationType;
}
