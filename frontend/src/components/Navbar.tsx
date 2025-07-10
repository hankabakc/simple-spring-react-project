'use client';

import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    TextField,
    Button,
    ButtonGroup,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

type NavbarProps = {
    onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
    const [search, setSearch] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <AppBar position="static" color="primary" elevation={1}>
            <Toolbar
                sx={{
                    height: 80,
                    px: { xs: 2, sm: 4 },
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {/* Sol Kısım: Menü ve Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {onMenuClick && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onMenuClick}
                            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        MyShop
                    </Typography>
                </Box>

                {/* Orta Kısım: Search */}
                <Box
                    sx={{
                        flex: 1,
                        maxWidth: 400,
                        mx: 2,
                        display: { xs: 'none', sm: 'flex' }
                    }}
                >
                    <TextField
                        label="Ara"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={search}
                        onChange={handleSearchChange}
                        color="secondary"
                    />
                </Box>

                {/* Sağ Kısım: Kullanıcı ve Sepet */}
                <ButtonGroup variant="text" color="inherit">
                    <Button startIcon={<PersonIcon />} color="inherit">
                        Kullanıcı
                    </Button>
                    <Button startIcon={<ShoppingCartIcon />} color="inherit">
                        Sepet
                    </Button>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
}
