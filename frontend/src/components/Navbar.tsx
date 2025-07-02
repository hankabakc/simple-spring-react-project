'use client';
import { useState } from 'react';
import { Button, ButtonGroup, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Navbar() {
    const [search, setSearch] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <div className="h-20 w-full px-5 flex items-center justify-between bg-purple-950 border-b border-b-blue-500">
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                size="small"
                color="secondary"
                value={search}
                onChange={handleSearchChange}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: 'rgba(200, 200, 200, 0.9)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(200, 200, 200, 0.9)',
                    },
                }}
            />

            <ButtonGroup variant="text">
                <Button
                    startIcon={<PersonIcon />}
                    sx={{
                        backgroundColor: 'transparent',
                        '&:hover': { backgroundColor: 'rgba(128,0,128,0.3)' },
                        color: 'rgba(150, 150, 150, 0.9)',
                    }}
                >
                    Kullanici
                </Button>
                <Button
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                        backgroundColor: 'transparent',
                        '&:hover': { backgroundColor: 'rgba(128,0,128,0.3)' },
                        color: 'rgba(150,150,150,0.9)',
                    }}
                >
                    Sepet
                </Button>
            </ButtonGroup>
        </div>
    );
}
