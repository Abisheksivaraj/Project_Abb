import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        mt: "auto",
        bgcolor: "white",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Copyright © 2025 <span className="text-[#ed4337] font-bold">ABB :: Label Printing.</span> All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
