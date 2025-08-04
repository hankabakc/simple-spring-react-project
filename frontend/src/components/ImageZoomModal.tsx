'use client';

import React from 'react';
import { Dialog } from '@mui/material';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

type Props = {
    open: boolean;
    onClose: () => void;
    image: string;
};

export default function ImageZoomModal({ open, onClose, image }: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <div className="bg-white p-4">
                <InnerImageZoom
                    src={image}
                    zoomType="hover"
                    zoomScale={1.5}
                    zoomPreload={true}
                    hideHint={false}
                    className="max-w-full max-h-[80vh] object-contain"
                />
            </div>
        </Dialog>
    );
}
