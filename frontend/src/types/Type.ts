export type Product = {
    id: number;
    name: string;
    price: number;
    explanation: string;
    categoryName: string;
    base64Images: string[];
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
    productImages: string[];
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

export interface OrderRequest {
    name: string;
    price: number;
    quantity: number;
}

export type OrderResponse = {
    id: number;
    orderId: number;
    username: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export type CartItemResponse = {
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
}

export type ProductFormProps = {
    initialValues?: {
        name: string;
        price: number;
        explanation: string;
        categoryId: number;
    };
    onSubmit: (formData: FormData) => Promise<void>;
    categories: Category[];
    loading: boolean;
    error?: string | null;
    submitLabel?: string;
}
export type RegisterFormProps = {
    onRegisterSuccess: () => void;
}
export type LoginFormProps = {
    onLoginSuccess: (userData: any) => void;
};

export type CartContextType = {
    cartItems: CartItem[];
    refreshCart: () => Promise<void>;
    addToCartAndRefresh: (productId: number, quantity: number) => Promise<void>;
};

export type LoginRequest = {
    username: string;
    password: string;
};

export type RegisterResponse = {
    success: boolean;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    role: string;
};
export type ProductImageSelectorProps = {
    images: string[];
    selectedImage: string | null;
    onSelect: (img: string) => void;
};