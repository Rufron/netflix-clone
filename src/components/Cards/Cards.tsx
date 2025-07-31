import { CardProps, Genre, MediaItem, Video } from '@/types';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player';
import Button from '../Button/Button';
import Image from 'next/image';
import handleAddToLocalStorage, { handleRemoveFromLocalStorage, isItemInLocalStorage } from '@/utils/localStorage';
import { getMovie } from '@/utils/apiService';

const Cards: React.FC<CardProps> = ({ item, enableGenres, removeMovie }) => {
    const [genres, setGenres] = React.useState<Genre[]>([]);
    const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [isInLocalStorage, setIsInLocalStorage] = React.useState<boolean>(false);

    const router = useRouter();
    const { id, poster_path, title, vote_average } = item;

    useEffect(() => {
        setIsMounted(true);
        setIsInLocalStorage(
            isItemInLocalStorage(item.id, item.title)
        );
        if (enableGenres) {
            setGenres(item.genre || []);
        }
    }, [item, enableGenres]);

    const fetchTrailer = async () => {
        try {
            const res = await getMovie(`/movie/${item.id}/videos`);
            if (!res.error) {
                const trailer = (res.data?.results as unknown[] as Video[]).find(
                    (video: Video) => video.type === item.type
                );
                setTrailerKey(trailer?.key || null);
            }
        } catch (error) {
            console.error("Trailer fetch error:", error);
        }
    };

    useEffect(() => {
        if (isHovered) {
            fetchTrailer();
        }
    }, [isHovered]);

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

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{ position: 'relative', width: 300 }}
        >
            {isHovered && trailerKey ? (
                <Box>
                    <ReactPlayer
                        url={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : undefined}
                        playing
                        muted
                        width="100%"
                        height="100%"
                    />
                    <Box>
                        <Button />
                    </Box>
                </Box>
            ) : (
                poster_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                        alt={title}
                        width={300}
                        height={450}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                ) : null
            )}
            <Box>
                <Typography>{title}</Typography>
                <Box>
                    <Button />
                    <Button />
                    <Button />
                </Box>
                <Typography>
                    {genres.slice(0, 5).map((genre, index) => (
                        <span key={genre.id}>
                            {genre.name}
                            {index < Math.min(genres.length, 5) - 1 && <span>&bull;</span>}
                        </span>
                    ))}
                </Typography>
            </Box>
        </Box>
    );
}

export default Cards;

// function fetchTrailer() {
//     throw new Error('Function not implemented.');
// }
