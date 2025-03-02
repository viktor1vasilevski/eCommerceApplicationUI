export interface ProductRequest {
    name: string;
    brand: string;
    description: string;
    edition: string;
    scent: string;
    categoryId: string;
    subcategoryId: string;
    price: string;
    quantity: string;
    volume: string;
    skip: number;
    take: number;
    sortDirection: string | null;
    sortBy: string;
}