import { useState } from "react";
import "./App.css";
import Content from "./components/Content";
import LateralMenu from "./components/LateralMenu";
import Navbar from "./components/Navbar";
import Minesweeper from "./pages/Minesweeper";

function App() {
  const [hideLateralMenu, setHideLateralMenu] = useState<boolean>(false);

  return (
    <>
      <Navbar
        hideLateralMenu={hideLateralMenu}
        setHideLateralMenu={setHideLateralMenu}
      />
      <Content>
        <LateralMenu hide={hideLateralMenu} />
        <Minesweeper />
      </Content>
    </>
  );
}

export default App;
