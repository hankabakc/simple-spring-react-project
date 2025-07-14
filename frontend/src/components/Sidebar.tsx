// src/components/Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, CircularProgress, Alert } from '@mui/material';
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
                console.error("Kategoriler çekilirken hata oluştu:", err);
                setError("Kategoriler yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [categories]);

    if (loading) {
        return (
            <Box className={`sidebar-primary flex flex-col p-default border-r border-purple-600 ${className || ''}`}>
                <CircularProgress size={24} className="text-white" />
                <Typography className="text-white mt-2">Kategoriler yükleniyor...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={`sidebar-primary flex flex-col p-default border-r border-purple-600 ${className || ''}`}>
                <Alert severity="error" className="bg-red-500 text-white">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box className={` flex flex-col border-red-700 p-5 w-64 ${className || ''}`}>
            <Typography variant="h6" className="text-white mb-default text-bold">
                Kategoriler
            </Typography>
            {localCategories.map((category) => (
                <FormControlLabel
                    key={category.id}
                    control={
                        <Checkbox
                            checked={selected.includes(category.name)}
                            onChange={(e) => onChange(category.name, e.target.checked)}
                            className="category-checkbox"
                        />
                    }
                    label={<Typography className="text-gray-300">{category.name}</Typography>}
                    className="mb-2"
                />
            ))}
        </Box>
    );
}