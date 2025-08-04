'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Divider, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuantitySelector from './QuantitiySelector';
import { CartItem } from '@/types/Type';

export default function CartItemRow({
    item,
    onSetQuantity,
    onDelete
}: {
    item: CartItem;
    onSetQuantity: (newQuantity: number) => void;
    onDelete: () => void;
}) {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);

    useEffect(() => {
        setLocalQuantity(item.quantity);
    }, [item.quantity]);

    const handleIncrease = () => {
        const newQuantity = localQuantity + 1;
        setLocalQuantity(newQuantity);
        onSetQuantity(newQuantity);
    };

    const handleDecrease = () => {
        if (localQuantity <= 1) return;
        const newQuantity = localQuantity - 1;
        setLocalQuantity(newQuantity);
        onSetQuantity(newQuantity);
    };

    return (
        <>
            <ListItem className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={`data:image/jpeg;base64,${item.productImages[0]}`}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg mr-4 shadow-md"
                    />
                    <ListItemText
                        primary={
                            <Typography variant="h6" className="text-gray-800 font-semibold">
                                {item.productName}
                            </Typography>
                        }
                        secondary={
                            <Box className="mt-2">
                                <QuantitySelector
                                    quantity={localQuantity}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                />
                                <Typography variant="subtitle1" className="text-green-700 font-bold mt-2">
                                    ${item.productPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        }
                    />
                </div>
                <IconButton edge="end" aria-label="delete" onClick={onDelete}>
                    <DeleteIcon color="error" />
                </IconButton>
            </ListItem>
            <Divider component="li" className="bg-gray-200" />
        </>
    );
}
