import { CardProps, Genre } from '@/types';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player';
import Button from '../Button/Button';
import Image from 'next/image';
import { isItemInLocalStorage } from '@/utils/localStorage';

const Cards: React.FC<CardProps> = ({ item, enableGenres, removeMovie }) => {
    const [genres, setGenres] = React.useState<Genre[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [trailerKey, setTrailerKey] = React.useState<string | null>(null);

    const [isMute, setIsMute] = React.useState<boolean>(true);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [isInLocalStorage, setIsInLocalStorage] = React.useState<boolean>(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const router = useRouter();
    const { id, poster_path, title, vote_average, genre_ids, backdrop_path} = item;
   
    useEffect(() => {
        setIsMounted(true);
        setIsInLocalStorage(
           isItemInLocalStorage(id, item.title)    
        );
        if (enableGenres) {
            setGenres(item.genres || []);
        }
    }, [item, enableGenres]);

    const handlePlayClick = () => {
        if (item?.id && isMounted) {
            router.push(`/movie/${item.id}`);
        }

    // const fileURLToPath = (path: string) => {
    //     return `https://image.tmdb.org/t/p/w500${path}`;
    // };

    return (
        <Box>
            {isHovered && trailerKey ? (
                <Box>
                    <ReactPlayer />
                    <Box>
                        <Button />
                    </Box>
                </Box>
            ) : (
                
                    <Image/>
                
            )}

            <Box>
                <Box>
                    <Typography>{title}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Cards;