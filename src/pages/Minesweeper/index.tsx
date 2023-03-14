import React, {
  MutableRefObject,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../../components/Button";
import MinesDivMatrix from "../../components/MinesDivMatrix";
import MinesInputNumber from "../../components/MinesInputNumber";
import Modal from "../../components/Modal";
import Page from "../../components/Page";
import { PageWidthContext } from "../../contexts/PageWidth";
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

  const { pageWidth } = useContext(PageWidthContext);

  const [zoomMatrix, setZoomMatrix] = useState<string>("1");

  const onlyMinesMatrixRefs: FieldRefs = useRef<FieldRefs>({});
  const matrixRefs: FieldRefs = useRef<FieldRefs>({});
  const logicMatrixRefs: FieldRefs = useRef<FieldRefs>({});

  const inputRefRow: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefColumn: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputRefQuantity: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const accumulatorMatrix: MutableRefObject<number[][][]> = useRef(
    new Array<Array<Array<number>>>()
  );
  const [accumulatorMatrixTrigger, setAccumulatorMatrixTrigger] =
    useState<boolean>(false);

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

  const mineIndexes: MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  const flagIndexes: MutableRefObject<Array<Array<number>>> = useRef(
    new Array<Array<number>>()
  );

  const fieldHighlightProps: FieldHighlighProp = {
    function: fieldHighlight,
    cssOnMouseEnter: "brightness(90%)",
    cssOnMouseLeave: "none",
  };

  const [modalNotOpened, setModalNotOpened] = useState<boolean>(false);

  let modalMessage: string = "Você ganhou!";

  const changeZoomMatrix = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event?.target.value) {
        setZoomMatrix((parseInt(event?.target.value) / 100).toString());
      }
    },
    []
  );

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

  function setLogicMatrixToMaskingMatrix(matrix: Array<Array<number>>) {
    let logicToMaskingMatrix = matrix.map((column) =>
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

  const cloneMatrix = (matrix: Array<Array<number>>): Array<Array<number>> =>
    matrix.map((array) => array.map((value) => value));

  const cloneArrayOfMatrix = (
    matrix: Array<Array<Array<number>>>
  ): Array<Array<Array<number>>> =>
    matrix.map((arrayOfMatrix) =>
      arrayOfMatrix.map((matrix) => matrix.map((value) => value))
    );

  function startReplay(): void {
    setMaskingMatrix(
      Array.from(
        { length: parseInt(inputRefColumn.current?.value || "0") },
        (x) => new Array(parseInt(inputRefRow.current?.value || "0")).fill(" ")
      )
    );
    setAccumulatorMatrixTrigger(true);
  }

  useEffect(() => {
    if (accumulatorMatrixTrigger === true) {
      const timerId = setInterval(() => {
        if (accumulatorMatrix.current[counter.current] !== undefined) {
          setLogicMatrix(
            cloneMatrix(accumulatorMatrix.current[counter.current])
          );
          setLogicMatrixToMaskingMatrix(
            accumulatorMatrix.current[counter.current]
          );
          counter.current++;
        } else {
          counter.current = 0;
          setAccumulatorMatrixTrigger(false);
        }
      }, 100);
      return function cleanup() {
        clearInterval(timerId);
      };
    }
  }, [accumulatorMatrixTrigger]);

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
    accumulatorMatrix.current = new Array<Array<Array<number>>>();
    counter.current = 0;
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

  const counter: MutableRefObject<number> = useRef(0);

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

              accumulatorMatrix.current.push(cloneMatrix(logicMatrix));

              if (matrix[coordinates[0] + x][coordinates[1] + y] === 0) {
                findNearEmptyFields([coordinates[0] + x, coordinates[1] + y]);
              }
            }
          }
        }
      }
    } else {
      accumulatorMatrix.current.push(cloneMatrix(logicMatrix));
    }
  }

  function fieldLeftClick(button: React.MouseEvent<HTMLButtonElement>): void {
    findNearEmptyFields(getCoordinatesById(button, "mm "));

    setLogicMatrix([...logicMatrix]);

    setLogicMatrixToMaskingMatrix(logicMatrix);
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
      <Page
        title={"Campo Minado"}
        description={"100% handmade XD"}
        width={pageWidth}
      >
        <S.WrapperDiv>
          <MinesInputNumber
            inputRef={inputRefRow}
            defaultValue={6}
            min={1}
            max={50}
          >
            Linhas
          </MinesInputNumber>
          <MinesInputNumber
            inputRef={inputRefColumn}
            defaultValue={6}
            min={1}
            max={50}
          >
            Colunas
          </MinesInputNumber>
          <MinesInputNumber
            inputRef={inputRefQuantity}
            defaultValue={15}
            min={0}
            max={100}
          >
            Quantidade (%)
          </MinesInputNumber>
          <MinesInputNumber
            onChange={changeZoomMatrix}
            defaultValue={100}
            min={1}
            max={100}
          >
            Zoom (%)
          </MinesInputNumber>
        </S.WrapperDiv>
        <S.ButtonWrapperDiv>
          <Button onClick={generateMinesweeper}>Gerar Campo Minado</Button>
          <Button
            onClick={startReplay}
          >Replay snapshots:<S.ReplaySpan>{`${counter.current} / ${accumulatorMatrix.current.length}`}</S.ReplaySpan></Button>
        </S.ButtonWrapperDiv>
        <S.MinesWrapper zoom={zoomMatrix}>
          <MinesDivMatrix
            matrix={maskingMatrix}
            fieldLeftClick={fieldLeftClick}
            fieldRightClick={fieldRightClick}
            fieldHighligh={fieldHighlightProps}
          >
            Jogo
          </MinesDivMatrix>
          <S.WrapperDiv>
            <MinesDivMatrix
              matrix={onlyMinesMatrix}
              matrixRefs={onlyMinesMatrixRefs}
            >
              Matriz com minas (9):
            </MinesDivMatrix>
            <MinesDivMatrix matrix={matrix} matrixRefs={matrixRefs}>
              Matriz com dicas (1~8):
            </MinesDivMatrix>
            <MinesDivMatrix matrix={logicMatrix} matrixRefs={logicMatrixRefs}>
              Matriz Lógica (10 = entorno verificado)
            </MinesDivMatrix>
          </S.WrapperDiv>
        </S.MinesWrapper>
      </Page>
    </>
  );
};

export default Minesweeper;
