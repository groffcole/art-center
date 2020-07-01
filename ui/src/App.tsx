import React from "react";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <ColorModeProvider>
        <div className="bg-purple-300 p-4">
          <div className="bg-green-100 p-4">hello, world.</div>
          <div className="bg-green-100 p-4">hello, world.</div>
          <div className="bg-green-100 p-4">hello, world.</div>
          <div className="bg-green-100 p-4">hello, world.</div>
          <div className="bg-green-100 p-4">hello, world.</div>
          <div className="bg-green-100 p-4">hello, world.</div>
        </div>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default App;
