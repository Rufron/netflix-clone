import { SliderButtonProps } from '@/types';
import { Next, Previous } from '@/utils/icons';
import { Button } from '@mui/material';
import React from 'react';

const SliderButton:React.FC<SliderButtonProps> = ({isRight}) => {
    const handleScroll = (event: React.MouseEvent<HTMLButtonElement>) => {
        const parent = event.currentTarget.closest('.scroll-container-parent')
        const scrollContainer = parent?.querySelector('.scroll-container');

        if (scrollContainer) {
            const scrollAmount = isRight ? 500 : -500;
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        else {
            console.error('Scroll container not found');
        }
    }
    return (
        <Button
        onClick={handleScroll}
        sx={{
            display: { xs: 'none', md: 'block' },
            color: 'white',
            position: 'absolute',
            right: isRight ? '0' : 'auto',
            left: isRight ? 'auto' : '0',
            top: '0',
            zIndex: 1,
            padding: '3.7rem',
        }}>
            {isRight ? <Next/> : <Previous />}
        </Button>
    );
};

export default SliderButton;