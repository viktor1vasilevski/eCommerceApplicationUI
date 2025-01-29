import { SortOrder } from "../../../core/enums/sort-order.enum";

export interface CategoryRequest {
    skip: number;
    take: number;
    sort: SortOrder;
    name: string;
}
