import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import DivMatrixMines from "../../components/DivMatrixMines";
import InputNumberMine from "../../components/InputNumberMine";
import Modal from "../../components/Modal";
import * as S from "./styles";

const Minesweeper = (): JSX.Element => {
  // Use callback para que, ao componente pai renderizar, ele não passe de novo funções desnecessáriamente
  // https://www.w3schools.com/react/react_usecallback.asp

  useEffect(() => {
    generateMinesweeper();
  }, []);

  interface FieldRefs {
    [key: string]: any;
  }

  interface FieldHighlighProp {
    function: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      css: string
    ) => void;
    cssOnMouseEnter: string;
    cssOnMouseLeave: string;
  }

  const onlyMinesMatrixRefs: FieldRefs = useRef<FieldRefs>({});
  const matrixRefs: FieldRefs = useRef<FieldRefs>({});
  const logicMatrixRefs: FieldRefs = useRef<FieldRefs>({});

  const inputRefRow: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefColumn: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefQuantity: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [onlyMinesMatrix, setOnlyMinesMatrix] = useState<Array<Array<number>>>(
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

  const mineIndexes: React.MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  const flagIndexes: React.MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  const fieldHighlightProps: FieldHighlighProp = {
    function: fieldHighlight,
    cssOnMouseEnter: "brightness(90%)",
    cssOnMouseLeave: "none",
  };

  const [modalNotOpened, setModalNotOpened] = useState<boolean>(true);

  let modalMessage: string = "Você ganhou!";

  const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

  const getCoordinatesById = (
    button: React.MouseEvent<HTMLButtonElement>,
    idPattern: string
  ): Array<number> => {
    return button.currentTarget.id
      .replace(idPattern, "")
      .split(" ")
      .map((stringValue) => parseInt(stringValue));
  };

  const findIndexes = (
    matrix: Array<Array<string>>,
    toFind: string
  ): Array<Array<number>> => {
    let indexes: Array<Array<number>> = new Array<Array<number>>();

    matrix.forEach((currentArrayColumn) => {
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

  const generateMinesweeper = useCallback(() => {
    const inputColumn: number = parseInt(inputRefColumn.current?.value || "0");
    const inputRow: number = parseInt(inputRefRow.current?.value || "0");
    const inputQuantityPercentage: number = parseInt(
      inputRefQuantity.current?.value || "0"
    );

    let tempMatrix: Array<Array<number>> = Array.from(
      { length: inputColumn },
      (x) => new Array(inputRow).fill(0)
    );

    setModalNotOpened(true);
    setLogicMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(null))
    );
    setMaskingMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(" "))
    );
    mineIndexes.current = new Array<Array<number>>();
    flagIndexes.current = new Array<Array<number>>();

    const mineQuantity: number = Math.floor(
      inputColumn * inputRow * (inputQuantityPercentage / 100)
    );

    for (let i: number = 0; i < mineQuantity; i++) {
      let columnCoordinate: number = getRandomInt(inputColumn);
      let rowCoordinate: number = getRandomInt(inputRow);

      tempMatrix[columnCoordinate][rowCoordinate] = 9;
    }

    setOnlyMinesMatrix(
      tempMatrix.map((column) => column.map((content) => content))
    );

    tempMatrix.forEach((currentArrayColumn, columnIndex) => {
      let mineColumnIndexes: Array<number> = currentArrayColumn.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentValue === 9) accumulator.push(currentIndex);
          return accumulator;
        },
        new Array<number>()
      );

      mineIndexes.current.push(mineColumnIndexes);

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
  }, []);

  function fieldLeftClick(button: React.MouseEvent<HTMLButtonElement>): void {
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
  }

  let checkEnd = (maskingMatrix: Array<Array<string>>): boolean => {
    const clickedMineField: Array<Array<number>> = findIndexes(
      maskingMatrix,
      "M"
    );
    
    // Tutorial para uso do every:
    // https://masteringjs.io/tutorials/fundamentals/foreach-break
    if (
      !clickedMineField.every((column) =>
        column.every((content) => {
          return content || content === 0 ? false : true;
        })
      )
    ) {
      modalMessage = "Você perdeu!";
      return true;
    }

    const undiscoveredFields: Array<Array<number>> = findIndexes(
      maskingMatrix,
      " "
    );

    let anyUndiscoveredField: boolean = !undiscoveredFields.every((column) =>
      column.every((content) => {
        return content || content === 0 ? false : true;
      })
    );

    if (
      JSON.stringify(mineIndexes.current) ===
        JSON.stringify(flagIndexes.current) &&
      !anyUndiscoveredField
    )
      return true;
    else return false;
  };

  function findNearEmptyFields(coordinates: Array<number>): void {
    logicMatrix[coordinates[0]][coordinates[1]] =
      matrix[coordinates[0]][coordinates[1]];

    if (matrix[coordinates[0]][coordinates[1]] === 0) {
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          if (x === 0 && y === 0) {
            logicMatrix[coordinates[0] + x][coordinates[1] + y] = 10;
          } else {
            if (
              matrix[coordinates[0] + x] !== undefined &&
              matrix[coordinates[0] + x][coordinates[1] + y] !== undefined &&
              logicMatrix[coordinates[0] + x][coordinates[1] + y] !== 10
            ) {
              logicMatrix[coordinates[0] + x][coordinates[1] + y] =
                matrix[coordinates[0] + x][coordinates[1] + y];

              if (matrix[coordinates[0] + x][coordinates[1] + y] === 0) {
                findNearEmptyFields([coordinates[0] + x, coordinates[1] + y]);
              }
            }
          }
        }
      }
    }
  }

  function fieldHighlight(
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

  return (
    <>
      {checkEnd(maskingMatrix) && modalNotOpened && (
        <Modal
          PrimaryButtonOnClick={() => {
            setModalNotOpened(false);
          }}
          Header="Campo Minado"
          Content={modalMessage}
        />
      )}
      <S.WrapperDiv>
        <InputNumberMine inputRef={inputRefRow} defaultValue={6}>
          Linhas
        </InputNumberMine>
        <InputNumberMine inputRef={inputRefColumn} defaultValue={6}>
          Colunas
        </InputNumberMine>
        <InputNumberMine inputRef={inputRefQuantity} defaultValue={15}>
          Quantidade (%)
        </InputNumberMine>
      </S.WrapperDiv>
      <Button onClick={generateMinesweeper}>Gerar Campo Minado</Button>
      <DivMatrixMines
        matrix={maskingMatrix}
        fieldLeftClick={fieldLeftClick}
        fieldRightClick={fieldRightClick}
        fieldHighligh={fieldHighlightProps}
      >
        Jogo
      </DivMatrixMines>
      <S.WrapperDiv>
        <DivMatrixMines
          matrix={onlyMinesMatrix}
          matrixRefs={onlyMinesMatrixRefs}
        >
          Matriz com minas (9):
        </DivMatrixMines>
        <DivMatrixMines matrix={matrix} matrixRefs={matrixRefs}>
          Matriz com dicas (1~8):
        </DivMatrixMines>
        <DivMatrixMines matrix={logicMatrix} matrixRefs={logicMatrixRefs}>
          Matriz Lógica (10 = entorno verificado)
        </DivMatrixMines>
      </S.WrapperDiv>
    </>
  );
};

export default Minesweeper;
