import React from "react";
import { useColorMode, Box, IconButton, Flex, Heading } from "@chakra-ui/core";

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Flex border="1px" textAlign="right">
        <IconButton
          icon={colorMode === "light" ? "moon" : "sun"}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="some label"
        />
      </Flex>
      <Flex as="nav" wrap="wrap">
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          cole's art center
        </Heading>
      </Flex>
    </>
  );
};
export default ThemeToggler;
