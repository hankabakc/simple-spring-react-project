'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '@/types/Type';
import {
    Paper,
    Typography,
    Divider,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

type SidebarProps = {
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
};

export default function Sidebar({ selected, onChange }: SidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Kategori çekme hatası:', err));
    }, []);

    if (!categories.length) {
        return (
            <div className="p-4 text-gray-400 text-sm">
                Kategoriler yükleniyor...
            </div>
        );
    }

    return (
        <Paper
            elevation={3}
            className="h-screen w-56 bg-purple-950 flex flex-col p-4 shadow-none border-r border-blue-500"
        >
            <Typography variant="h6" className="text-gray-200 mb-3">
                Kategoriler
            </Typography>
            <Divider className="mb-3 border-blue-500" />

            <FormControl component="fieldset" className="flex-1">
                <FormGroup className="space-y-2">
                    {categories.map((cat) => (
                        <FormControlLabel
                            key={cat.id}
                            control={
                                <Checkbox
                                    checked={selected.includes(cat.name)}
                                    onChange={(e) => onChange(cat.name, e.target.checked)}
                                    className="text-gray-300 hover:bg-purple-800/30 rounded"
                                />
                            }
                            label={
                                <Typography className="text-gray-200">
                                    {cat.name}
                                </Typography>
                            }
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Paper>
    );
}
