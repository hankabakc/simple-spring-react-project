// src/components/common/StyledCard.tsx

import React from 'react';
import { Card, CardProps } from '@mui/material';

interface StyledCardProps extends CardProps {
}

export default function StyledCard({ children, ...props }: StyledCardProps) {
    return (
        <Card
            className="card-primary flex flex-col items-center"
            {...props}
        >
            {children}
        </Card>
    );
}