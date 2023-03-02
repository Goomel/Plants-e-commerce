export interface Product {
    id:                string;
    name:              string;
    slug:              string;
    price:             number;
    category:          Category;
    size:              Size;
    description:       string;
    images:            Image[];
    new:               boolean;
    popular:           boolean;
}

export interface Image {
    url: string;
}

export type Size = "S" | "M" | "L";

export type Category = "indoor" | "outdoor" | "garden"

export enum TypeOfProducts {
    Popular = "popular",
    New = "new",
    All = ""
}

export interface Filter {
    price: number | null;
    category: Category | null;
    size: Size | null;
}
