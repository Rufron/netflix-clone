"use client";
import { AppBar, Box, Container, FormControl, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

import React from "react";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const pages = [
    "Home",
    "TV Shows",
    "Movies",
    "New & Popular",
    "My List",
    "Browse by Languages",
]

const Navbar = () => {

    const router = useRouter();
    const [anchorELNav, setAnchorELNav] = React.useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showClearIcons, setShowClearIcons] = React.useState(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorELNav(event.currentTarget);
    }
    const handleCloseNavMenu = () => {
        setAnchorELNav(null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        setShowClearIcons(!!value);
    };

    const handleClick = () => {
        setSearchQuery("");
        setShowClearIcons(false);    
    }

    const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && searchQuery.trim()) {
            event.preventDefault();
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    }

    return (
       <AppBar>
            <Container>
                <Toolbar>
                  <Image
                    src={"/assets/logo.png"}
                    alt="Logo"
                    width={100}
                    height={50}
                    style={{ position: "relative", zIndex: 1 }}
                  />  
                  <Box>
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                    <Menu id="menu-appbar"
                        anchorEl={anchorELNav}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        keepMounted
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        open={Boolean(handleCloseNavMenu)}
                        sx={{ display: { xs: "block", md: "none" } }}
                        >
                        {pages.map((page) => (
                            <MenuItem key={page}>
                                <Typography>
                                    <Link href={page === "Home" ? "/" : page === "My List" ? "/my_list" : '#' } />
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                  </Box>
                  <FormControl></FormControl>
                  <Box></Box>
                  <Box></Box>
                </Toolbar>
            </Container>
       </AppBar>
    );
};

export default Navbar;