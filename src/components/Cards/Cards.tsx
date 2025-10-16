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
        width: "100%",
        height: "100%",
        backgroundColor: "#252525",
        borderRadius: "1rem",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.15)",
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

