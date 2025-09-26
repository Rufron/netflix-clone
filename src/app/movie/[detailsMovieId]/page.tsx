"use client";
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { usePathname } from 'next/navigation';
import { getMovie } from '@/utils/apiService';
import { Video } from '@/types';
import ReactPlayer from 'react-player'

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
        <Box
        sx={{backgroundColor: "black",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5rem"
        }}>
            {loading && (
                <Box
                sx={{display: "flex", justifyContent: "center"}}>
                    <CircularProgress color="inherit"/>
                </Box>
            )}

            {!loading && error && (
                <Typography
                sx={{color: "error",

                }}
                variant="h6">{error}</Typography>
            )}

            {!loading && !error && trailerKey && (
              <ReactPlayer 
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              playing
              controls
              width="100%"
              height="100%"
              config={{
                playerVars:{
                    autoplay: 1,
                    modestbranding:1,
                    showinfo:0
                }
              }}
               />
            )}

            {!loading && !error && !trailerKey && (
              <Typography 
              sx={{color: "error"}}
              variant="h6">
                Trailer Not found.
              </Typography>
            )}
        </Box>
    );
}

export default DetailsMoviePage