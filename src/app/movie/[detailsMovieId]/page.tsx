import { Box } from '@mui/material';
import React from 'react';
import { usePathname } from 'next/navigation';
import { getMovie } from '@/utils/apiService';
import { Video } from '@/types';

const DetailsMoviePage = () => {
    const pathname = usePathname();
    const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const movieId = pathname.split("/").pop();

    const loadTrailer = async () => {
        const res = await getMovie(`/movie/${movieId}/videos`);

        if (res) {
            setError(res.error.message);
            setLoading(false);
        }
        else {
            const trailer = (res.data?.results as Video[]).find(
                (video) => video.type === "Trailer"
            );
            setTrailerKey(trailer?.key || null);
            setLoading(false);
        }

    }


    return (
        <Box>

        </Box>
    );
}

export default DetailsMoviePage