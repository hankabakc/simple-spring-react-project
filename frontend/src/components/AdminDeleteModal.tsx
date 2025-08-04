'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { useState } from 'react';

import { AdminDeleteModalProps } from '@/types/Type';



export default function AdminDeleteModal({ open, onClose, onConfirm }: AdminDeleteModalProps) {
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        onConfirm(message);
        setMessage('');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Silme Nedeni</DialogTitle>
            <DialogContent>
                <TextField
                    label="Admin Mesajı"
                    multiline
                    rows={4}
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button onClick={handleConfirm} variant="contained" color="error">
                    Onayla ve Sil
                </Button>
            </DialogActions>
        </Dialog>
    );
}
