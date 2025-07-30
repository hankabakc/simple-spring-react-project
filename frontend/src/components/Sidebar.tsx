'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Alert
} from '@mui/material';
import { SidebarProps, Category } from '@/types/Type';
import api from '@/services/api';

export default function Sidebar({ selected, onChange, categories, className }: SidebarProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setLocalCategories(categories);
            return;
        }
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await api.get('/api/categories');
                setLocalCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [categories]);

    if (loading) {
        return (
            <Box className={`flex flex-col p-4 border-r ${className || ''}`}>
                <CircularProgress size={24} />
                <Typography variant="body2" className="mt-2">Loading categories...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={`flex flex-col p-4 border-r ${className || ''}`}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box className={`flex flex-col p-5 w-64 bg-white ${className || ''}`}>
            <Typography variant="h6" className="mb-4 font-bold">
                Categories
            </Typography>
            {localCategories.map((category) => (
                <FormControlLabel
                    key={category.id}
                    control={
                        <Checkbox
                            checked={selected.includes(category.id)}
                            onChange={(e) => onChange(category.id, e.target.checked)}
                        />
                    }
                    label={<Typography>{category.name}</Typography>}
                    className="mb-2"
                />
            ))}
        </Box>
    );
}