import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PrintIcon from "@mui/icons-material/Print";
import LabelIcon from "@mui/icons-material/Label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import bg from "../assets/Company.jpg";
import logo from "../abb.svg";
import { api } from "../apiConfig";

// Enhanced keyframes styles for the printer animation
const keyframesStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotateY(0deg);
    }
    50% {
      transform: translateY(-10px) rotateY(10deg);
    }
  }
  
  @keyframes printLabel {
    0% {
      transform: translate(-50%, -130%) scale(0.8);
      opacity: 0;
    }
    10% {
      transform: translate(-50%, -130%) scale(0.8);
      opacity: 0;
    }
    20% {
      transform: translate(-50%, -100%) scale(0.9);
      opacity: 1;
    }
    60% {
      transform: translate(-50%, 100%) scale(1);
      opacity: 1;
    }
    80%, 100% {
      transform: translate(-50%, 150%) scale(1.1);
      opacity: 0;
    }
  }
  
  @keyframes printerLight {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.7;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.7;
      transform: scale(0.95);
    }
  }
  
  @keyframes printerVibrate {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-1px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(1px);
    }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Insert keyframes styles to the document head
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.innerHTML = keyframesStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Effect for initial page loading animation
  useEffect(() => {
    let progressTimer;
    if (pageLoading) {
      progressTimer = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + Math.random() * 8;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
    }

    // Set timeout to finish loading
    const mainTimer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setPageLoading(false), 500); // Small delay after reaching 100%
    }, 4000); // Extended time to see animation better

    return () => {
      clearInterval(progressTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (loginSuccess && userData) {
      timer = setTimeout(() => {
        navigate("/main");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [loginSuccess, userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setIsLoading(true); // Start loading

    try {
      const response = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login Successful", { position: "top-right" });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.admin.role);

      console.log("Login Success:", response.data);

      // Store user data and set login success
      setUserData(response.data);
      setLoginSuccess(true);

      // The useEffect will handle navigation after the minimum display time
    } catch (error) {
      setIsLoading(false); // Stop loading on error
      toast.error(error.response?.data?.message || "Login Failed", {
        position: "top-right",
      });
    }
  };

  // Enhanced Label Printing Animation Loader with ABB logo on labels
  const LabelPrintingLoader = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          perspective: "1000px",
        }}
      >
        {/* Logo with 3D rotation */}
        <Box
          component="img"
          src={logo}
          alt="ABB Logo"
          sx={{
            height: "90px",
            filter: "brightness(1.5)",
            animation: "float 3s ease-in-out infinite",
          }}
        />

        {/* Enhanced printer with vibration effect */}
        <Box
          sx={{
            position: "relative",
            width: "150px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "printerVibrate 0.5s ease-in-out infinite",
            backgroundColor: "#333",
            borderRadius: "8px",
            boxShadow: "0 0 15px rgba(255,82,82,0.3)",
            padding: "10px",
            perspective: "500px",
          }}
        >
          {/* Printer light */}
          <Box
            sx={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#ff5252",
              borderRadius: "50%",
              top: "20px",
              right: "20px",
              boxShadow: "0 0 10px #ff5252",
              animation: "printerLight 1s ease-in-out infinite",
            }}
          />

          <PrintIcon
            sx={{
              fontSize: 60,
              color: "#ff5252",
              position: "relative",
              zIndex: 2,
            }}
          />

          {/* Slot for labels to come out */}
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              width: "80%",
              height: "4px",
              backgroundColor: "#222",
              borderRadius: "2px",
            }}
          />

          {/* Multiple animated labels coming out with ABB logo */}
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                zIndex: 1,
                animation: `printLabel 5s infinite ${index * 1.5}s`,
                backgroundColor: "white",
                padding: "8px",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "60px",
                height: "40px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            >
              {/* Mini ABB logo on each label */}
              <Box
                component="img"
                src={logo}
                alt="ABB Logo"
                sx={{
                  height: "20px",
                  width: "auto",
                }}
              />
              <Box
                sx={{
                  width: "80%",
                  height: "2px",
                  backgroundColor: "#ddd",
                  margin: "4px 0",
                }}
              />
              <Box
                sx={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#eee",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Loading progress text */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            mt: 1,
          }}
        >
          Loading Label Printing System
        </Typography>

        {/* Custom progress bar */}
        <Box
          sx={{
            width: "280px",
            height: "6px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "3px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              backgroundColor: "#ff5252",
              width: `${loadingProgress}%`,
              transition: "width 0.3s ease-out",
              borderRadius: "3px",
            }}
          />
        </Box>

        {/* Loading percentage */}
        <Typography
          variant="body2"
          sx={{
            color: "#ff5252",
            fontWeight: "bold",
          }}
        >
          {Math.round(loadingProgress)}%
        </Typography>
      </Box>
    </Box>
  );

  // Regular login process loader
  const LoginProcessLoader = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.92)", // Changed to dark theme
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="ABB Logo"
          sx={{
            height: "80px",
            filter: "brightness(1.5)", // Added brightness for dark background
            animation: "pulse 1.5s infinite ease-in-out",
          }}
        />
        <CircularProgress sx={{ color: "#ff5252" }} size={40} />{" "}
        {/* Changed color to match theme */}
      </Box>
    </Box>
  );

  // If page is loading, show only the dark loader with label printing animations
  if (pageLoading) {
    return <LabelPrintingLoader />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      {/* Show the regular loader when isLoading is true */}
      {isLoading && <LoginProcessLoader />}

      <ToastContainer />
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box
              component="img"
              sx={{
                height: "70px",
                maxWidth: "100%",
              }}
              alt="Company Logo"
              src={logo}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "#f5f8fa" }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 3, backgroundColor: "#f5f8fa" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 1,
                py: 1.2,
                backgroundColor: "#ff5252",
                "&:hover": {
                  backgroundColor: "#ff0800",
                },
                borderRadius: 1,
              }}
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"} {/* Fixed this text */}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
