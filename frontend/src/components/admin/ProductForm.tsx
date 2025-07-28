'use client';

import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { ProductFormProps } from '@/types/Type';



export default function ProductForm({
    initialValues = {
        name: '',
        price: 0,
        explanation: '',
        categoryId: 0
    },
    onSubmit,
    categories,
    loading,
    error,
    submitLabel = 'Save'
}: ProductFormProps) {
    const [name, setName] = useState(initialValues.name);
    const [price, setPrice] = useState(initialValues.price);
    const [explanation, setExplanation] = useState(initialValues.explanation);
    const [categoryId, setCategoryId] = useState(initialValues.categoryId);
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('explanation', explanation);
        formData.append('categoryId', categoryId.toString());
        if (image) formData.append('image', image);

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    required
                />
                <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    required
                />
                <TextField
                    select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    required
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImage(file);
                    }}
                    required={!initialValues.name}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? <CircularProgress size={24} /> : submitLabel}
                </Button>
            </Stack>
        </form>
    );
}
