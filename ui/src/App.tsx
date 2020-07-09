import React from "react";
import { useColorMode, ThemeProvider, CSSReset, ColorModeProvider, theme } from "@chakra-ui/core";
import ThemeToggler from "./components/ThemeToggler";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ThemeToggler />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default App;
