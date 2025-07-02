export type Product = {
    id: number;
    name: string;
    price: number;
    explanation: string;
    category: {
        id: number;
        name: string;
    };
};