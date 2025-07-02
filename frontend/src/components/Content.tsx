'use client';

import { Product } from "@/types/Type";
import { Button } from "@mui/material";
import Link from "next/link";


export default function Content({ products }: { products: Product[] }) {
    return (
        <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-amber-400 rounded-lg shadow p-4 flex flex-col items-center">

                        <Link href={`/products/${product.id}`}>
                            <div>
                                <h2 className="text-lg font-bold">{product.name}</h2>
                                <p className="text-sm">{product.explanation}</p>
                                <p className="text-md font-semibold">${product.price}</p>
                            </div>
                        </Link>
                        <Button variant="contained" sx={{ backgroundColor: 'rgba(80, 10, 190, 1)' }}>Sepete Ekle</Button>
                    </div>
                ))
                }
            </div >
        </div >
    );
}
