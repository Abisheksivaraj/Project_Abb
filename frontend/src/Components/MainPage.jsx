import * as React from "react";
import { useEffect } from "react";
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

import logo from "../abb.svg";
import MainPageTable from "./MainPageTable";

const settings = [
  {
    label: "Logout",
    icon: <LogoutIcon fontSize="small" />,
    action: () => {
      // Add your logout logic here
      console.log("Logout clicked");
      // For example: clear localStorage, redirect to login page, etc.
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    },
  },
];

function MainPage() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [logoLoaded, setLogoLoaded] = React.useState(false);

  // Check if logo is loaded correctly
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "white", boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, mr: 2, flexShrink: 0 }}
          >
            <img
              src={logo}
              alt="ABB Logo"
              style={{ height: "40px", width: "auto", display: "block" }}
            />
          </Box>

          {/* Logo for mobile screens */}
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

          {/* Empty space to push logo to left and logout to right on desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

          {/* User avatar and menu */}
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
        <MainPageTable/>
      </Container>
    </AppBar>
  );
}

export default MainPage;
