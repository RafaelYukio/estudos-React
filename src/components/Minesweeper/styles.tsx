import styled from "styled-components";

export const WrapperDiv = styled.div<{ margin: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: ${props => props.margin || '0'}
`;

export const ColumnDiv = styled.div``;

// Com typescript e styled components, é preciso especificar os tipos das props que iremos passar
// https://stackoverflow.com/questions/52404958/using-styled-components-with-typescript-prop-does-not-exist
export const MineButton = styled.button<{ backgroundColor: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: solid #f2f2f2 1px;
  border-radius: ${(props) => (props.backgroundColor ? "2px" : "7px")};
  background-color: ${(props) => (props.backgroundColor ? "F9F9F9" : "white")};
  box-shadow: 0 0 7px 4px
    ${(props) => (props.backgroundColor ? "#ECECEC" : "#F9F9F9")} inset;
`;
