import React, { useEffect, useState } from "react";
import { Media,SimilarMediaProps } from "@/types";
import { getMovie } from "@/utils/apiService";
import { Box, Typography } from "@mui/material";
import SimilarMediaCard from "../SimilarMediaCard/SimilarMediaCard";

const SimilarMedia: React.FC<SimilarMediaProps> = ({id}) => {
    const [similarMovies, setSimilarMovies] = React.useState([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchSimilarMovies = async () => {
        const res = await getMovie(`/movie/${id}/similar`);

        if (res.error) {
            setError(res.error.message);
        }
        else {
            setSimilarMovies(res.data?.results || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSimilarMovies();
    }, []);

    if(loading){
        return<Typography>Loading...</Typography>;
    }
    if(error){
        return<Typography>Error: {error}</Typography>;
    }

    return (<Box
    sx={{
        padding: 2,
        overflowX: "auto",
    }}>
        <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 3fr)",
                md: "repeat(3, 3fr)",
            },
            gap: "12px",
        }}>
            {similarMovies.length > 0 ? (
                similarMovies
                .filter((movie) => movie.poster_path)
                .map((item) => <SimilarMediaCard key={item.id} item={item} />)
            ):(
                <Typography>No similar movies found</Typography>
            )}
        </Box>
    </Box>);
};

export default SimilarMedia;