import React, { useState } from "react";
import * as S from "./style";

const SudokuDivMatrix = () => {
  const [matrix, setMatrix] = useState<Array<Array<Array<Array<number>>>>>(
    new Array(3).fill(Array(3).fill(Array(3).fill(Array(3).fill(0))))
  );

  console.log(matrix);

  return (
    <S.MatrixRowWrapperDiv>
      {matrix.map((matrixColumn) => (
        <S.MatrixColumnWrapperDiv>
          {matrixColumn.map((matrix) => (
            <S.MatrixRowWrapperDiv>
              {matrix.map((array) => (
                <S.MatrixColumnWrapperDiv>
                  {array.map((value) => (
                    <S.MatrixInput />
                  ))}
                </S.MatrixColumnWrapperDiv>
              ))}
            </S.MatrixRowWrapperDiv>
          ))}
        </S.MatrixColumnWrapperDiv>
      ))}
    </S.MatrixRowWrapperDiv>
  );
};

export default React.memo(SudokuDivMatrix);
