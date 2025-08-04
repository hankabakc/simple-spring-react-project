'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { Product, Category } from '@/types/Type';
import {
    fetchAllProducts,
    searchProducts,
    deleteProductById
} from '@/services/productService';
import { fetchAllCategories } from '@/services/categoryService';
import Navbar from '@/components/Navbar';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetchAllProducts(),
                    fetchAllCategories()
                ]);
                setProducts(productsRes);
                setCategories(categoriesRes);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params: { search?: string; categoryIds?: string } = {};
            if (search) params.search = search;
            if (selectedCategoryIds.length > 0) {
                params.categoryIds = selectedCategoryIds.join(',');
            }

            const result = await searchProducts(params);
            setProducts(result);
        } catch (err) {
            console.error('Search or filter error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = confirm('Are you sure you want to delete this product?');
        if (!confirmed) return;

        try {
            await deleteProductById(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Product could not be deleted.');
        }
    };

    return (
        <>
            <Navbar
                search=""
                onSearchChange={() => { }}
                onSearchSubmit={() => { }}
            />

            <Box className="p-8">
                <Typography variant="h5" className="font-bold mb-6">
                    Product List
                </Typography>
                <div className='h-5'></div>

                <Box className="flex flex-wrap items-center gap-4 mb-8">
                    <TextField
                        label="Search Product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                    <FormControl className="w-64">
                        <InputLabel id="category-select-label" >Select Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            multiple
                            value={selectedCategoryIds}
                            onChange={(e) => setSelectedCategoryIds(e.target.value as number[])}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                    <Link href="/admin/products/add">
                        <Button variant="outlined">Add New Product</Button>
                    </Link>
                </Box>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer component={Paper} className="shadow-md rounded-lg">
                        <Table>
                            <TableHead className="bg-gray-100">
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Category</strong></TableCell>
                                    <TableCell><strong>Image</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.explanation}</TableCell>
                                            <TableCell>{product.price} ₺</TableCell>
                                            <TableCell>{product.categoryName}</TableCell>
                                            <TableCell>
                                                <Avatar
                                                    src={`data:image/jpeg;base64,${product.base64Images[0]}`}
                                                    variant="rounded"
                                                    className="w-16 h-16"
                                                />
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <Link
                                                    href={`/admin/products/edit?id=${product.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold transition mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-800 font-semibold transition"
                                                >
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </>
    );
}