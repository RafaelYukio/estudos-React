import { useEffect, useRef, useState } from "react";
import * as S from "./styles";

const Minesweeper_teste = (): JSX.Element => {
  // Referências dos inputs para poder coletar os valores
  const inputRefRow: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefColumn: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefQuantity: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  // Gera campo minado na primeira renderização
  // https://www.w3schools.com/react/react_useeffect.asp
  // Exemplo do useEffect com useState:
  // https://www.w3schools.com/react/showreact.asp?filename=demo2_react_useeffect_settimeout3
  useEffect(() => {
    createMinesweeper();
  }, []);

  // Interface para poder criar objeto com keys e valores dinâmicos
  interface fieldRefs {
    [key: string]: any;
  }

  // Objeto com a referência de cada campo de cada matriz (key = coordenada 'c0r0' e value = referência do botão)
  const onlyMinesMatrixRefs: fieldRefs = {};
  const matrixRefs: fieldRefs = {};
  const logicMatrixRefs: fieldRefs = {};

  // Matrizes que serão renderizadas
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

  let mineIndexes: React.MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  let flagIndexes: React.MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

  // Função executada para criar o jogo (matrizes)
  const createMinesweeper = (): void => {
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
    mineIndexes.current = new Array<Array<number>>();
    flagIndexes.current = new Array<Array<number>>();

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
      let mineColumnIndexes: Array<number> = currentArrayColumn.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentValue === 9) accumulator.push(currentIndex);
          return accumulator;
        },
        new Array<number>()
      );

      mineIndexes.current.push(mineColumnIndexes);

      // Adiciona +1 em volta de cada mine desta coluna
      // [ [+1 , [+1 , [+1 ]
      //    +1     9    +1
      //    +1]   +1]   +1]

      for (let x = -1; x < 2; x++) {
        let arrayColumn: Array<number> = tempMatrix[columnIndex + x];

        if (arrayColumn) {
          mineColumnIndexes.forEach((mineColumnIndexes) => {
            for (let y = -1; y < 2; y++) {
              if (
                arrayColumn[mineColumnIndexes + y] !== undefined &&
                arrayColumn[mineColumnIndexes + y] !== 9
              )
                arrayColumn[mineColumnIndexes + y]++;
            }
          });
        }
      }
    });

    setMatrix(tempMatrix);
  };

  // Função para que a matriz de máscara seja atualizada conforme campo clicado
  function fieldClick(button: React.MouseEvent<HTMLButtonElement>): void {
    findNearEmptyFields(getCoordinatesById(button, "mm "));

    setLogicMatrix([...logicMatrix]);

    let logicToMaskingMatrix = logicMatrix.map((column) =>
      column.map((field) => {
        if (field === 10) return "";
        else if (field === 9) return "M";
        else if (field === null) {
          return " ";
        } else {
          return field.toString();
        }
      })
    );

    flagIndexes.current.forEach((currentArrayColumn, columnIndex) => {
      currentArrayColumn.forEach((flagIndex) => {
        logicToMaskingMatrix[columnIndex][flagIndex] = "F";
      });
    });

    setMaskingMatrix(logicToMaskingMatrix);

    checkVictory(logicToMaskingMatrix);
  }

  function fieldRightClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    let coordinate = getCoordinatesById(event, "mm ");
    if (maskingMatrix[coordinate[0]][coordinate[1]] === "F")
      maskingMatrix[coordinate[0]][coordinate[1]] = " ";
    else if (maskingMatrix[coordinate[0]][coordinate[1]] === " ")
      maskingMatrix[coordinate[0]][coordinate[1]] = "F";

    setMaskingMatrix([...maskingMatrix]);

    flagIndexes.current = findIndexes(maskingMatrix, "F");

    checkVictory(maskingMatrix);
  }

  function checkVictory(logicToMaskingMatrix: Array<Array<string>>): void {
    let undiscoveredFields: Array<Array<number>> = findIndexes(
      logicToMaskingMatrix,
      " "
    );

    let anyUndiscoveredField: boolean = false;

    undiscoveredFields.forEach((column) =>
      column.forEach((content) => {
        if (content || content === 0) anyUndiscoveredField = true;
      })
    );
    if (
      JSON.stringify(mineIndexes.current) ===
        JSON.stringify(flagIndexes.current) &&
      !anyUndiscoveredField
    )
      alert("Você ganhou!");
  }

  // Procurar sobre função genérica, onde posso passar uma array de um tipo e procurar pelo mesmo
  const findIndexes = (
    matrix: Array<Array<string>>,
    toFind: string
  ): Array<Array<number>> => {
    let indexes: Array<Array<number>> = new Array<Array<number>>();

    matrix.forEach((currentArrayColumn) => {
      // Encontra os indexes das flags
      let columnIndexes = currentArrayColumn.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentValue === toFind) accumulator.push(currentIndex);
          return accumulator;
        },
        new Array<number>()
      );

      indexes.push(columnIndexes);
    });

    return indexes;
  };

  // Função para que sejam descobertos os campos em volta do lugar clicado (função recursiva para que desencadeie a descoberta de todos os campos sem dicas ou minas adjacentes)
  function findNearEmptyFields(coordinates: Array<number>): void {
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

  // Função para destacar o campo em que o mouse está, em todas as matrizes
  // É verificado o local do mouse e então pego a referência correspondente de cada matriz pelo array de refs. criado

  function highlighField(
    button: React.MouseEvent<HTMLButtonElement>,
    brightness: string
  ): void {
    let coordinates: Array<number> = getCoordinatesById(button, "mm ");

    onlyMinesMatrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
      brightness;
    matrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
      brightness;
    logicMatrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
      brightness;
  }

  // Função para pegar coordenadas do campo clicado pelo id
  // *Verificar melhor forma de armazenar dados em um componente e depois verificar
  const getCoordinatesById = (
    button: React.MouseEvent<HTMLButtonElement>,
    idPattern: string
  ): Array<number> => {
    return button.currentTarget.id
      .replace(idPattern, "")
      .split(" ")
      .map((stringValue) => parseInt(stringValue));
  };

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
      <S.Button onClick={createMinesweeper}>Gerar Campo Minado</S.Button>
      <S.MatrixWrapperDiv>
        Jogo:
        <S.WrapperDiv margin="10px">
          {maskingMatrix.map((content, indexColumn) => (
            <S.ColumnDiv key={indexColumn}>
              {content.map((content, indexRow) => (
                <S.MineButton
                  onMouseEnter={(button) =>
                    highlighField(button, "brightness(90%)")
                  }
                  onMouseLeave={(button) =>
                    highlighField(button, "brightness(100%)")
                  }
                  onContextMenu={(event) => fieldRightClick(event)}
                  key={`mm ${indexColumn} ${indexRow}`}
                  id={`mm ${indexColumn} ${indexRow}`}
                  content={content}
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
                {content.map((content, indexRow) => (
                  <S.MineButton
                    key={`omm ${indexColumn} ${indexRow}`}
                    id={`omm ${indexColumn} ${indexRow}`}
                    ref={(ref) =>
                      (onlyMinesMatrixRefs[`c${indexColumn}r${indexRow}`] = ref)
                    }
                    content={" "}
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
                {content.map((content, indexRow) => (
                  <S.MineButton
                    key={`m ${indexColumn} ${indexRow}`}
                    id={`m ${indexColumn} ${indexRow}`}
                    ref={(ref) =>
                      (matrixRefs[`c${indexColumn}r${indexRow}`] = ref)
                    }
                    content={" "}
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
                {content.map((content, indexRow) => (
                  <S.MineButton
                    key={`lm ${indexColumn} ${indexRow}`}
                    id={`lm ${indexColumn} ${indexRow}`}
                    ref={(ref) =>
                      (logicMatrixRefs[`c${indexColumn}r${indexRow}`] = ref)
                    }
                    content={" "}
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

export default Minesweeper_teste;
