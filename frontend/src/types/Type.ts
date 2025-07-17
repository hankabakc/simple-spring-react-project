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
    role: 'ADMIN' | 'USER';
};


export type CartItem = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

export type NavbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (value: string) => void;
};

export type DetailContentProps = {
    product: Product;
};

export type SidebarProps = {
    categories: Category[];
    selected: number[];
    onChange: (categoryId: number, checked: boolean) => void;
    className?: string;
};

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    loading: boolean;
};