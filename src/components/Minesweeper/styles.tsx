import styled from "styled-components";

export const WrapperDiv = styled.div<{ margin: string }>`
  flex-direction: row;
  margin: ${(props) => props.margin || "0"};
`;

export const MenuWrapperDiv = styled.div`
  flex-direction: row;
`;

export const MenuItemDiv = styled.div`
  margin: 10px;
`;

export const InputNumber = styled.input`
  margin: 10px;
  width: 50px;
  height: 40px;
  border-radius: 7px;
  text-align: center;
  border: none;
  box-shadow: 0 0 7px 7px #f9f9f9;
`;

export const Button = styled.button`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 14px;
  background-color: #ececec;
  &:hover {
    background-color: #dadada;
  }
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const MatrixWrapperDiv = styled.div`
  margin: 10px;
  padding: 20px;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 5px;
  font-weight: bold;
`;

export const ColumnDiv = styled.div``;

// Com typescript e styled components, é preciso especificar os tipos das props que iremos passar
// https://stackoverflow.com/questions/52404958/using-styled-components-with-typescript-prop-does-not-exist
export const MineButton = styled.button<{ content: string }>`
  width: 50px;
  height: 50px;
  border: solid #f2f2f2 1px;
  border-radius: ${(props) => (props.content === " " ? "2px" : "7px")};
  background-color: ${(props) => changeBackgroundColor(props.content)};
  box-shadow: 0 0 7px 4px ${(props) => changeShadowBoxColor(props.content)}
    inset;
  &:hover {
    filter: brightness(98%) !important;
  }
`;

const changeBackgroundColor = (content: string): string => {
  switch (content) {
    case " ":
      return "#f0f0f0";
    case "1":
      return "#F1F7FF";
    case "2":
      return "#F2FFF1";
    case "3":
      return "#FFF1F1";
    case "4":
      return "#E6F0FF";
    case "5":
      return "#FFE6E6";
    case "6":
      return "#E6FFFC";
    case "7":
      return "#E7E7E7";
    case "8":
      return "#F1F1F1";
    case "M":
      return "#FFF3C5";
    default:
      return "white";
  }
};

const changeShadowBoxColor = (content: string): string => {
  switch (content) {
    case " ":
      return "#ECECEC";
    case "M":
      return "#FFF3C5";
    default:
      return "#F9F9F9";
  }
};
