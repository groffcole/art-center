import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <div>hello, world.</div>
    </ThemeProvider>
  );
}

export default App;
