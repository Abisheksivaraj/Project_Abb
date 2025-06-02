import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import logo from "../abb.svg";

function MainPage() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      console.log("Logo loaded successfully");
      setLogoLoaded(true);
    };
    img.onerror = () => {
      console.error("Error loading logo");
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    handleCloseUserMenu();
    navigate("/");
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const settings = [
    {
      label: isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
      icon: isFullscreen ? (
        <FullscreenExitIcon fontSize="small" />
      ) : (
        <FullscreenIcon fontSize="small" />
      ),
      action: toggleFullscreen,
    },
    {
      label: "Logout",
      icon: <LogoutIcon fontSize="small" />,
      action: handleLogout,
    },
  ];

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "white", boxShadow: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{ display: { xs: "none", md: "flex" }, mr: 2, flexShrink: 0 }}
            >
              <img
                src={logo}
                alt="ABB Logo"
                style={{ height: "40px", width: "auto", display: "block" }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                justifyContent: "between",
              }}
            >
              <img
                src={logo}
                alt="ABB Logo"
                style={{ height: "35px", width: "auto", display: "block" }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            {/* Fullscreen toggle button in toolbar */}
            <Box sx={{ mr: 1 }}>
              <Tooltip
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{ color: "text.primary" }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flexGrow: 0, ml: 2 }}>
              <Tooltip title="User settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.label}
                    onClick={() => {
                      setting.action();
                      handleCloseUserMenu();
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {setting.icon}
                      <Typography>{setting.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default MainPage;
