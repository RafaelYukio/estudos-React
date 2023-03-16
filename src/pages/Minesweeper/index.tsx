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
import Toggle from "../../components/Toggle";
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
  const [showOtherMatrixes, setShowOtherMatrixes] = useState<boolean>(true);

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
  const [helpMatrix, setHelpMatrix] = useState<Array<Array<string>>>(
    Array.from({ length: 3 }, (x) => new Array(3).fill(null))
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

  let modalMessage: string = "You won!";

  const changeZoomMatrix = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event?.target.value) {
        setZoomMatrix((event?.target.valueAsNumber / 100).toString());
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

  function setLogicMatrixToMaskingMatrix(
    matrix: Array<Array<number>>
  ): Array<Array<string>> {
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

    return logicToMaskingMatrix;
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
      Array.from({ length: inputRefColumn.current?.valueAsNumber || 0 }, (x) =>
        new Array(inputRefRow.current?.valueAsNumber || 0).fill(" ")
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
    const inputColumn: number = inputRefColumn.current?.valueAsNumber || 0;
    const inputRow: number = inputRefRow.current?.valueAsNumber || 0;
    const inputQuantityPercentage: number =
      inputRefQuantity.current?.valueAsNumber || 0;

    let tempMatrix: Array<Array<number>> = Array.from(
      { length: inputColumn },
      (x) => new Array(inputRow).fill(0)
    );

    setModalNotOpened(true);
    accumulatorMatrix.current = new Array<Array<Array<number>>>();
    counter.current = 0;
    setLogicMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(" "))
    );
    setMaskingMatrix(
      Array.from({ length: inputColumn }, (x) => new Array(inputRow).fill(" "))
    );
    setHelpMatrix(Array.from({ length: 3 }, (x) => new Array(3).fill(null)));
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

  function fieldLeftClick(event: React.MouseEvent<HTMLButtonElement>): void {
    let coordinates: Array<number> = getCoordinatesById(event, "mm ");

    findNearEmptyFields(coordinates);

    setLogicMatrix([...logicMatrix]);
    let currentMaskingMatrix = setLogicMatrixToMaskingMatrix(logicMatrix);

    setHelpMatrixView(coordinates, currentMaskingMatrix);
  }

  function fieldRightClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    let coordinates = getCoordinatesById(event, "mm ");
    if (maskingMatrix[coordinates[0]][coordinates[1]] === "F")
      maskingMatrix[coordinates[0]][coordinates[1]] = " ";
    else if (maskingMatrix[coordinates[0]][coordinates[1]] === " ")
      maskingMatrix[coordinates[0]][coordinates[1]] = "F";

    setMaskingMatrix([...maskingMatrix]);

    flagIndexes.current = findIndexes(maskingMatrix, "F");
    setHelpMatrixView(coordinates, maskingMatrix);
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
      modalMessage = "Booom!";
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
    if (showOtherMatrixes) {
      let coordinates: Array<number> = getCoordinatesById(button, "mm ");

      onlyMinesMatrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
        brightness;
      matrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
        brightness;
      logicMatrixRefs[`c${coordinates[0]}r${coordinates[1]}`].style.filter =
        brightness;

      setHelpMatrixView(coordinates, maskingMatrix);
    }
  }

  const binaryPossibilitiesValue: MutableRefObject<number[][]> = useRef(
    new Array<Array<number>>()
  );

  function setHelpMatrixView(
    coordinates: Array<number>,
    currentMaskingMatrix: Array<Array<string>>
  ) {
    let tempMatrix: Array<Array<string>> = Array.from({ length: 3 }, (x) =>
      new Array(3).fill(null)
    );

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (
          currentMaskingMatrix[coordinates[0] + y] !== undefined &&
          currentMaskingMatrix[coordinates[0] + y][coordinates[1] + x] !==
            undefined
        ) {
          tempMatrix[y + 1][x + 1] =
            currentMaskingMatrix[coordinates[0] + y][coordinates[1] + x];
        }
      }
    }

    let notDiscoveredFields: number = 0;
    let flagFields: number = 0;
    let minesQuantity: number = parseInt(tempMatrix[1][1]);

    tempMatrix.forEach((array) => {
      notDiscoveredFields += array.reduce((accumulator, currentValue) => {
        if (currentValue === " ") return (accumulator += 1);
        else return accumulator;
      }, 0);
      flagFields += array.reduce((accumulator, currentValue) => {
        if (currentValue === "F") return (accumulator += 1);
        else return accumulator;
      }, 0);
    });

    binaryPossibilitiesValue.current = binaryPossibilities(
      minesQuantity - flagFields,
      notDiscoveredFields
    );

    tempMatrix = tempMatrix.map((array) =>
      array.map((value) => {
        if (value === " " && binaryPossibilitiesValue.current.length !== 0) {
          return binaryPossibilitiesValue.current.length === 1 ? "X" : "?";
        } else return value;
      })
    );

    setHelpMatrix(tempMatrix);
  }

  const binaryPossibilities = (
    numberOfOnes: number,
    arrayLength: number
  ): Array<Array<number>> => {
    if (numberOfOnes === 0) return [];
    let array = new Array(arrayLength).fill(0);
    let maxValue = 2 ** arrayLength - 1;
    let zeroToMaxValueBinary: Array<Array<number>> = new Array<Array<number>>();
    let binaryPossibilities: Array<Array<number>> = new Array<Array<number>>();

    for (let i = 0; i <= maxValue; i++) {
      let valueToBinary = i;
      let result = array.map((binary, index) => {
        let binaryToValue = 2 ** (array.length - index - 1);
        if (binaryToValue > valueToBinary) return 0;
        else {
          valueToBinary = valueToBinary - binaryToValue;
          return 1;
        }
      });
      zeroToMaxValueBinary.push(result.reverse());
    }

    binaryPossibilities = zeroToMaxValueBinary.reduce(
      (accumulator, currentArray) => {
        let oneCounter: number = 0;
        currentArray.forEach((value) => {
          if (value === 1) oneCounter++;
        });
        if (oneCounter === numberOfOnes) accumulator.push(currentArray);
        return accumulator;
      },
      new Array<Array<number>>()
    );

    return binaryPossibilities;
  };

  return (
    <>
      {checkEnd(maskingMatrix) && modalNotOpened && (
        <Modal
          PrimaryButtonOnClick={() => {
            setModalNotOpened(false);
          }}
          Header="Minesweeper"
          Content={modalMessage}
        />
      )}
      <Page
        title={"Minesweeper"}
        description={"100% handmade XD"}
        width={pageWidth}
      >
        <S.WrapperDiv>
          <Toggle onClick={() => setShowOtherMatrixes(!showOtherMatrixes)}>
            Only game
          </Toggle>
        </S.WrapperDiv>
        <S.WrapperDiv>
          <MinesInputNumber
            inputRef={inputRefRow}
            defaultValue={6}
            min={1}
            max={50}
          >
            Rows
          </MinesInputNumber>
          <MinesInputNumber
            inputRef={inputRefColumn}
            defaultValue={6}
            min={1}
            max={50}
          >
            Columns
          </MinesInputNumber>
          <MinesInputNumber
            inputRef={inputRefQuantity}
            defaultValue={15}
            min={0}
            max={100}
          >
            Quantity (%)
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
          <Button onClick={generateMinesweeper}>New Game</Button>
          <Button onClick={startReplay}>
            Replay calculations:
            <S.ReplaySpan>{`${counter.current} / ${accumulatorMatrix.current.length}`}</S.ReplaySpan>
          </Button>
        </S.ButtonWrapperDiv>
        <S.MinesWrapper zoom={zoomMatrix}>
          <S.WrapperDiv>
            <MinesDivMatrix
              matrix={maskingMatrix}
              fieldLeftClick={fieldLeftClick}
              fieldRightClick={fieldRightClick}
              fieldHighligh={fieldHighlightProps}
            >
              Game
            </MinesDivMatrix>
            {showOtherMatrixes && (
              <S.HelpMatrixWrapperDiv>
                <MinesDivMatrix matrix={helpMatrix}>
                  Help matrix:
                </MinesDivMatrix>
                <S.HelpPossibilitiesDiv>
                  <S.HelpPossibilitiesSpan>
                    {`Possibilities: ${binaryPossibilitiesValue.current.length}`}
                  </S.HelpPossibilitiesSpan>
                  <br />
                  <div>
                    {binaryPossibilitiesValue.current.map((array) => (
                      <span>{array}</span>
                    ))}
                  </div>
                </S.HelpPossibilitiesDiv>
              </S.HelpMatrixWrapperDiv>
            )}
          </S.WrapperDiv>
          {showOtherMatrixes && (
            <S.WrapperDiv>
              <MinesDivMatrix
                matrix={onlyMinesMatrix}
                fieldRefs={onlyMinesMatrixRefs}
              >
                Matrix with mines (9):
              </MinesDivMatrix>
              <MinesDivMatrix matrix={matrix} fieldRefs={matrixRefs}>
                Matrix with clues (1~8):
              </MinesDivMatrix>
              <MinesDivMatrix matrix={logicMatrix} fieldRefs={logicMatrixRefs}>
                Logic matrix (10 = surroundings checked)
              </MinesDivMatrix>
            </S.WrapperDiv>
          )}
        </S.MinesWrapper>
      </Page>
    </>
  );
};

export default Minesweeper;
