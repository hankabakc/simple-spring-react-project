'use client';

import { Button, Stack } from '@mui/material';

export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease
}: {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" size="small" onClick={onDecrease} disabled={quantity <= 1}>-</Button>
            <span className="min-w-[24px] text-center">{quantity}</span>
            <Button variant="outlined" size="small" onClick={onIncrease}>+</Button>
        </Stack>
    );
}
