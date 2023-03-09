import { useRef, useState } from "react";
import * as S from "./styles";

const MineSquare = () => {
  const inputRefRow = useRef<HTMLInputElement>(null);
  const inputRefColumn = useRef<HTMLInputElement>(null);
  const inputRefQuantity = useRef<HTMLInputElement>(null);

  const [onlyMinesMatrix, setOnlyMinesMatrixx] = useState<Array<Array<number>>>(
    Array.from({ length: 6 }, (x) => new Array(6).fill(0))
  );
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

  const createMinesweeper = () => {
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
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(" "))
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
    // O local da mine terá o número 9
    for (let i: number = 0; i < mineQuantity; i++) {
      let columnCoordinate: number = getRandomInt(inputColumn);
      let rowCoordinate: number = getRandomInt(inputRow);

      tempMatrix[columnCoordinate][rowCoordinate] = 9;
    }

    setOnlyMinesMatrixx(
      tempMatrix.map((column) => column.map((content) => content))
    );

    // Faz uma verificação por coluna para colocar as dicas de onde estão as mines
    tempMatrix.forEach((currentArrayColumn, columnIndex) => {
      // Encontra os indexes das mines desta coluna
      let mineIndexes: Array<number> = currentArrayColumn.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentValue === 9) accumulator.push(currentIndex);
          return accumulator;
        },
        new Array<number>()
      );

      // Adiciona +1 em volta de cada mine desta coluna
      // [ [+1 , [+1 , [+1 ]
      //    +1     9    +1
      //    +1]   +1]   +1]

      for (let x = -1; x < 2; x++) {
        let arrayColumn: Array<number> = tempMatrix[columnIndex + x];

        if (arrayColumn) {
          mineIndexes.forEach((mineIndex) => {
            for (let y = -1; y < 2; y++) {
              if (
                arrayColumn[mineIndex + y] !== undefined &&
                arrayColumn[mineIndex + y] !== 9
              )
                arrayColumn[mineIndex + y]++;
            }
          });
        }
      }
    });

    setMatrix(tempMatrix);
  };

  function fieldClick(button: React.MouseEvent<HTMLButtonElement>) {
    let coordinates: Array<number> = button.currentTarget.id
      .split(" ")
      .map((stringValue) => parseInt(stringValue));

    findNearEmptyFields(coordinates);

    setLogicMatrix([...logicMatrix]);

    setMaskingMatrix(
      logicMatrix.map((column) =>
        column.map((field) => {
          if (field === 10) return "";
          else if (field === 9) return "B";
          else if (field === null) {
            return " ";
          } else {
            return field.toString();
          }
        })
      )
    );
  }

  function findNearEmptyFields(coordinates: Array<number>) {
    logicMatrix[coordinates[0]][coordinates[1]] =
      matrix[coordinates[0]][coordinates[1]];

    // Apenas se o field clicado não tem dicas ou bomba, que então são expostos os fields em volta
    if (matrix[coordinates[0]][coordinates[1]] === 0) {
      // for dentro de for para verificar os 8 fields em volta do lugar clicado
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          // seta o lugar clicado (coodenada 0, 0 a partir do lugar clicado) para 10 (assim eu sei que em volta deste field já foi verificado)
          if (x === 0 && y === 0) {
            logicMatrix[coordinates[0] + x][coordinates[1] + y] = 10;
          } else {
            // if para validar se em volta deste field é o final da matriz, ou se já foi verificado (10)
            if (
              matrix[coordinates[0] + x] !== undefined &&
              matrix[coordinates[0] + x][coordinates[1] + y] !== undefined &&
              logicMatrix[coordinates[0] + x][coordinates[1] + y] !== 10
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

  return (
    <>
      <S.MenuWrapperDiv>
        <S.MenuItemDiv>
          <S.Label htmlFor="columns">Colunas</S.Label>
          <S.InputNumber
            ref={inputRefColumn}
            name="column"
            defaultValue={6}
            type="number"
          />
        </S.MenuItemDiv>
        <S.MenuItemDiv>
          <S.Label htmlFor="row">Linhas</S.Label>
          <S.InputNumber
            ref={inputRefRow}
            name="rows"
            defaultValue={6}
            type="number"
          />
        </S.MenuItemDiv>
        <S.MenuItemDiv>
          <S.Label htmlFor="mines">Minas (%)</S.Label>
          <S.InputNumber
            ref={inputRefQuantity}
            name="mines"
            defaultValue={15}
            type="number"
          />
        </S.MenuItemDiv>
      </S.MenuWrapperDiv>
      <S.Button onClick={createMinesweeper}>Gerar Campominado</S.Button>
      <S.MatrixWrapperDiv>
        Jogo:
        <S.WrapperDiv margin="10px">
          {maskingMatrix.map((content, indexColumn) => (
            <S.ColumnDiv key={indexColumn}>
              {maskingMatrix[indexColumn].map((content, indexRow) => (
                <S.MineButton
                  onMouseEnter={() => console.log("tesstess")}
                  key={`${indexColumn} ${indexRow}`}
                  id={`${indexColumn} ${indexRow}`}
                  backgroundColor={content === " " ? true : false}
                  onClick={(button) => fieldClick(button)}
                >
                  {content}
                </S.MineButton>
              ))}
            </S.ColumnDiv>
          ))}
        </S.WrapperDiv>
      </S.MatrixWrapperDiv>
      <S.WrapperDiv margin="0px">
        <S.MatrixWrapperDiv>
          Matriz com minas (9):
          <S.WrapperDiv margin="10px">
            {onlyMinesMatrix.map((content, indexColumn) => (
              <S.ColumnDiv key={indexColumn}>
                {onlyMinesMatrix[indexColumn].map((content, indexRow) => (
                  <S.MineButton
                    key={`${indexColumn} ${indexRow}`}
                    id={`${indexColumn} ${indexRow}`}
                    backgroundColor={true}
                  >
                    {content}
                  </S.MineButton>
                ))}
              </S.ColumnDiv>
            ))}
          </S.WrapperDiv>
        </S.MatrixWrapperDiv>
        <S.MatrixWrapperDiv>
          Matriz com dicas (1~8):
          <S.WrapperDiv margin="10px">
            {matrix.map((content, indexColumn) => (
              <S.ColumnDiv key={indexColumn}>
                {matrix[indexColumn].map((content, indexRow) => (
                  <S.MineButton
                    key={`${indexColumn} ${indexRow}`}
                    id={`${indexColumn} ${indexRow}`}
                    backgroundColor={true}
                  >
                    {content}
                  </S.MineButton>
                ))}
              </S.ColumnDiv>
            ))}
          </S.WrapperDiv>
        </S.MatrixWrapperDiv>
        <S.MatrixWrapperDiv>
          Lógica (10 = entorno verificado)
          <S.WrapperDiv margin="10px">
            {logicMatrix.map((content, indexColumn) => (
              <S.ColumnDiv key={indexColumn}>
                {logicMatrix[indexColumn].map((content, indexRow) => (
                  <S.MineButton
                    key={`${indexColumn} ${indexRow}`}
                    id={`${indexColumn} ${indexRow}`}
                    backgroundColor={true}
                  >
                    {content}
                  </S.MineButton>
                ))}
              </S.ColumnDiv>
            ))}
          </S.WrapperDiv>
        </S.MatrixWrapperDiv>
      </S.WrapperDiv>
    </>
  );
};

export default MineSquare;
