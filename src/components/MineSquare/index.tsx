import { useRef, useState } from "react";
import * as S from "./styles";

const MineSquare = () => {
  const inputRefRow = useRef<HTMLInputElement>(null);
  const inputRefColumn = useRef<HTMLInputElement>(null);
  const inputRefQuantity = useRef<HTMLInputElement>(null);

  const [matrix, setMatrix] = useState<Array<Array<number>>>(
    Array(6).fill(Array(6).fill(0))
  );

  const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

  const handleChange = () => {
    // Recebe valores dos inputs
    let inputColumn: number = parseInt(inputRefColumn.current?.value || "0");
    let inputRow: number = parseInt(inputRefRow.current?.value || "0");
    let inputQuantityPercentage: number = parseInt(
      inputRefQuantity.current?.value || "0"
    );

    // Monta a matriz temporária de acordo com tamanho setados nos inputs
    // Obs.: o método 'Array(len).fill(Array(len).fill(0))' não funciona, pois é gerado a mesma Array de referência:
    // https://stackoverflow.com/questions/57514341/setting-the-value-in-a-matrix-after-fill-returns-incorrect-matrix
    let tempMatrix: Array<Array<number>> = Array.from(
      { length: inputColumn },
      (x) => new Array(inputRow).fill(0)
    );

    // Exemplo de matriz:

    //    A array dentro da  array principal define a quantidade de linhas
    //    |
    // [ [0 , [0 , [0 , [0 ]   <- Array principal define a quantidade de colunas
    //    0    0    0    0
    //    0    0    0    0
    //    0]   0]   0]   0]

    // Calcula quantidade de mines de acordo com tamanho da matriz
    let mineQuantity: number = Math.floor(
      inputColumn * inputRow * (inputQuantityPercentage / 100)
    );

    // Coloca mines em lugares aleatórios da matriz
    // O local da mine terá o número 7
    for (let i: number = 0; i < mineQuantity; i++) {
      let columnCoordinate: number = getRandomInt(inputColumn);
      let rowCoordinate: number = getRandomInt(inputRow);

      tempMatrix[columnCoordinate][rowCoordinate] = 7;
    }

    // Faz uma verificação por coluna para colocar as dicas de onde estão as mines
    tempMatrix.forEach((currentArrayRow, columnIndex) => {
      // Encontra os indexes das mines desta coluna
      let mineIndexes: Array<number> = currentArrayRow.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentValue === 7) accumulator.push(currentIndex);
          return accumulator;
        },
        new Array<number>()
      );

      // Adiciona +1 em volta de cada mine desta coluna
      // [ [+1 , [+1 , [+1 ]
      //    +1     7    +1
      //    +1]   +1]   +1]

      for (let i = -1; i < 2; i++) {
        let arrayRow: Array<number> = tempMatrix[columnIndex + i];

        if (arrayRow) {
          mineIndexes.forEach((mineIndex) => {
            for (let i = -1; i < 2; i++) {
              if (
                arrayRow[mineIndex + i] !== undefined &&
                arrayRow[mineIndex + i] !== 7
              )
                arrayRow[mineIndex + i]++;
            }
          });
        }
      }
    });

    setMatrix(tempMatrix);
  };

  return (
    <>
      Coluna
      <input ref={inputRefColumn} type="number" />
      Linhas
      <input ref={inputRefRow} type="number" />
      Bombas (%)
      <input ref={inputRefQuantity} type="number" />
      <button onClick={handleChange}>-</button>
      <S.SquareDiv>
        {matrix.map((content, index) => (
          <S.ColumnDiv key={Math.random()}>
            {matrix[index].map((number) => (
              <S.MineButton key={Math.random()}>{number}</S.MineButton>
            ))}
          </S.ColumnDiv>
        ))}
      </S.SquareDiv>
    </>
  );
};

export default MineSquare;
