"use client";
import React, { useEffect } from 'react'
import { Media,MediaItem } from '@/types';
import { getMovie, setMovies } from '@/utils/apiService';
import { Box , CircularProgress, Typography} from '@mui/material';
import MovieSections from '@/components/MovieSections/MovieSections';
import Cards from '@/components/Cards/Cards';

const MyListPage = () => {

    const [myList, setMyList] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const loadMovies = async() => {
        setLoading(true);
        const favouriteItems: MediaItem[] = JSON.parse(localStorage.getItem("favouriteItems") || "[]");

        if(favouriteItems.length === 0) {
           setError("No movies in your list");
           setLoading(false);
           return;
        }

        const mediaPromises = favouriteItems.map(async (item: MediaItem) => {
           const endpoint = item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
           return getMovie(endpoint);
        });

        const mediaResponses = await Promise.all(mediaPromises);
        const fetchedMedia = mediaPromises.filter((response: any) => {response && response.data}).map((response: any) => response.data as unknown as Media);
        
        setMovies(fetchedMedia);
        setLoading(false);
    };

    useEffect(() => {
        loadMovies();
    }, []);

    const removeMovie = (id: number)=> {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    }

    return (

        <Box sx={{display: "flex",
         flexDirection: "column",
         backgroundColor: "#141414",
         p: 2,
         textTransform: "capitalize"}}>
            <Typography
            component="strong"
            sx={{
                fontSize: "20px",
                marginLeft: "3rem",
                padding: ".5rem 0",
                width: "fit-content",
                zIndex: 1,
                marginBottom: "1rem"
            }}>
                My Movie List
            </Typography>
            {loading && (
                <Box>
                    <CircularProgress color="inherit"/>
                </Box>
            )}

            {!loading && error && (
                <Box>
                    <Typography sx={{color: "red", pl: 6}}>{error}</Typography>
                </Box>
            )}

            {!loading && !error && (
                <Box>   
                   {MovieSections.filter((movie) => movie.poster_path !== null).map((movie) => (
                       <Cards
                        key={movie.id}
                        item={movie}
                        removeMovie={removeMovie}
                        enableGenres={true}/>
                   ))} 
                </Box>
            )}
            

        </Box>
    )
}

export default MyListPage