export type Product = {
    id: number;
    name: string;
    price: number;
    explanation: string;
    categoryName: string;
    base64Image: string;
};

export type Category = {
    id: number;
    name: string;
};

export type SidebarProps = {
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
    categories: Category[];
};