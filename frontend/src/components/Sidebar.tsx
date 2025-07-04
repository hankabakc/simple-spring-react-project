'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '@/types/Type';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

type SidebarProps = {
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
};

export default function Sidebar({ selected, onChange }: SidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error('Kategori çekme hatası:', err));
    }, []);

    if (!categories.length) {
        return <div className="p-4">Kategoriler yükleniyor...</div>;
    }

    return (
        <div className="h-screen w-56 bg-amber-500 flex flex-col items-start p-4">
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Kategori</FormLabel>
                <FormGroup>
                    {categories.map((cat) => (
                        <FormControlLabel
                            key={cat.id}
                            control={
                                <Checkbox
                                    checked={selected.includes(cat.name)}
                                    onChange={(e) => onChange(cat.name, e.target.checked)}
                                />
                            }
                            label={cat.name}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </div>
    );
}
