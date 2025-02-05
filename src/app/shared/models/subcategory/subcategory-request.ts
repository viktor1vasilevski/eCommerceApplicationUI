import { SortOrder } from "../../../core/enums/sort-order.enum";

export interface SubcategoryRequest {
    skip: number;
    take: number;
    sort: SortOrder;
    name: string;
    categoryId: string;
}
