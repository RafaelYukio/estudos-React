import styled from "styled-components";

export const MatrixRowWrapperDiv = styled.div`
  width: auto;
  flex-direction: Row;
`;

export const MatrixColumnWrapperDiv = styled.div`
  width: auto;
  flex-direction: column;
`;

export const MatrixInput = styled.input`
  width: 40px;
  height: 40px;
  border: solid #f2f2f2 1px;
  text-align: center;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    -moz-appearance: textfield !important;
  }
`;

export const MatrixRowDividerWrapperDiv = styled(MatrixRowWrapperDiv)`
  border: solid black 1px;
`;
