"use client";

import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovie } from "@/utils/apiService";
import { Video } from "@/types";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const WatchPage = () => {
  const { id } = useParams(); // ✅ works like usePathname but for dynamic routes
  const router = useRouter();

  const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadTrailer = async () => {
    setError(null);
    try {
      const res = await getMovie(`/movie/${id}/videos`);

      if (res.error) {
        setError(res.error.message);
        return;
      }

      const trailer = (res.data?.results as Video[]).find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`);
      } else {
        setTrailerKey("https://www.w3schools.com/html/mov_bbb.mp4");
      }
    } catch (err) {
      setError("Failed to load trailer.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) loadTrailer();
  }, [id]);

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 🎬 Back Button */}
      <IconButton
        onClick={() => router.back()}
        sx={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          color: "#fff",
          background: "rgba(0,0,0,0.6)",
          "&:hover": { background: "rgba(0,0,0,0.8)" },
          zIndex: 10,
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Loader */}
      {loading && <CircularProgress sx={{ color: "white" }} />}

      {/* Error */}
      {!loading && error && (
        <Typography sx={{ color: "red" }} variant="h6">
          {error}
        </Typography>
      )}

      {/* 🎥 Trailer / Video */}
      {!loading && !error && trailerKey && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {trailerKey.includes("youtube.com") ? (
            <iframe
              src={trailerKey}
              allow="autoplay; fullscreen; encrypted-media"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              src={trailerKey}
              controls
              autoPlay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "black",
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default WatchPage;
