import React, { useRef, useState } from "react";
import * as S from "./style";

const SudokuDivMatrix = () => {
  const [matrix, setMatrix] = useState<Array<Array<Array<Array<number>>>>>(
    Array.from({ length: 3 }, (x) =>
      Array.from({ length: 3 }, (x) =>
        Array.from({ length: 3 }, (x) => new Array(3).fill(0))
      )
    )
  );
  interface FieldRefs {
    [key: string]: any;
  }

  const fieldRefs: FieldRefs = useRef<FieldRefs>({});

  function scrollWheelField(
    event: React.WheelEvent<HTMLInputElement>,
    columnMatrixIndex: number,
    matrixIndex: number,
    columnIndex: number,
    rowIndex: number
  ) {
    let target = event.target as HTMLInputElement;

    if (event.deltaY < 0) {
      if (target.value === "") target.valueAsNumber = 1;
      else if (target.valueAsNumber < 9) target.valueAsNumber++;
    } else if (target.valueAsNumber != 0) target.valueAsNumber--;

    matrix[columnMatrixIndex][matrixIndex][columnIndex][rowIndex] =
      target.valueAsNumber;

    console.log(matrix[columnMatrixIndex][matrixIndex][columnIndex][rowIndex]);
    console.log(matrix);
    setMatrix(matrix);
  }

  // Remover refs se não necessário

  return (
    <S.MatrixRowWrapperDiv>
      {matrix.map((matrixColumn, columnMatrixIndex) => (
        <S.MatrixColumnWrapperDiv key={`mc${columnMatrixIndex}`}>
          {matrixColumn.map((matrixIn, matrixIndex) => (
            <S.MatrixRowDividerWrapperDiv
              key={`mc${columnMatrixIndex}m${matrixIndex}`}
            >
              {matrixIn.map((array, columnIndex) => (
                <S.MatrixColumnWrapperDiv
                  key={`mc${columnMatrixIndex}m${matrixIndex}c${columnIndex}`}
                >
                  {array.map((value, rowIndex) => {
                    let refString: string = `m${
                      matrixIndex * (columnMatrixIndex * 3)
                    }c${columnIndex}r${rowIndex}`;

                    return (
                      <S.MatrixInput
                        ref={(ref) => {
                          if (fieldRefs !== undefined)
                            fieldRefs[refString] = ref;
                        }}
                        key={refString}
                        onWheel={(event) =>
                          scrollWheelField(
                            event,
                            columnMatrixIndex,
                            matrixIndex,
                            columnIndex,
                            rowIndex
                          )
                        }
                        type="number"
                        min={0}
                        max={9}
                        onChange={(event) => {
                          console.log(event.target.value);
                          matrix[columnMatrixIndex][matrixIndex][columnIndex][
                            rowIndex
                          ] = event.target.valueAsNumber;
                          setMatrix(matrix);
                          console.log(matrix);
                        }}
                      />
                    );
                  })}
                </S.MatrixColumnWrapperDiv>
              ))}
            </S.MatrixRowDividerWrapperDiv>
          ))}
        </S.MatrixColumnWrapperDiv>
      ))}
    </S.MatrixRowWrapperDiv>
  );
};

export default React.memo(SudokuDivMatrix);
