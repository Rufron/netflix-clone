"use client";
import { AppBar, Avatar, Box, Container, FormControl, IconButton, Input, InputAdornment, Menu, MenuItem, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

import React from "react";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import { IoCloseCircleOutline } from "react-icons/io5";

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
       <AppBar
       position="sticky"
       sx={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        top: 0,
        transition: "background-color 0.3s ease-in-out",
        "&:hover": { backgroundColor: "#000",  opacity: 1 },
       }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Image
                    src={"/assets/logo.png"}
                    alt="Logo"
                    width={100}
                    height={50}
                    style={{ position: "relative", zIndex: 1 }}
                  />  
                  <Box sx={{flexGrow: 1, display: {xs: "flex", md:"none" }}}>
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
                                <Typography component="span">
                                    <Link  href={page === "Home" ? "/" : page === "My List" ? "/my_list" : '#' } >
                                    <Box sx={{
                                        opacity: 0.9,
                                        cursor: "pointer",
                                        padding: ".6rem 0.9rem",
                                        "&:hover":{
                                            borderColor: "#fff"
                                        }
                                    }}>{page}</Box>
                                    </Link>
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                  </Box>
                  {/* Navigation links for small screens */}
                  <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                      {pages.map((page) => (
                          <Link key={page} href={page === "Home" ? "/" : page === "My List" ? "/my_list" : '#'}>
                              <Box sx={{
                                  opacity: 0.9,
                                  cursor: "pointer",
                                  padding: ".6rem 0.9rem",
                                  "&:hover": {
                                      borderColor: "#fff",
                                      fontWeight: 500,
                                  }
                              }}>{page}</Box>
                          </Link>
                      ))}
                  </Box>
                  {/* Navigation links for medium and up screens */}
                  <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                      {pages.map((page) => (
                          <Link key={page} href={page === "Home" ? "/" : page === "My List" ? "/my_list" : '#'}>
                              <Box sx={{
                                  opacity: 0.9,
                                  cursor: "pointer",
                                  padding: ".6rem 0.9rem",
                                  "&:hover": {
                                      borderColor: "#fff",
                                      fontWeight: 500,
                                  }
                              }}>{page}</Box>
                          </Link>
                      ))}
                  </Box>
                  <FormControl sx={{ marginRight: "10px", backgroundColor:"#2a2a2a99"}}>
                    <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleChange}
                    onKeyPress={handleSearchKeyPress}
                    InputProps={{
                        startAdornment:(
                            <InputAdornment position="start">
                                <SearchIcon sx={{
                                    color: "#ffffff80"
                                }} />
                            </InputAdornment>
                        ),
                        endAdornment: showClearIcons && (
                            <InputAdornment position="end"
                            style={{ display: showClearIcons ? "block" : "none" }}
                            onClick={handleClick}>
                               <ClearIcon sx={{color: "#ffffff80", cursor: "pointer"}} />
                            </InputAdornment>
                        ),
                        style:{color: "#ffffff80", width: "300px", backgroundColor: "#2a2a2a99"}
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#ffffff80",
                            },
                            "&:hover fieldset": {
                                borderColor: "#ffffff80",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#ffffff80",
                            },
                        },
                        "& .MuiInputBase-input": {
                            color: "#ffffff80",
                        },
                    }}
                    >
                      
                    </TextField>
                  </FormControl>
                  <Box sx={{flexGrow: 0,
                  }}>
                    <Tooltip title="Open Settings">
                        <IconButton>
                            <Avatar alt="User Avatar" src="/assets/avatar.png" sx={{ borderRadius: "5px", width:40, height:40 }}/>
                        </IconButton>
                    </Tooltip>
                  </Box>
                  <Box></Box>
                </Toolbar>
            </Container>
       </AppBar>
    );
};

export default Navbar;