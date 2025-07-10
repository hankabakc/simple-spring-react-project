'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '@/types/Type';
import {
    Drawer,
    Box,
    Typography,
    Divider,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
    variant: 'permanent' | 'temporary';
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
};

export default function Sidebar({
    open,
    onClose,
    variant,
    selected,
    onChange
}: SidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Kategori çekme hatası:', err));
    }, []);

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 240,
                    bgcolor: 'primary.dark',
                    color: 'grey.100',
                    p: 2
                }
            }}
        >
            <Box display="flex" flexDirection="column" height="100%">
                {variant === 'temporary' && (
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={onClose} sx={{ color: 'grey.100' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Kategoriler
                </Typography>

                <Divider sx={{ mb: 2, borderColor: 'primary.light' }} />

                {!categories.length ? (
                    <Typography variant="body2" color="grey.400">
                        Kategoriler yükleniyor...
                    </Typography>
                ) : (
                    <FormControl component="fieldset" sx={{ flex: 1 }}>
                        <FormGroup>
                            {categories.map((cat) => (
                                <FormControlLabel
                                    key={cat.id}
                                    control={
                                        <Checkbox
                                            checked={selected.includes(cat.name)}
                                            onChange={(e) => onChange(cat.name, e.target.checked)}
                                            sx={{
                                                color: 'grey.300',
                                                '&.Mui-checked': { color: 'secondary.main' }
                                            }}
                                        />
                                    }
                                    label={<Typography>{cat.name}</Typography>}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                )}
            </Box>
        </Drawer>
    );
}
