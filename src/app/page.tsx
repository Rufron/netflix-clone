"use client";
import Banner from "@/components/Banner/Banner";
import MovieSections from "@/components/MovieSections/MovieSections";
import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import react, { useState } from "react";


const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);


  const sections: MovieSectionProps[] = [

    {
      heading: "Top Rated",
      endpoint: "/movie/top_rated?language=en-US&page=1",
    },

    {
      heading: "Trending Now",
      endpoint: "/trending/all/day?language=en-US&page=1",
    },

    {
      heading: "Action Movies",
      endpoint: "/discover/movie?with_genres=28&language=en-US&page=1",
    },
    {
      heading: "Comedy Movies",
      endpoint: "/discover/movie?with_genres=35&language=en-US&page=1",
    },
    {
      heading: "Horror Movies",
      endpoint: "/discover/movie?with_genres=27&language=en-US&page=1",
    },
    {
      heading: "Romance Movies",
      endpoint: "/discover/movie?with_genres=10749&language=en-US&page=1",
    },
    {
      heading: "Documentaries",
      endpoint: "/discover/movie?with_genres=99&language=en-US&page=1",
    },
  ];

  return (
    <>
      {loading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
          <CircularProgress size={60} sx={{ color: "red" }} />
        </Box>
      )}
      <Banner />
      <Box sx={{ marginTop: "9rem", display: "flex", flexDirection: "column", backgroundColor: "#141414", color: "white", position: "relative", minHeight: "100vh" }}>
        <Box sx={{ marginLeft: ".8rem", zIndex: 0 }}>
          {sections.map((section, index) => (
            <Box key={section.heading || index} sx={{ marginBottom: "2rem" }}>
              <h2></h2>
              <MovieSections
                heading={section.heading}
                endpoint={section.endpoint}
                loading={loading}
                setLoading={setLoading}
              />
            </Box>
          ))}


        </Box>
      </Box>
    </>
  );
};



export default Home;


