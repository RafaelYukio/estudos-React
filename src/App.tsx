import "./App.css";
import Minesweeper from "./components/Minesweeper";

function App() {
  return (
    <div className="App">
      <h1>Estudos React!</h1>
      <h2>Jogo de campo minado com tamanho e quantidade de bombas :</h2>
      <Minesweeper />
    </div>
  );
}

export default App;
