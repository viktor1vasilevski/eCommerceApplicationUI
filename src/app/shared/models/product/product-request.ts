export interface ProductRequest {
    name: string;
    brand: string;
    edition: string;
    scent: string;
    categoryId: string;
    subcategoryId: string;
    skip: number;
    take: number;
    sort: string;
}