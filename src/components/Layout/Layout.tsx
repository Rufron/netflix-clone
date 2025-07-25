"use client";
import { ChildrenProvider } from '@/types';
import { Box } from '@mui/material';
import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Layout: React.FC<ChildrenProvider> = ({children}) => {
    return (
        <Box sx={{ minHeight: '200vh', display: 'flex', flexDirection: 'column', backgroundColor: '#141414', color: '#fff' }}>
            {/* Header can be added here */}
            <Navbar />
            <Box sx={{ flex: 1, padding: '20px' }}>
                {/* Main content area */}
            {children}
            </Box>
            <Box sx={{ flex: '0 0 auto' }}>
                <Footer />
            </Box>
        </Box>
    );
}
export default Layout;