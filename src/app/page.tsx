import Image from "next/image";
import react from "react";


const page = () => {};


const sections: MovieSectionProps[] =[

  { heading: "Top Rated",
    endpoint: "/movie/top_rated?language=en-US&page=1",
  },

  {
    heading: "Trending Now",
    endpoint: "/trending/all/day?language=en-US&page=1",
  },
  
  { heading: "Action Movies",
    endpoint: "/discover/movie?with_genres=28&language=en-US&page=1",
  },
  { heading: "Comedy Movies",
    endpoint: "/discover/movie?with_genres=35&language=en-US&page=1",
  },
  { heading: "Horror Movies",
    endpoint: "/discover/movie?with_genres=27&language=en-US&page=1",
  },
  { heading: "Romance Movies",
    endpoint: "/discover/movie?with_genres=10749&language=en-US&page=1",
  },
  { heading: "Documentaries",
    endpoint: "/discover/movie?with_genres=99&language=en-US&page=1",
  },
];

export default page;


