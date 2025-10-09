"use client";
import { Box, Typography, IconButton } from "@mui/material";
import React from "react";
import Image from "next/image";
import { getMovie } from "@/utils/apiService";
import SliderButton from "../SliderButton/SliderButton";
import Cards from "../Cards/Cards";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";


// Define the props interface for MovieSections
interface MovieSectionProps {
    heading: string;
    endpoint: string;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const MovieSections: React.FC<MovieSectionProps> = (
    { heading, endpoint, loading, setLoading }: MovieSectionProps
) => {

    const [media, setMedia] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
    const [page, setPage] = React.useState<number>(0);

    // added pagination logic.
    const itemsPerPage = 5;
    const totalPages = Math.ceil(media.length / itemsPerPage);
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleItems = media.slice(startIndex, endIndex);

    const fetchMovies = async () => {
        if (setLoading) {
            setLoading(true);
        }
        const res = await getMovie(`${endpoint}`)

        if (res.error) {
            setError(res.error.message);
        }
        else {
            setMedia(res.data?.results || []);
        }
        if (setLoading) {
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

    const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -500, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 500, behavior: "smooth" });
        }
    };
    // to handle the next & previuos code.
    // const handleNext = () => {
    //     if (page < totalPages - 1) setPage(page + 1);
    // };

    // const handlePrev = () => {
    //     if (page > 0) setPage(page - 1);
    // };
    console.log("🎥 Media data:", media);

    return (
        <Box
            sx={{
                // display: 'flex',
                // flexDirection: 'column',
                // textTransform: 'capitalize',
                // marginTop: '-9rem',
                // zIndex: -1,


                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                gap: "1.5rem",
                padding: "0 2rem",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}>
            {error && <Typography variant="h6" color="error">{error}</Typography>}
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
                        /* {isScrolled && (<SliderButton isRight={false} />)} */
                        /* ⬅️ Prev Button */
                        {/* {page > 0 && (
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "1rem",
                                    transform: "translateY(-50%)",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    "&:hover": { background: "rgba(0,0,0,0.8)" },
                                    zIndex: 5,
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>
                        )} */}

                        {/* <Box className="scroll-container"
                            onScroll={handleScroll}
                            sx={{
                                // display: 'flex',
                                // flexDirection: 'row',
                                // padding: { xs: '3.2rem 6rem 12.5rem' },
                                // overflowX: 'auto',
                                // overflowY: 'hidden',
                                // marginTop: '-3rem',
                                // marginLeft: '-3rem',
                                // "&::-webkit-scrollbar": {
                                //     display: 'none',
                                // },

                               
                            }}
                        >
                            {media?.filter((item) => item.poster_path).map((item, index) => (
                                <Cards key={index} item={item} enableGenres={false} />

                            ))}
                        </Box> */}

                        /* ➡️ Next Button */
                        {/* {page < totalPages - 1 && (
                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "1rem",
                                    transform: "translateY(-50%)",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    "&:hover": { background: "rgba(0,0,0,0.8)" },
                                    zIndex: 5,
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        )} */}

                        {/* trial 2 */}
                        <Box
                            className="scroll-container"
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "1.5rem",
                                overflowX: "auto",
                                overflowY: "hidden",
                                scrollBehavior: "smooth",
                                padding: "0 2rem",
                                "&::-webkit-scrollbar": { display: "none" },
                            }}
                        >
                            {media?.filter((item) => item.poster_path).map((item, index) => (
                                <Cards key={index} item={item} enableGenres={false} />
                            ))}
                        </Box>

                        {/* Buttons */}
                        {isScrolled && <SliderButton isRight={false} onClick={scrollLeft} />}
                        <SliderButton isRight={true} onClick={scrollRight} />


                    </Box>
                </>
            )}
        </Box>
    );
}

export default MovieSections;