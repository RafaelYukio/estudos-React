import { useContext, useEffect, useRef, useState } from "react";
import Page from "../../components/Page";
import * as S from "./style";
import { PageWidthContext } from "../../contexts/PageWidth";
import SudokuMatrix from "../../components/SudokuMatrix";

const Sudoku = (): JSX.Element => {
  const { pageWidth } = useContext(PageWidthContext);

  const [matrix, setMatrix] = useState<Array<Array<Array<Array<number>>>>>(
    Array.from({ length: 3 }, (x) =>
      Array.from({ length: 3 }, (x) =>
        Array.from({ length: 3 }, (x) => new Array(3).fill(0))
      )
    )
  );

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
    } else if (target.valueAsNumber !== 0) target.valueAsNumber--;

    matrix[columnMatrixIndex][matrixIndex][columnIndex][rowIndex] =
      target.valueAsNumber;

    console.log(matrix[columnMatrixIndex][matrixIndex][columnIndex][rowIndex]);
    console.log(matrix);
    setMatrix(matrix);
  }

  return (
    <Page title="Sudoku" description="Sudoku" width={pageWidth}>
      Sudoku em construção
      <SudokuMatrix
        matrix={matrix}
        setMatrix={setMatrix}
        scrollWheelField={scrollWheelField}
      ></SudokuMatrix>
    </Page>
  );
};

export default Sudoku;
