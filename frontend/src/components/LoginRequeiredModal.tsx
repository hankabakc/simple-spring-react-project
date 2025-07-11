'use client';

import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginRequiredModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();

    const handleLoginClick = () => {
        onClose();
        router.push('/auth/login');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="login-required-title"
            aria-describedby="login-required-description"
        >
            <Box
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-auto mt-40 border border-blue-500"
                sx={{ outline: 'none' }}
            >
                <Typography
                    id="login-required-title"
                    variant="h6"
                    className="text-center font-bold text-blue-500 mb-4"
                >
                    Login Required
                </Typography>

                <Typography
                    id="login-required-description"
                    className="text-center text-gray-700 mb-6"
                >
                    You need to be logged in to view your cart.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onClose}
                        className="border-blue-500 text-blue-500 hover:bg-blue-500"
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginClick}
                        className="bg-blue-500 hover:bg-blue-500"
                    >
                        Login
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
