import { useContext, useEffect, useRef, useState } from "react";
import Page from "../../components/Page";
import * as S from "./style";
import { PageWidthContext } from "../../contexts/PageWidth";
import SudokuDivMatrix from "../../components/SudokuDivMatrix";

const Sudoku = (): JSX.Element => {
  const { pageWidth } = useContext(PageWidthContext);

  return (
    <Page title="Sudoku" description="Sudoku" width={pageWidth}>
      Sudoku em construção
      <SudokuDivMatrix></SudokuDivMatrix>
    </Page>
  );
};

export default Sudoku;
