import { useRef, useState } from "react";
import * as S from "./styles";

const MineSquare = () => {
  const inputRefRow = useRef<HTMLInputElement>(null);
  const inputRefColumn = useRef<HTMLInputElement>(null);
  const inputRefQuantity = useRef<HTMLInputElement>(null);

  const [matrix, setMatrix] = useState<Array<Array<number>>>(
    Array.from({ length: 6 }, (x) => new Array(6).fill(0))
  );
  const [logicMatrix, setLogicMatrix] = useState<Array<Array<number>>>(
    Array.from({ length: 6 }, (x) => new Array(6).fill(null))
  );
  const [maskingMatrix, setMaskingMatrix] = useState<Array<Array<string>>>(
    Array.from({ length: 6 }, (x) => new Array(6).fill(null))
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

    setLogicMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(null))
    );
    setMaskingMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(null))
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

      for (let x = -1; x < 2; x++) {
        let arrayRow: Array<number> = tempMatrix[columnIndex + x];

        if (arrayRow) {
          mineIndexes.forEach((mineIndex) => {
            for (let y = -1; y < 2; y++) {
              if (
                arrayRow[mineIndex + y] !== undefined &&
                arrayRow[mineIndex + y] !== 7
              )
                arrayRow[mineIndex + y]++;
            }
          });
        }
      }
    });

    setMatrix(tempMatrix);
  };

  function showHideButtonClick(button: React.MouseEvent<HTMLButtonElement>) {
    let coordinates: Array<number> = button.currentTarget.id
      .split(" ")
      .map((stringValue) => parseInt(stringValue));

    findNearEmptyFields(coordinates);

    setLogicMatrix([...logicMatrix]);

    setMaskingMatrix(
      logicMatrix.map((column) =>
        column.map((field) => {
          if (field === 8) return "";
          else if (field === 7) return "8";
          else if (field === null) {
            return 'x';
          }
          else {
            return field.toString();
          }
        })
      )
    );
  }

  function findNearEmptyFields(coordinates: Array<number>) {
    if (true) {
      logicMatrix[coordinates[0]][coordinates[1]] =
        matrix[coordinates[0]][coordinates[1]];

      // Apenas se o field clicado não tem dicas ou bomba, que então são expostos os fields em volta
      if (matrix[coordinates[0]][coordinates[1]] === 0) {
        // for dentro de for para verificar os 8 fields em volta do lugar clicado
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            // seta o lugar clicado (coodenada 0, 0 a partir do lugar clicado) para 8 (assim eu sei que em volta deste field já foi verificado)
            if (x === 0 && y === 0) {
              logicMatrix[coordinates[0] + x][coordinates[1] + y] = 8;
            } else {
              // if para validar se em volta deste field é o final da matriz, ou se já foi verificado (8)
              if (
                matrix[coordinates[0] + x] !== undefined &&
                matrix[coordinates[0] + x][coordinates[1] + y] !== undefined &&
                logicMatrix[coordinates[0] + x][coordinates[1] + y] !== 8
              ) {
                // Mostra os valores em volta do field
                logicMatrix[coordinates[0] + x][coordinates[1] + y] =
                  matrix[coordinates[0] + x][coordinates[1] + y];

                // Se o valor exposto em volta é 0 (que significa sem dica ou bomba), essa mesma função é chamada
                if (matrix[coordinates[0] + x][coordinates[1] + y] === 0) {
                  findNearEmptyFields([coordinates[0] + x, coordinates[1] + y]);
                }
              }
            }
          }
        }
      }
    }
  }

  return (
    <>
      Coluna
      <input ref={inputRefColumn} defaultValue={10} type="number" />
      Linhas
      <input ref={inputRefRow} defaultValue={10} type="number" />
      Bombas (%)
      <input ref={inputRefQuantity} defaultValue={20} type="number" />
      <button onClick={handleChange}>-</button>
      <S.SquareDiv>
        {maskingMatrix.map((content, indexColumn) => (
          <S.ColumnDiv key={indexColumn}>
            {maskingMatrix[indexColumn].map((number, indexRow) => (
              <S.MineButton
                key={`${indexColumn} ${indexRow}`}
                id={`${indexColumn} ${indexRow}`}
                onClick={(button) => showHideButtonClick(button)}
              >
                {number}
              </S.MineButton>
            ))}
          </S.ColumnDiv>
        ))}
      </S.SquareDiv>
    </>
  );
};

export default MineSquare;