

// 3 
"use client";

import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, CircularProgress, Button as MuiButton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getMovie } from "@/utils/apiService";
import { Play, Mute, Unmute } from "@/utils/icons";
import InfoIcon from "@mui/icons-material/Info";

const Banner: React.FC = () => {
  const [media, setMedia] = useState<any | null>(null);
  const [trailer, setTrailer] = useState<{ site: string; key: string } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await getMovie("/trending/all/day?language=en-US&page=1");
      const results = res?.data?.results ?? [];
      if (!results.length) {
        setLoading(false);
        return;
      }

      const random = results[Math.floor(Math.random() * results.length)];
      setMedia(random);

      const type = random.media_type === "tv" ? "tv" : "movie";
      const trailerRes = await getMovie(`/${type}/${random.id}/videos?language=en-US`);
      const videos = trailerRes?.data?.results ?? [];

      // Prefer Vimeo
      const vimeoTrailer = videos.find((v: any) => v.site === "Vimeo" && v.type === "Trailer");
      if (vimeoTrailer) {
        setTrailer({ site: "Vimeo", key: vimeoTrailer.key });
        return;
      }

      // Fallback to YouTube
      const ytTrailer = videos.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
      if (ytTrailer) {
        setTrailer({ site: "YouTube", key: ytTrailer.key });
      }
    } catch (err) {
      console.error("Banner loadMedia error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (media?.id) {
      router.push(`/movie/${media.id}`);
    }
  };

  const toggleMute = () => {
    setIsMuted((p) => !p);
  };

  const backdropPath = media?.backdrop_path || media?.poster_path || null;
  const imageUrl = backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : null;

  // Build iframe URL depending on site
  let trailerUrl: string | null = null;
  if (trailer) {
    if (trailer.site === "Vimeo") {
      trailerUrl = `https://player.vimeo.com/video/${trailer.key}?autoplay=1&muted=${isMuted ? 1 : 0}&title=0&byline=0&portrait=0`;
    } else if (trailer.site === "YouTube") {
      trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&rel=0`;
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: { xs: "55vh", md: "75vh" }, backgroundColor: "#000"}}>
      {/* Background fallback */}
      {imageUrl && (
        <Box sx={{ position: "absolute", inset: 0 }}>
          <Image src={imageUrl} alt={media?.title || media?.name} fill style={{ objectFit: "cover" }} priority />
        </Box>
      )}

      {/* Trailer iframe */}
      {trailerUrl && (
        <iframe
          title="trailer"
          src={trailerUrl}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      )}

      {/* Gradient overlay */}
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0))", zIndex: 0 }} />

      {/* Text + Buttons */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 2,
          bottom: { xs: "1.2rem", md: "12%" },
          left: { xs: "50%", md: "3.5rem" },
          transform: { xs: "translateX(-50%)", md: "none" },
          width: { xs: "90%", md: "40%" },
          color: "#fff",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", md: "2rem", lg: "2.6rem" } }}>
          {media?.title || media?.name || "Untitled"}
        </Typography>
        <Typography sx={{ mt: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", color: "rgba(255,255,255,0.9)" }}>
          {media?.overview ? (media.overview.length > 220 ? `${media.overview.slice(0, 220)}...` : media.overview) : "No description available."}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.2, mt: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
          <MuiButton onClick={handlePlay} startIcon={<Play />} sx={{ background: "#fff", color: "#000", "&:hover": { opacity: 0.9 } }}>
            Play Details
          </MuiButton>
          <MuiButton startIcon={<InfoIcon />} sx={{ background: "rgba(255,255,255,0.85)", color: "#000", "&:hover": { opacity: 0.9 } }}>
            More info
          </MuiButton>
          <IconButton onClick={toggleMute} sx={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
            {isMuted ? <Mute /> : <Unmute />}
          </IconButton>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Banner;
