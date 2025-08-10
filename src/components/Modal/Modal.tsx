import {Box, Modal, Typography, } from '@mui/material'
import React, { useEffect ,useState} from 'react'
import { getMovie } from '@/utils/apiService';
import ReactPlayer from 'react-player';
import handleAddToLocalStorage,{  handleRemoveFromLocalStorage, isItemInLocalStorage } from '@/utils/localStorage';
import { MediaItem , Video, ModalProps} from '@/types';
import { Image } from '@mui/icons-material';
import {Add, Adult, Dislike, HD, Like, Mute, Play, Search, Unmute, Close} from '@/utils/icons';
import { Button } from '../Button/Button';
import {Link } from 'next/link';
import RenderGenre from '../RenderGenre/RenderGenre';
import { GenreLibrary } from '@/utils/genre_id';

const ModalComponent: React.FC<ModalProps> = ({
    modalOpen,
    modelData,
    enableGenres,
    handleClose
}): React.ReactElement => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isMuted, setIsMuted] = React.useState<boolean>(true);
    const [trailerUrl, setTrailerUrl] = React.useState<string | null>(null);
    const [isInLocalStorage, setIsInLocalStorage] = React.useState<boolean>(false);

    const {
        backdrop_path,
        genres,
        id,
        original_title,
        overview,
        poster_path,
        release_date,
        runtime,
        title,
        vote_average,
    } = modelData || {};

    const banner = `https://image.tmdb.org/t/p/original${backdrop_path}`;

    const handleAddOrRemove = () => {
        const mediaType = title ? "movie" : "tv";
        const mediaItem: MediaItem = {
            id,
            title,
            type: mediaType,
        };

        if (isInLocalStorage) {
            handleRemoveFromLocalStorage(mediaItem);
        } else {
            handleAddToLocalStorage(mediaItem);
        }
        setIsInLocalStorage(!isInLocalStorage);
    };

    const fetchTrailer = async () => {
      const res = await getMovie(`/movie/${id}/videos`);  
      const trailer = (res.data?.results as Video[])?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      )

      setTrailerUrl(trailer? `https://www.youtube.com/watch?v=${trailer.key}?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}` : null);
      setLoading(false);
    }

    const toggleMute = () => {
      setIsMuted(!isMuted);
    }

    useEffect(() => {
        fetchTrailer();
    }, [id]);

    return (
        <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{marginTop: "2rem",
            overflow: "auto",
        }}
        >
            <Box
            sx={{
                position: "absolute",
                top: {xs: "40%", md: "50%"},
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: {xs: "90%", md: "75%", lg:"60%"},
                backgroundColor: "#141414",
                boxShadow: 24,
                height: "65vh",
                borderRadius: "1",
                outline: "none",
            }}>
                <Box onClick={handleClose}
                sx={{position: "absolute",
                 top: "8px",
                  right: "8px",
                  cursor: "pointer",
                  color: "#ffffff",
                  zIndex: 1,
                  }}>
                    <Close fontSize="30px" />
                </Box>
                <Box
                sx={{position: "relative",
                    
                }}>
                    {trailerUrl ? <ReactPlayer 
                    url={trailerUrl}
                    muted={isMute}
                    playing
                    loop
                    width="100%"
                    height="400px"
                    style={{
                        borderRadius: "8px 8px 0 0"
                    }}/> : <Image 
                    width={600}
                    height={400}
                    src={banner}
                    alt="spotlight"
                    style={{ objectFit: "cover", width: "100%", height: "100%", }}/>}
                    <Box
                    sx={{
                        p: 6,
                        display: "flex",
                        position: "absolute",
                        alignItems: "baseline",
                        bottom: 0,
                    }}>
                        <Box
                        sx={{display: "flex",
                            gap: {md:2},
                            alignItems: "baseline",
                        }}>
                            <Link
                            style={{
                                textDecoration: "none",

                            }}
                            href={`/movie/${id}`}
                            >
                                <Button label="Play" filled Icon={Play} />
                            </Link>
                            <Button Icon={isInLocalStorage ? Tick : Add} rounded onClick={handleAddOrRemove}/>
                            <Button Icon={Like} rounded/>
                            <Button Icon={Dislike} rounded />
                        </Box>
                        <Box
                        sx={{positon: "absolute", 
                            right: 0,
                            bottom: 0,
                            p: {xs: 2, md: 6},
                        }}>
                            <Button 
                            Icon={isMuted ? Mute : Unmute}
                            rounded
                            onClick={toggleMute}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                }}>
                    <Box sx={{
                        display: {xs: "block", md: "flex"},
                        alignItems: "baseline",
                        gap: {xs: "2px", md: "10px"},
                    }}>
                        <Box>
                            <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "success.main",
                                mt: 1,
                            }}>{Math.round(vote_average * 10)}% Match</Typography>
                            <Typography
                            sx={{
                                fontSize: "15px",
                                color: "#e5e5e5",
                            }}>{release_date}</Typography>
                              {adult && <Button Icon={Adult} rounded/>}
                            <Typography
                            sx={{
                                border: "2px solid #e5e5e5",
                                color: "#e5e5e5",
                            }}>12+</Typography>
                            <Typography>120m</Typography>
                            <HD />
                        </Box>
                        <Box>
                            <Typography>Genres:</Typography>
                            {enableGenres ? (
                                <Typography>{genres?.slice(0, 5).map(({name}, index)=>(
                                    <span key={index}>
                                        {name}
                                        {index < genres.length - 1 && <span> &bull;</span>}
                                    </span>
                                )
                            )}</Typography>
                            ):(
                                <RenderGenre genreIds={genre_ids} />
                            )}
                        </Box>
                    </Box>

                    <Typography>{overview}</Typography>
                    <Typography>more movies like this</Typography>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalComponent