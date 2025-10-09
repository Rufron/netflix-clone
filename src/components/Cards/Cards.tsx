// import { CardProps,Media, Genre, MediaItem, Video } from '@/types';
// import { Box, Typography } from '@mui/material';
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import ReactPlayer from 'react-player';
// import Button from '../Button/Button';
// import RenderGenre from '../RenderGenre/RenderGenre';
// import Image from 'next/image';
// import handleAddToLocalStorage, { handleRemoveFromLocalStorage, isItemInLocalStorage } from '@/utils/localStorage';
// import { getMovie } from '@/utils/apiService';
// import { Mute, Unmute, Add, Down, Like, Play, Tick } from '@/utils/icons';
// import image from 'next/image';
// import ModalComponent from '../Modal/Modal';

// const Cards: React.FC<CardProps> = ({ item, enableGenres, removeMovie }) => {
//     const [genres, setGenres] = React.useState<Genre[]>([]);
//     const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
//     const [isHovered, setIsHovered] = React.useState<boolean>(false);
//     const [modalOpen, setModalOpen] = React.useState<boolean>(false);
//     const [isInLocalStorage, setIsInLocalStorage] = React.useState<boolean>(false);
//     const [isMuted, setIsMuted] = React.useState<boolean>(true);

//     const router = useRouter();
//     const {id, poster_path, title, vote_average, genre_ids} = item;
//     // const genre_ids = Array.isArray(item.genre_ids) ? item.genre_ids : [];


//     const image = `https://image.tmdb.org/t/p/w500${poster_path}`;
//     useEffect(() => {
//         setIsInLocalStorage(
//             isItemInLocalStorage(item.id, item.title)
//         );
//         if (enableGenres) {
//             setGenres(item.genres || []);
//         }
//     }, [item, enableGenres]);

//     const fetchTrailer = async () => {
//         try {
//             const res = await getMovie(`/movie/${item.id}/videos`);
//             if (!res.error) {
//                 console.log("Fetched videos:", res.data?.results);
//                 const trailer = (res.data?.results as Video[]).find(
//                     (video: Video) => video.type === "Trailer" && video.site === "YouTube"
//                 );
//                 console.log("Chosen trailer key:", trailer?.key);
//                 setTrailerKey(trailer?.key || null);
//             }
//         } catch (error) {
//             console.error("Trailer fetch error:", error);
//         }
//     };


//     useEffect(() => {
//         if (isHovered && !trailerKey) {
//             fetchTrailer();
//         }
//     }, [isHovered, trailerKey]);


//     const handleFavoriteToggle = () => {
//         const mediaItem: MediaItem = {
//             id,
//             title,
//             type: item.type as any, // Assume type is already correct, or adjust as needed
//         };

//         if (isInLocalStorage) {
//             handleRemoveFromLocalStorage(mediaItem);
//             setIsInLocalStorage(false);
//             removeMovie?.(mediaItem.id);
//         } else {
//             handleAddToLocalStorage(mediaItem);
//             setIsInLocalStorage(true);
//         }
//     };

//     const toggleMute = () => {
//         setIsMuted((prev) => !prev);
//     };

//     const handlePlayClick = () => {
//         router.push(`/watch/${id}`);
//     };

//     const handleClose = () => {
//     setModalOpen(false);
//   };


//     return (
//         <Box
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//             sx={{
//                 display: 'flex',
//                 width: '14rem',
//                 flexDirection: 'column',
//                 cursor: 'pointer',
//                 flexShrink: 0,
//                 height: '9rem',
//                 borderRadius: '.28rem',
//                 marginRight: '3rem',
//                 transition: 'all 0.3s ease',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 backgroundColor: '#252525',
//                 zIndex: isHovered ? 10 : 1,
//                 "&:hover": {
//                     boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
//                     transform: isHovered ? 'scale(1.25)' : 'scale(1)',
//                     transition: 'transform 0.3s ease'
//                 }
//             }}
//         >



//             {isHovered && trailerKey ? (

//                 <Box sx={{ position: 'relative', width: '100%', height: '100%', zIndex: 9999 }}>
//                     <iframe
//                         width="100%"
//                         height="100%"
//                         src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
//                         title="YouTube video player"
//                         frameBorder="0"
//                         allow="autoplay; encrypted-media"
//                         allowFullScreen
//                     ></iframe>


//                 </Box>
//             )

//                 : (
//                     poster_path ? (
//                         <Image
//                             src={`https://image.tmdb.org/t/p/w500${poster_path}`}
//                             alt={title}
//                             width={450}
//                             height={350}
//                             style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '.28rem', objectPosition: 'top' }}
//                         />

//                     ) : null
//                 )}
//             <Box sx={{
//                 display: isHovered ? 'flex' : 'none',
//                 flexDirection: 'column',
//                 backgroundColor: '#252525',
//                 borderRadius: '0 0 0.28rem 0.28rem',
//                 padding: '0.5rem',
//                 fontSize: 'inherit',
//                 position: 'relative'
//             }}>
//                 <Box
//                     sx={{
//                         position: "absolute",
//                         bottom: "15%",
//                         inset: 0,
//                         backgroundImage: "linear-gradient(to top, black, transparent)"
//                     }} />
//                 <Typography component="strong"
//                     sx={{
//                         fontWeight: "bold",
//                         color: "white",
//                         fontSize: "14px",
//                         mt: 1,
//                         position: "absolute",
//                         bottom: "15%",
//                     }}>{title}</Typography>
//                 <Box sx={{
//                     display: "flex",
//                 }}>
//                     <Button
//                         Icon={Play}
//                         rounded onClick={handlePlayClick}

//                     />
//                     <Button
//                         Icon={isInLocalStorage ? Tick : Add}
//                         rounded
//                         onClick={handleFavoriteToggle}
//                     />
//                     <Button
//                         Icon={Like}
//                         rounded />
//                 </Box>

//                 <Button
//                     Icon={Down}
//                     rounded
//                     onClick={handlePlayClick}

//                 />

//             </Box>

//             <Box>
//                 <Box sx={{ display: "flex", alignItems: "center", mt: .5 }}>
//                     <Typography
//                         sx={{
//                             color: "success.main",
//                             fontWeight: "bold",
//                             fontSize: ".8rem",
//                         }}>
//                         {`%${Math.round(vote_average * 100)}`}
//                     </Typography>
//                 </Box>


//                 <Box sx={{ display: "flex", flexDirection: 'row', pb: 2 }}>
//                     <Typography>Genres:</Typography>
//                     {enableGenres ? (
//                     <Typography>
//                         {genres.slice(0, 5).map((genre, index) => (
//                             <span key={genre.id}>
//                                 {genre.name}
//                                 {index < Math.min(genres.length, 5) - 1 && <span>&bull;</span>}
//                             </span>
//                         ))}
//                     </Typography>
//                     ) : (
//                         <RenderGenre genreIds={genre_ids || []} />
//                     )
//                     }
//                 </Box>
//             </Box>
//             <ModalComponent
//             modalOpen={modalOpen}
//             handleClose={handleClose}
//             modal={item}
//             enableGenres={enableGenres  ?? false}
//              />
//         </Box>
//     );
// }

// export default Cards;

// // function fetchTrailer() {
// //     throw new Error('Function not implemented.');
// // }



// tral 2
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Add,
  Like,
  Play,
  Tick,
  Mute,
  Unmute,
} from "@/utils/icons";
import Button from "../Button/Button";
import handleAddToLocalStorage, {
  handleRemoveFromLocalStorage, 
  isItemInLocalStorage,
} from "@/utils/localStorage";
import { getMovie } from "@/utils/apiService";
import { CardProps, Genre, Video, MediaItem} from "@/types";
import RenderGenre from '../RenderGenre/RenderGenre';
import ModalComponent from '../Modal/Modal';





const Cards: React.FC<CardProps> = ({ item, enableGenres }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isInLocalStorage, setIsInLocalStorage] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<boolean>(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState<boolean>(false);

  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id, title, poster_path } = item;

  useEffect(() => {
    setIsInLocalStorage(isItemInLocalStorage(item.id, item.title));
    if (enableGenres) setGenres(item.genres || []);
  }, [item, enableGenres]);

  // ✅ Fetch trailer (Vimeo preferred, then YouTube)
  const fetchTrailer = async () => {
    try {
      setIsLoadingTrailer(true);
      setPlayerError(false);
      const res = await getMovie(`/movie/${item.id}/videos`);
      const videos = (res.data?.results as Video[]) || [];

      const vimeoTrailer = videos.find(
        (v) => v.site === "Vimeo" && v.type === "Trailer"
      );
      if (vimeoTrailer) {
        setTrailerUrl(`https://vimeo.com/${vimeoTrailer.key}`);
        return;
      }

      const ytTrailer = videos.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (ytTrailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${ytTrailer.key}`);
        return;
      }

      // fallback demo video
      setTrailerUrl("https://www.w3schools.com/html/mov_bbb.mp4");
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerUrl("https://www.w3schools.com/html/mov_bbb.mp4");
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  useEffect(() => {
    if (isHovered && !trailerUrl && !isLoadingTrailer) {
      fetchTrailer();
    }
  }, [isHovered, trailerUrl, isLoadingTrailer]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handlePlayClick = () => router.push(`/watch/${id}`);

  // ✅ Helper: build iframe URL for YouTube/Vimeo
  const buildEmbedUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes("vimeo.com")) {
      const key = url.split("/").pop();
      return `https://player.vimeo.com/video/${key}?autoplay=1&muted=${isMuted ? 1 : 0}`;
    } else if (url.includes("youtube.com")) {
      const key = url.split("v=")[1];
      return `https://www.youtube.com/embed/${key}?autoplay=1&mute=${isMuted ? 1 : 0
        }&controls=0`;
    }
    return null;
  };

  // ✅ Helper: check if trailer is mp4 or external link
  const isVideoFile = (url: string | null) =>
    url?.endsWith(".mp4") || url?.includes("mov_bbb");

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          xs: "90%",   // 📱 small screens
          sm: "22rem", // 💻 medium screens
          md: "26rem", // 🖥️ large screens
        },
        height: {
          xs: "15rem",
          sm: "18rem",
          md: "20rem",
        },
        backgroundColor: "#252525",
        borderRadius: "1rem",
        position: "relative",
        margin: "1.5rem",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.6)",
          zIndex: 10,
        },
      }}
    >
      {/* 🎬 Trailer / Poster logic */}
      {isHovered && trailerUrl ? (
        isVideoFile(trailerUrl) ? (
          // ✅ Native HTML5 video
          <video
            ref={videoRef}
            src={trailerUrl}
            autoPlay
            muted={isMuted}
            playsInline
            loop
            onError={() => setPlayerError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: ".28rem",
              position: "absolute",
              inset: 0,
            }}
          />
        ) : (
          // ✅ YouTube/Vimeo iframe fallback
          <iframe
            src={buildEmbedUrl(trailerUrl) ?? ""}
            allow="autoplay; fullscreen; encrypted-media"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: ".28rem",
            }}
          />
        )
      ) : (
        // ✅ Default Poster Image
        <Image
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          width={450}
          height={350}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: ".28rem",
          }}
        />
      )}

      {/* 🎚️ Mute Button */}
      {isHovered && trailerUrl && (
        <IconButton
          onClick={toggleMute}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            color: "#fff",
            background: "rgba(0,0,0,0.45)",
            "&:hover": { background: "rgba(0,0,0,0.65)" },
            zIndex: 20,
          }}
          size="small"
        >
          {isMuted ? <Mute /> : <Unmute />}
        </IconButton>
      )}

      {/* 🎛️ Overlay Controls */}
      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            padding: "0.5rem",
            zIndex: 10,
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: "0.5rem", mt: 0.5 }}>
            <Button Icon={Play} rounded onClick={handlePlayClick} />
            <Button Icon={isInLocalStorage ? Tick : Add} rounded />
            <Button Icon={Like} rounded />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Cards;

