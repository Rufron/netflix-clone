// gemini version.
import { Box, Typography, IconButton } from "@mui/material";
import React from "react";
// Assuming Image, getMovie, SliderButton, Cards are defined elsewhere
import Image from "next/image"; // Not used in the final JSX
import { getMovie } from "@/utils/apiService"; // Not defined, using placeholder
import Cards from "../Cards/Cards"; // Placeholder component
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// --- Minimal SliderButton placeholder (kept for reference) ---
const SliderButton = ({ isRight, onClick }: { isRight: boolean, onClick: () => void }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            [isRight ? "right" : "left"]: "1rem",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { background: "rgba(0,0,0,0.8)" },
            zIndex: 5,
            opacity: { xs: 0, sm: 1 },
            transition: 'opacity 300ms'
        }}
    >
        {isRight ? <ChevronRight /> : <ChevronLeft />}
    </IconButton>
);
// -----------------------------------------------------------

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
    const [isScrolling, setIsScrolling] = React.useState<boolean>(false);

    // ... (fetchMovies logic remains the same, keeping your original code) ...
    const fetchMovies = async () => {
        if (setLoading) {
            setLoading(true);
        }
        // NOTE: Placeholder for actual API call
        // Assuming getMovie is defined and works
        const res = await getMovie(`${endpoint}`) 
        
        // Placeholder data to prevent crash if getMovie isn't defined
        // const res = { data: { results: [{ id: 1, poster_path: 'a' }, { id: 2, poster_path: 'b' }, { id: 3, poster_path: 'c' }, { id: 4, poster_path: 'd' }, { id: 5, poster_path: 'e' }, { id: 6, poster_path: 'f' }, { id: 7, poster_path: 'g' }, { id: 8, poster_path: 'h' },] } };
        // ------------------
       
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


    const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
        setIsScrolled(scrollLeft > 50);
        
        if (isScrolling) {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, 100);
        }
    }
    const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);


    const performScroll = (scrollAmount: number) => {
        if (scrollContainerRef.current) {
            setIsScrolling(true);
            
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            
            const scrollDuration = 500;
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, scrollDuration + 50);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            performScroll(-scrollContainerRef.current.clientWidth * 0.8);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            performScroll(scrollContainerRef.current.clientWidth * 0.8);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: { xs: '0 0 1rem', md: '0 0 2rem' },
                color: 'white',
            }}>
            {error && <Typography variant="h6" color="error">{error}</Typography>}
            {!loading && !error && (
                <>
                    {/* 1. SECTION HEADING */}
                    <Typography
                        component="h2"
                        variant="h5"
                        sx={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            marginLeft: { xs: '1rem', md: '3rem' },
                            transition: 'color 0.2s',
                            '&:hover': { color: 'grey.300' },
                            cursor: 'pointer',
                        }}>
                        {heading}
                    </Typography>

                    {/* 2. SCROLLABLE CONTAINER PARENT */}
                    <Box
                        className="scroll-container-parent"
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}>

                        {/* 3. SCROLLABLE POSTER AREA */}
                        <Box
                            className="scroll-container"
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                // FIX: Use a slightly larger gap to ensure space, and confirm the width calculation works with it.
                                // gap: "1.5rem", 
                                gap: "0.75rem",
                                padding: { xs: '0 1rem', md: '0 3rem' },
                                overflowX: "auto",
                                overflowY: "hidden",
                                scrollBehavior: "smooth",
                                "&::-webkit-scrollbar": { display: "none" },
                                width: '100%',
                                pointerEvents: isScrolling ? 'none' : 'auto', 
                            }}
                        >
                            {/* 4. CARDS with MIN-WIDTH and FLEX-SHRINK: 0 */}
                            {media?.filter((item) => item.poster_path).map((item, index) => (
                                <Box
                                    key={item.id || index}
                                    sx={{
                                        // **FIX 1: Use flex-shrink: 0 and flex-basis: auto to ensure the width property is respected.**
                                        flex: '0 0 auto', 
                                        
                                        // **FIX 2: Corrected width calculations to strictly divide the space for the new 1.5rem gap**
                                        // N items, G gap: (100% - (N-1) * G) / N
                                        width: {
                                            // N=3, G=1.5rem: (100% - 3rem) / 3 
                                            xs: 'calc((100% - 3rem) / 3)', 
                                            // N=4, G=1.5rem: (100% - 4.5rem) / 4 
                                            sm: 'calc((100% - 4.5rem) / 4)',   
                                            // N=5, G=1.5rem: (100% - 6rem) / 5 
                                            md: 'calc((100% - 6rem) / 5)',    
                                            // N=6, G=1.5rem: (100% - 7.5rem) / 6 
                                            lg: 'calc((100% - 7.5rem) / 6)', 
                                        },
                                        
                                        // **FIX 3: Explicitly define height relative to the calculated width to prevent collapse/overlap.**
                                        // Standard poster aspect ratio is ~1:1.5 (width:height). Height = Width * 1.5.
                                        // We use the 'auto' height on the wrapping Box, but will rely on the content's size if it's an image.
                                        // For a safer solution without relying on the internal Cards component:
                                        aspectRatio: '1 / 1.5',
                                        position: 'relative', // Ensure Cards can be positioned absolutely inside if needed
                                        
                                        // Original padding-bottom for vertical spacing below the row:
                                        paddingBottom: '0.5rem', 
                                        
                                        // Optional: Add a subtle margin-right to test spacing if gap isn't working perfectly
                                        // marginRight: { xs: '1.5rem' }, // Only if gap fails
                                    }}
                                >
                                    {/* Make sure your Cards component fills this container! */}
                                    <Cards item={item} enableGenres={false} />
                                </Box>
                            ))}
                        </Box>

                        {/* 5. SLIDER BUTTONS */}
                        {isScrolled && <SliderButton isRight={false} onClick={scrollLeft} />}
                        {media.length > 0 && <SliderButton isRight={true} onClick={scrollRight} />} 
                    </Box>
                </>
            )}
        </Box>
    );
}

export default MovieSections;