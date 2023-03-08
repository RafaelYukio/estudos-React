import { useRef, useState } from "react";
import * as S from "./styles";

const MineSquare = () => {
  const inputRefRow = useRef<HTMLInputElement>(null);
  const inputRefColumn = useRef<HTMLInputElement>(null);

  const [generateColumns, setGenerateColumns] = useState([1, 2, 3, 4]);
  const [generateMines, setGenerateMines] = useState([1, 2, 3, 4]);

  const getRandomInt = (): number => Math.floor(Math.random() * 2);

  const handleChange = () => {
    let updatedColumns: Array<number> = [];
    let updatedMines: Array<number> = [];

    if (inputRefRow.current && inputRefColumn.current) {
      for (let i = 0; i < parseInt(inputRefColumn.current.value); i++) {
        updatedColumns.push(getRandomInt());
      }
      for (let i = 0; i < parseInt(inputRefRow.current.value); i++) {
        updatedMines.push(getRandomInt());
      }
    }

    setGenerateColumns(updatedColumns);
    setGenerateMines(updatedMines);

    console.log(updatedColumns, updatedMines);
    console.log(generateColumns, generateMines);
  };

  return (
    <>
      Coluna
      <input ref={inputRefColumn} type="number" />
      Linhas
      <input ref={inputRefRow} type="number" />
      <button onClick={handleChange}>-</button>
      <S.SquareDiv>
        {generateColumns.map(() => (
          <S.ColumnDiv key={Math.random()}>
            {generateMines.map((number) => (
              <S.MineButton key={Math.random()}>{number}</S.MineButton>
            ))}
          </S.ColumnDiv>
        ))}
      </S.SquareDiv>
    </>
  );
};

export default MineSquare;
