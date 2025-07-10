'use client';

import { useState } from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function ProductsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories(prev =>
            checked ? [...prev, category] : prev.filter(c => c !== category)
        );
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar onMenuClick={handleDrawerToggle} />
            <Sidebar
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                variant={isMobile ? 'temporary' : 'permanent'}
                selected={selectedCategories}
                onChange={handleCategoryChange}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: { xs: 0, md: 8 },
                    width: { md: `calc(100% - 240px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh'
                }}
            >
                <h1 className="text-2xl font-bold mb-4">Ürünler</h1>
                <p>Seçili Kategoriler: {selectedCategories.join(', ') || 'Yok'}</p>
                <div className="mt-4">
                </div>
            </Box>
        </Box>
    );
}
