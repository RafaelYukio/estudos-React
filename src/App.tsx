import { useMemo, useState } from "react";
import "./App.css";
import Content from "./components/Content";
import LateralMenu from "./components/LateralMenu";
import Navbar from "./components/Navbar";
import { PageWidthContext } from "./contexts/PageWidth";
import Minesweeper from "./pages/Minesweeper";
import { IconContext } from "react-icons";

function App() {
  const [hideLateralMenu, setHideLateralMenu] = useState<boolean>(false);

  // Exemplo de useMemo:
  // https://www.w3schools.com/react/react_usememo.asp
  // Uso de context com useMemo:
  // https://blog.agney.dev/useMemo-inside-context/
  // https://stackoverflow.com/questions/62230532/is-usememo-required-to-manage-state-via-the-context-api-in-reactjs
  const [pageWidth, setPageWidth] = useState<string>("85%");
  const providerPageWidth = useMemo(
    () => ({
      pageWidth,
      setPageWidth,
    }),
    [pageWidth]
  );

  return (
    <>
      <PageWidthContext.Provider value={providerPageWidth}>
        <IconContext.Provider value={{ size: "2em" }}>
          <Navbar
            hideLateralMenu={hideLateralMenu}
            setHideLateralMenu={setHideLateralMenu}
          />
          <Content>
            <LateralMenu hide={hideLateralMenu} />
            <Minesweeper />
          </Content>
        </IconContext.Provider>
      </PageWidthContext.Provider>
    </>
  );
}

export default App;
