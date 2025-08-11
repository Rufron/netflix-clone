"use client";
import { useSearchParams } from 'next/navigation';
import React, {useState, useEffect} from 'react';
import { getMovie } from '@/utils/apiService';
import { Box, CircularProgress, Typography } from '@mui/material';
import Cards from '@/components/Cards/Cards';

const SearchPage = () => {

    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [movies, setMovies] = React.useState([]);

    const loadMovies = async() => {
        if(query) {
            setLoading(true);
            const res = await getMovie(`/search/movie?query=${encodeURIComponent(query)}`);
            if (res.error) {
                setError(res.error.message);
            }
            else {
                setMovies(res.data?.results || []);
            }
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadMovies();
    }, [query]);

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            pt:2,
            backgroundColor: "#black",
            textTransform: "capitalize",
            marginTop: { xs: 0, sm: 2 },
        }}>
            <Typography>
                More to Explore:
            </Typography>

            {loading && (
                <Box>
                    <CircularProgress color="inherit"/>
                </Box>
            )}
            {!loading && error && <Typography color="red">{error}</Typography>
            }
            {!loading && !error && <Box>
                {movies.filter((movie)=>movie.backdrop_path !== null).map((movie) => <Cards key={movie.id} item={movie} enableGenres={false} />)}
                </Box>}
        </Box>
    );
};

const PageWrapper = () => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}>
                <CircularProgress color="inherit"/>
            </Box>

            <SearchPage />
        </React.Suspense>   
    );
}

export default SearchPage