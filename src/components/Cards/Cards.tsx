import { CardProps, Genre, MediaItem, Video } from '@/types';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player';
import Button from '../Button/Button';
import RenderGenre from '../RenderGenre/RenderGenre';
import Image from 'next/image';
import handleAddToLocalStorage, { handleRemoveFromLocalStorage, isItemInLocalStorage } from '@/utils/localStorage';
import { getMovie } from '@/utils/apiService';
import { Mute, Unmute, Add, Down, Like, Play, Tick } from '@/utils/icons';
import image from 'next/image';
import ModalComponent from '../ModalComponent/ModalComponent';

const Cards: React.FC<CardProps> = ({ item, enableGenres, removeMovie }) => {
    const [genres, setGenres] = React.useState<Genre[]>([]);
    const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [isInLocalStorage, setIsInLocalStorage] = React.useState<boolean>(false);
    const [isMuted, setIsMuted] = React.useState<boolean>(true);

    const router = useRouter();
    const { genre_ids,id, poster_path, title, vote_average } = item;
    const image = `https://image.tmdb.org/t/p/w500${poster_path}`;
    useEffect(() => {
        setIsInLocalStorage(
            isItemInLocalStorage(item.id, item.title)
        );
        if (enableGenres) {
            setGenres(item.genres || []);
        }
    }, [item, enableGenres]);

    const fetchTrailer = async () => {
        try {
            const res = await getMovie(`/movie/${item.id}/videos`);
            if (!res.error) {
                console.log("Fetched videos:", res.data?.results);
                const trailer = (res.data?.results as Video[]).find(
                    (video: Video) => video.type === "Trailer" && video.site === "YouTube"
                );
                console.log("Chosen trailer key:", trailer?.key);
                setTrailerKey(trailer?.key || null);
            }
        } catch (error) {
            console.error("Trailer fetch error:", error);
        }
    };


    useEffect(() => {
        if (isHovered && !trailerKey) {
            fetchTrailer();
        }
    }, [isHovered, trailerKey]);


    const handleFavoriteToggle = () => {
        const mediaItem: MediaItem = {
            id,
            title,
            type: item.type as any, // Assume type is already correct, or adjust as needed
        };

        if (isInLocalStorage) {
            handleRemoveFromLocalStorage(mediaItem);
            setIsInLocalStorage(false);
            removeMovie?.(mediaItem.id);
        } else {
            handleAddToLocalStorage(mediaItem);
            setIsInLocalStorage(true);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    const handlePlayClick = () => {
        router.push(`/watch/${id}`);
    };

    const handleClose = () => {
    setModalOpen(false);
  };


    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                display: 'flex',
                width: '14rem',
                flexDirection: 'column',
                cursor: 'pointer',
                flexShrink: 0,
                height: '9rem',
                borderRadius: '.28rem',
                marginRight: '3rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#252525',
                zIndex: isHovered ? 10 : 1,
                "&:hover": {
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                    transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                }
            }}
        >



            {isHovered && trailerKey ? (

                <Box sx={{ position: 'relative', width: '100%', height: '100%', zIndex: 9999 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>


                </Box>
            )

                : (
                    poster_path ? (
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                            alt={title}
                            width={450}
                            height={350}
                            style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '.28rem', objectPosition: 'top' }}
                        />
                       
                    ) : null
                )}
            <Box sx={{
                display: isHovered ? 'flex' : 'none',
                flexDirection: 'column',
                backgroundColor: '#252525',
                borderRadius: '0 0 0.28rem 0.28rem',
                padding: '0.5rem',
                fontSize: 'inherit',
                position: 'relative'
            }}>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "15%",
                        inset: 0,
                        backgroundImage: "linear-gradient(to top, black, transparent)"
                    }} />
                <Typography component="strong"
                    sx={{
                        fontWeight: "bold",
                        color: "white",
                        fontSize: "14px",
                        mt: 1,
                        position: "absolute",
                        bottom: "15%",
                    }}>{title}</Typography>
                <Box sx={{
                    display: "flex",
                }}>
                    <Button
                        Icon={Play}
                        rounded onClick={handlePlayClick}

                    />
                    <Button
                        Icon={isInLocalStorage ? Tick : Add}
                        rounded
                        onClick={handleFavoriteToggle}
                    />
                    <Button
                        Icon={Like}
                        rounded />
                </Box>

                <Button
                    Icon={Down}
                    rounded
                    onClick={handlePlayClick}

                />

            </Box>

            <Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: .5 }}>
                    <Typography
                        sx={{
                            color: "success.main",
                            fontWeight: "bold",
                            fontSize: ".8rem",
                        }}>
                        {`%${Math.round(vote_average * 100)}`}
                    </Typography>
                </Box>


                <Box sx={{ display: "flex", flexDirection: 'row', pb: 2 }}>
                    <Typography>Genres:</Typography>
                    {enableGenres ? (
                    <Typography>
                        {genres.slice(0, 5).map((genre, index) => (
                            <span key={genre.id}>
                                {genre.name}
                                {index < Math.min(genres.length, 5) - 1 && <span>&bull;</span>}
                            </span>
                        ))}
                    </Typography>
                    ) : (
                        <RenderGenre genreIds={[genre_ids]} />
                    )
                    }
                </Box>
            </Box>
            <ModalComponent
            modalOpen={modalOpen}
            handleClose={handleClose}
            modal={item}
            enableGenres={enableGenres  ?? false}
             />
        </Box>
    );
}

export default Cards;

// function fetchTrailer() {
//     throw new Error('Function not implemented.');
// }
