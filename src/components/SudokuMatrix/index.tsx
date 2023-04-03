import React, { useRef, useState } from "react";
import * as S from "./style";

interface FieldRefs {
  [key: string]: any;
}

interface Props {
  matrix: Array<Array<Array<Array<number>>>>;
  setMatrix: React.Dispatch<React.SetStateAction<number[][][][]>>;
  scrollWheelField: ( event: React.WheelEvent<HTMLInputElement>,
    columnMatrixIndex: number,
    matrixIndex: number,
    columnIndex: number,
    rowIndex: number) => void;
}

const SudokuMatrix = ({ matrix, setMatrix, scrollWheelField }: Props) => {
  const fieldRefs: FieldRefs = useRef<FieldRefs>({});

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

export default React.memo(SudokuMatrix);
