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
                className="modal-paper"
                sx={{ outline: 'none' }}
            >
                <Typography
                    id="login-required-title"
                    variant="h6"
                    className="text-centered text-blue-500 mb-default text-bold"
                >
                    Login Required
                </Typography>

                <Typography
                    id="login-required-description"
                    className="text-centered text-gray-700 mb-6"
                >
                    You need to be logged in to view your cart.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onClose}
                        className="btn-outlined-primary"
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginClick}
                        className="btn-primary"
                    >
                        Login
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}