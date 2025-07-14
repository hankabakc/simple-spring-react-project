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


export type User = {
    id: number;
    username: string;
    token: string;
};


export type CartItem = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

export type NavbarProps = {
    onSearchChange: (value: string) => void;
    search: string;
};

export type DetailContentProps = {
    product: Product;
};

export type SidebarProps = {
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
    categories: Category[],
    className?: string
};

export type AuthContextType = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};