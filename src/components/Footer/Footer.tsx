import { FB, Github, Instagram, Twitter } from "@/utils/icons";
import { Box, Typography } from "@mui/material";
import React from "react";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
    return (
       <Box sx={{backgroundColor: "#141414", color: "rgba(255, 255, 255, 0.5)", padding: "5r0 em 3rem, 5rem", textAlign: "center"}}>

        <Box sx={{display: {xs: "block", sm: "flex"}, justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", color: "white", gap: "2rem", MarginBottom: "1rem"}}>
            <FB style={{fontSize: "2rem" }} />
            <Twitter style={{fontSize: "2rem" }}/> 
            <Instagram style={{fontSize: "2rem" }}/> 
            <Github style={{fontSize: "2rem" }}/> 
        </Box>
        <Box sx={{display: {sm: "flex"}, justifyContent: "space-between", alignItems: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem"}}>
            <Box>
                <Typography>Service Code</Typography>
                <Typography>Investor Relations</Typography>
                <Typography>Policy</Typography>
                <Typography> Contact </Typography>
            </Box>
            <Box>
                <Typography>Help Center</Typography>
                <Typography>Jobs</Typography>
                <Typography>Legal Notices</Typography>
                <Typography> Ad Choices </Typography>
            </Box>
            <Box>
                 <Typography>Gift Card</Typography>
                <Typography>Netflix Shop</Typography>
                <Typography>cookies preferences</Typography>
                <Typography> Ad Choices </Typography>
            </Box>
            <Box>
                <Typography>Terms of Use</Typography>
                <Typography>Corporate Information</Typography>
                <Typography>Privacy</Typography>
                <Typography>Cookie Preferences</Typography>
            </Box>
        </Box>
        <Box>
            <Typography sx={{border: "1px solid rgba(255, 255, 255, 0.5)", padding: "1rem", my: "1rem", width: "fit-content", margin: "0 auto"}}>
                Service Code
            </Typography>
        </Box>
        <Box>@1997-2025 Netflix, Inc</Box>
       </Box>
    );
};

export default Footer;