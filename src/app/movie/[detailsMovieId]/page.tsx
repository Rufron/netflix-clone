"use client";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMovie } from "@/utils/apiService";
import { Video } from "@/types";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";

const DetailsMoviePage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
  const [site, setSite] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const movieId = pathname.split("/").pop();

  const loadTrailer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMovie(`/movie/${movieId}/videos`);

      if (res.error) {
        setError(res.error.message);
        return;
      }

      const trailer = (res.data?.results as Video[]).find(
        (video) => video.type === "Trailer"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setSite(trailer.site);
      } else {
        setTrailerKey("https://www.w3schools.com/html/mov_bbb.mp4");
        setSite("Fallback");
      }
    } catch (err: any) {
      setError("Failed to load trailer");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (movieId) loadTrailer();
  }, [movieId]);

  // Rewind 10s
  const handleRewind = () => {
    if (videoRef.current)
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
  };

  // Forward 10s
  const handleForward = () => {
    if (videoRef.current)
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
  };

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
      {/* Back button */}
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

      {/* Loading */}
      {loading && (
        <CircularProgress
          color="inherit"
          sx={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}

      {/* Error */}
      {!loading && error && (
        <Typography sx={{ color: "red" }} variant="h6">
          {error}
        </Typography>
      )}

      {/* Video Player */}
      {!loading && !error && trailerKey && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {site === "YouTube" ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1`}
              allow="autoplay; fullscreen"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <video
              ref={videoRef}
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

          {/* Cinema dark fade */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Rewind / Forward buttons */}
          {site !== "YouTube" && (
            <Box
              sx={{
                position: "absolute",
                bottom: "3rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "3rem",
                zIndex: 5,
              }}
            >
              <IconButton
                onClick={handleRewind}
                sx={{
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { background: "rgba(0,0,0,0.8)" },
                  width: "4rem",
                  height: "4rem",
                }}
              >
                <FastRewindIcon fontSize="large" />
              </IconButton>

              <IconButton
                onClick={handleForward}
                sx={{
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { background: "rgba(0,0,0,0.8)" },
                  width: "4rem",
                  height: "4rem",
                }}
              >
                <FastForwardIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {!loading && !error && !trailerKey && (
        <Typography sx={{ color: "red" }} variant="h6">
          Trailer not found.
        </Typography>
      )}
    </Box>
  );
};

export default DetailsMoviePage;
