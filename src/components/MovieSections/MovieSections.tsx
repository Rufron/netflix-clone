"use client";
import { Box, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import { getMovie } from "@/utils/apiService";
import SliderButton from "../SliderButton/SliderButton";
import Cards from "../Cards/Cards";

// Define the props interface for MovieSections
interface MovieSectionProps {
    heading: string;
    endpoint: string;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const MovieSections: React.FC<MovieSectionProps> = (
    {  heading, endpoint, loading, setLoading } : MovieSectionProps
) => {

    const [media, setMedia] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

    const fetchMovies = async () => {
        if(setLoading) {
        setLoading(true);
        }
        const res = await getMovie(`${endpoint}`)

        if (res.error){
            setError(res.error.message);
        }
        else {
            setMedia(res.data?.results || []);
        }
        if(setLoading) {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchMovies();
    }, [endpoint]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
        setIsScrolled(scrollLeft > 0);
        const scrollTop = event.currentTarget.scrollTop;        
    }

    return (
    <Box
    sx={{
     display: 'flex',
     flexDirection: 'column',
     textTransform: 'capitalize',
     marginTop: '-9rem',
     zIndex: -1,
    }}>
     { error && <Typography variant="h6" color="error">{error}</Typography>  }
     {!loading && !error && (
         <>
         <Typography
         component="strong"
         sx={{
          fontSize: '1.5rem',
          marginLeft: '1rem',
          padding: '1rem 0',
          width: 'fit-content',
          marginBottom: '1rem',
          zIndex: 1,
          }}>
          {heading}
         </Typography>
         <Box
         className="scroll-container-parent"
         sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
         }}>
          {isScrolled && ( <SliderButton isRight={false} /> )}
          <Box className="scroll-container"
          onScroll={handleScroll}
          sx={{
              display: 'flex',
              flexDirection: 'row',
              padding: { xs: '3.2rem 6rem 12.5rem'},
              overflowX: 'auto',
              overflowY: 'hidden',
              marginTop: '-3rem',
              marginLeft: '-3rem',
              "&::-webkit-scrollbar": {
               display: 'none',
              },
              }}
              >
              {media?.filter((item) => item.poster_path).map((item,index) => (
               <Cards key={index} item={item} enableGenres={false}/>
              ))}
          </Box>
         </Box>
         </>
     )}
    </Box>
    );
}

export default MovieSections;