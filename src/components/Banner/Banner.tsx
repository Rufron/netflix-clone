import { Box, Button as MuiButton, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { getMovie } from "@/utils/apiService";
import { Mute, Play, Unmute } from "@/utils/icons";
import ReactPlayer from "react-player";
import { Image, Info } from "@mui/icons-material";

const Banner = () => {
  const [media, setMedia] = React.useState<any[]>([]);
  const [trailerKey, setTrailerKey] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const router = useRouter();

  const handlePlayClick = () => {
    if (media?.id) {
      router.push(`/movie/${media?.id}`);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const loadMedia = async () => {
    const result = await getMovie(`/movie/top_rated?language=en-US&page=1`);

    if (result && result.data && result.data.results) {
      const randomIndex = Math.floor(Math.random() * result.data.results.length);
      const selectedMedia = result.data.results[randomIndex];
      setMedia(selectedMedia);

      const trailerResponse = await getMovie(`/movie/${selectedMedia.id}/videos`);
      if (trailerResponse && trailerResponse.data && trailerResponse.data.results) {
        const trailer = trailerResponse.data.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
          setTrailerKey(trailer?.key || null);
        }
      }
      else {
        console.log("Trailer not found");
      }

    }
  };

  React.useEffect(() => {
    loadMedia();
  }, []);


  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { md: "75vh" },
        }}>
        {trailerKey ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              overflow: "hidden"
            }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              playing
              muted={isMuted}
              controls={false}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    loop: 1,
                    autoplay: 1,
                    showinfo: 0,
                    rel: 0,
                  },
                },
              }}
              style={{ position: "absolute", top: "50%", left: "50", transform: "translate(-50%, -50%)" }}
            />
            <Box sx={{
              position: "absolute",
              bottom: "15%",
              inset: 0,
              backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), transparent)",

            }} />
            <Box sx={{
              position: "absolute",
              bottom: { xs: "5%", md: "30%" },
              right: 0,
            }}>
              <IconButton
                sx={{
                  marginRight: "10px",
                  border: "2px solid white",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
                onClick={toggleMute}>
                {isMuted ? <Mute /> : <Unmute />}
              </IconButton>

              <MuiButton
                sx={{
                  borderLeft: "2px solid white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  fontSize: "12px",
                  padding: { xs: ".5rem", md: ".5rem 3rem .5rem .5rem" },
                  borderRadius: "0",
                }}>
                18+
              </MuiButton>
            </Box>
          </Box>
        ) : (
          media && (
            <Image
              width={1200}
              height={720}
              src={`https://image.tmdb.org/t/p/w1280/${media?.backdrop_path}`}
              alt="spotlight"
            />
          )
        )}
      </Box>
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          bottom: { xs: "1rem", md: "15%" },
          width: { xs: "75%", md: "35%" },
          marginLeft: { xs: 0, md: "3.5rem" },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "center", md: "flex-end" },
          textAlign: { xs: "center", md: "left" },
          textShadow: "2 2 4px rgba(0, 0, 0, 0.45)",

        }}>
        <Typography
          sx={{
            fontWeight: 600,
            padding: ".4rem",
            fontSize: { xs: "1.5rem", md: "2rem", lg: "2.8rem" },
          }}>
          {media?.title}
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            padding: ".4rem",
            fontSize: { xs: "1.5rem", md: "1.2rem", lg: "1.5rem" },
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
          {media?.overview?.slice(0, 100) + "..." || "No Description"}
        </Typography>
        <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          margin: ".3rem 0",
          justifyContent: { xs: "center", md: "flex-start" },

        }}>
          <MuiButton
          variant="contained"
          onClick={handlePlayClick}
          startIcon={<Play />}
          sx={{
            color: "black",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}>
            Play
          </MuiButton>
          {media && (
          <MuiButton
          variant="contained"
          onClick={handleOpen}
          startIcon={<Info />}
          sx={{
            color: "black",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
          >More info</MuiButton>)}
        </Box>
      </Box>
    </>
  );
}

export default Banner;
