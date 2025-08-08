import React from 'react';
import { Genre } from '@/types';
import { GenreLibrary } from '@/utils/genre_id';
import {RenderGenreProps } from '@/types';
import { Box, Typography } from '@mui/material';




const RenderGenre: React.FC<RenderGenreProps> = ({ genreIds }) => {
   const genreNames = genreIds.map((id) => GenreLibrary.find((genre) => genre.id === id)?.name).filter((name): name is string => name !== undefined);
    return (
       <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
        <Typography sx={{ fontSize: '10px', color: '#e5e5e5'}} variant="body2">{genreNames.join(', ')}{" "}</Typography>
        </Box>
    );
};

export default RenderGenre;