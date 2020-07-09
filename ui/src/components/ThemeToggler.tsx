import React from "react";
import { useColorMode, Box, IconButton } from "@chakra-ui/core";

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box border="1px" textAlign="right">
      <IconButton icon={colorMode === "light" ? "moon" : "sun"} onClick={toggleColorMode} variant="ghost" aria-label="some label" />
    </Box>
  );
};
export default ThemeToggler;
