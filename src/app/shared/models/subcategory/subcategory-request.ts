import { SortOrder } from "../../../core/enums/sort-order.enum";

export interface SubcategoryRequest {
    skip: number;
    take: number;
    sortDirection: SortOrder;
    sortBy: string;
    name: string;
    categoryId: string;
}
