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

export type User = {
    id: number;
    username: string;
    token: string;
};

// CartItem tanımını backend'den gelen CartItemResponse ile eşleştirin
export type CartItem = {
    productId: number;
    productName: string;
    productImage: string; // Resim eklendi
    productPrice: number; // Fiyat eklendi
    quantity: number;
};

export type NavbarProps = {
    onSearchChange: (value: string) => void;
    search: string;
};
