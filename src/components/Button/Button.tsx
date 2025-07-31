import { Box, ButtonProps } from '@mui/material';
import React from 'react';

const Button: React.FC<any> = ({ filled, label, Icon, rounded, onClick, hidden }) => {
    const backgroundColor = filled ? 'blue' : 'transparent';
    const color = filled ? 'white' : 'black';
    const borderRadius = rounded ? '50%' : '4px';
    const display = hidden ? 'none' : 'inline-flex';
    const alignItems = 'center';
    const padding = rounded ? '.4rem' : '.7rem 1.8rem';

    return (
     
        <Box
        component="button"
        onClick={onClick}
        sx={{
            zIndex: 10,
            color: color,
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            display: display,
            alignItems: alignItems,
            padding: padding,
            width: rounded ? "min-content": "fit-content",
            cursor: 'pointer',
            flexDirection: 'row',
            justifyContent: 'center',
            margin: rounded? ".2rem" : ".4rem",
            outline: 'none',
            border: filled ? 'none': '2.2px solid #ffffff80',
            fontSize: rounded ? '1.2rem': 'inherit',
            "&:hover": {
                opacity: 0.8,
                backgroundColor: filled ? 'tomato' : backgroundColor,
            },
            "@media (max-width: 600px)": {
                backgroundColor: filled ? 'tomato' : backgroundColor,
                width: '100%',
                padding: rounded ? '.4rem' : '.7rem 1.2rem',
            }
        }}>
            <Box
            component={Icon}
            sx={{
                marginTop: !rounded ? '.8rem' : '0',
                fontSize: rounded ? '1rem' : '1.2rem',
                color: color,
            }}>
                {!rounded &&(
                    <Box
                    component="span"
                    sx={{
                        fontWeight: 'bold',
                        marginLeft: '0.5rem',
                        fontSize: '1rem',
                        "@media (max-width: 600px)": { marginLeft: '0.6rem' }
                    }}>
                        {label}
                    </Box>
                )}
                
            </Box>
        </Box>
    );
   
    
};

export default Button;