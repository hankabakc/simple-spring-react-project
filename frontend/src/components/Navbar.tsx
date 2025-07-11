'use client';

import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    TextField,
    Button,
    ButtonGroup,
    Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function Navbar() {
    const [search, setSearch] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <AppBar
            position="static"
            className="bg-purple-950 border-b border-b-blue-500 shadow-none"
        >
            <Toolbar className="flex justify-between items-center px-5 h-20">
                <Box className="flex items-center">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        color="secondary"
                        className="bg-white rounded"
                    />
                </Box>
                <ButtonGroup variant="text" className="space-x-2">
                    <Button
                        startIcon={<PersonIcon />}
                        className="text-gray-200 hover:bg-purple-800/30"
                    >
                        Kullanıcı
                    </Button>
                    <Link href={`/cart?userId=1`}>
                        <Button
                            startIcon={<ShoppingCartIcon />}
                            className="text-gray-200 hover:bg-purple-800/30"
                        >
                            Sepet
                        </Button>
                    </Link>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
}
