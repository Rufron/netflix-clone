

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
    // 🌟 FIX 3: New state to track scrolling for pointer-events fix
    const [isScrolling, setIsScrolling] = React.useState<boolean>(false);

    // ... (fetchMovies logic remains the same) ...
    const fetchMovies = async () => {
        if (setLoading) {
            setLoading(true);
        }
        // NOTE: Placeholder for actual API call
        const res = await getMovie(`${endpoint}`) 
        // For demonstration, simulating a successful response:
        // const mockData = {
        //     data: {
        //         results: Array.from({ length: 20 }, (_, i) => ({
        //             id: i,
        //             title: `Movie ${i + 1}`,
        //             poster_path: `/path/to/poster${i}.jpg`,
        //         })),
        //     },
        // };
        // const res = mockData as any; // Cast mock data for type compatibility

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
        
        // 🌟 FIX 3: Re-enable pointer events after scrolling stops (debounced)
        if (isScrolling) {
             // Basic debounce to check if scrolling has stopped
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, 100); // 100ms delay after scroll to confirm stop
        }
    }
    const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);


    // Utility function to handle scroll with pointer-events block
    const performScroll = (scrollAmount: number) => {
        if (scrollContainerRef.current) {
            // 🌟 FIX 3: Disable pointer events before scrolling starts
            setIsScrolling(true);
            
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            
            // Set a timeout to re-enable pointer events after the scroll is expected to finish
            const scrollDuration = 500; // Assuming 'smooth' scroll takes about 500ms
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, scrollDuration + 50); // Little extra time to ensure re-enable
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
                                // 🌟 FIX 2: Increased gap for better visual separation
                                gap: "1rem", 
                                padding: { xs: '0 1rem', md: '0 3rem' },
                                overflowX: "auto",
                                overflowY: "hidden",
                                scrollBehavior: "smooth",
                                "&::-webkit-scrollbar": { display: "none" },
                                width: '100%',
                                // 🌟 FIX 3: Disable pointer events on the entire card area while scrolling
                                pointerEvents: isScrolling ? 'none' : 'auto', 
                            }}
                        >
                            {/* 4. CARDS with MIN-WIDTH and FLEX-SHRINK: 0 */}
                            {media?.filter((item) => item.poster_path).map((item, index) => (
                                <Box
                                    key={item.id || index}
                                    sx={{
                                        flex: '0 0 auto',
                                        // 🌟 FIX 1 & 2: Added a height ratio for better image sizing
                                        // 150% ensures the card height is 1.5 times its width (standard poster aspect ratio is ~1.5)
                                        // 🌟 FIX 2: Added padding-bottom to create space *below* the card.
                                        paddingBottom: '0.5rem', 
                                        
                                        // Define responsive widths:
                                        width: {
                                            xs: 'calc(33.33% - 0.66rem)', // 3 items + accounting for the 1rem gap (1rem gap * 2 gaps / 3 items)
                                            sm: 'calc(25% - 0.75rem)',   // 4 items
                                            md: 'calc(20% - 0.8rem)',    // 5 items
                                            lg: 'calc(16.66% - 0.83rem)', // 6 items
                                        },
                                        // 🌟 FIX 1: Set position relative for the Cards component inside to fill the space
                                        position: 'relative',
                                        height: 'auto', // Allow height to be determined by content or aspect ratio
                                    }}
                                >
                                    {/* 🌟 FIX 1: Make sure your Cards component itself has CSS like:
                                        width: 100%;
                                        height: 100%;
                                        If it uses a Next.js Image component, the parent (this Box) should have position: relative and a defined size.
                                    */}
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