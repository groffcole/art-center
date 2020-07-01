import React from "react";
import { ThemeProvider, CSSReset, ColorModeProvider, useColorMode, Button, Skeleton, Box, theme, Spinner, Stack } from "@chakra-ui/core";

export const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = { light: "green.500", dark: "red.200" };
  const color = { light: "white", dark: "gray.800" };

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <div>hello, world.</div>
        <Box flex="1" mb={4} bg={bgColor[colorMode]} color={color[colorMode]}>
          This box's style will change based on the color mode.
        </Box>
        <Button onClick={toggleColorMode}>Toggle {colorMode === "light" ? "Dark" : "Light"}</Button>
        <div>
          <Skeleton height="20px" my="10px" />
          <Skeleton height="100px" my="10px" />
          <Skeleton height="20px" my="10px" />
        </div>
        <Stack isInline spacing={4}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </Stack>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default App;
