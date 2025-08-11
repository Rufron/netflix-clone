import {CardProps} from "@/types";
import {Box, Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import React from "react";
import Link from "next/link";
import Button from "../Button/Button";

const SimilarMediaCard: React.FC<CardProps> = ({item}:CardProps) => {
const {id, title, poster_path, overview, vote_average} = item;

const imageUrl = `https://image.tmdb.org/t/p/original${poster_path}`; 

return (
    <Card sx={{ maxWidth: 345, backgroundColor: "#252525", position: "relative", top: 0 }}>
        <Box
        sx={{
            positon: "absolute",
            bottom: "15%",
            inset: 0,
            backgroundImage: `linear-gradient(to top, black, transparent)`,

        }}
        />
        <CardActionArea>
        <CardMedia 
        component="img" 
        height={140}
        image={imageUrl}
        alt={title}
        sx={{objectPosition: "top"}}/>
        <CardContent
        sx={{
            color: "#ffffff80",
            position: "relative",
            zIndex: 2,
            fontWeight: {xs: ".85rem", md: "1.5rem"},
        }}>
            <Typography gutterBottom variant="h5" component="div">
            {title.slice(0, 12)}
            </Typography>
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
            }}>
            <Typography
            sx={{
                color: "#53d853",
            }} variant="body2" color="text.secondary">
                {`${Math.round(vote_average * 10)}% Match`}
            </Typography>
            <Link style={{textDecoration: "none"}} href={`/movies/${id}`}>
            <Button Icon={Play} rounded/>
            </Link>
            </Box>
            <Typography variant="bold" color="text.secondary">
                {overview.slice(0, 60)} . . .
            </Typography>
        </CardContent>
        </CardActionArea>
    </Card>
)
}
   