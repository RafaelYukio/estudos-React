import styled from "styled-components";

export const WrapperDiv = styled.div`
  flex-direction: row;
`;

export const MinesWrapper = styled.div<{ zoom: string }>`
  transform-origin: top;
  transform: scale(${(props) => props.zoom});
`;

export const ButtonWrapperDiv = styled.div`
  flex-direction: row;
  button {
    margin: 15px;
  }
`;

export const ReplaySpan = styled.span`
  width: 70px;
`;

export const MenuWrapperDiv = styled.div`
  height: 453px;
  width: 210px;
  margin: 10px;
  padding: 20px;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 7px;
  font-size: 14px;
`;

export const HelpMatrixWrapperDiv = styled.div`
  width: auto;
`;

export const HelpPossibilitiesDiv = styled.div`
  height: 215px;
  width: 210px;
  margin: 0 10px 10px 10px;
  padding: 20px;
  flex-direction: column;
  justify-content: start;
  overflow-y: scroll;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 7px;
  font-size: 14px;
`;

export const HelpPossibilitiesSpan = styled.span`
  widht: 100%;
`;

export const OtherMatrixesWrapperDiv = styled.span`
  display: flex;
  flex-direction: row;
  margin-left: 12px;
`

export const GameHeader = styled.div`
  flex-direction: row;
  padding: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 7px;
  font-size: 14px;
`;

export const ButtonHeader = styled.button`
  border: none;
  box-shadow: 0 0 7px 7px #ececec inset;
  padding: 10px 20px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 5px;
`;

export const TimerDiv = styled.div`
  margin: 20px;
  div {
    flex-direction: row;
  }

  span {
    margin: 10px 5px;
  }
`;

export const FlagHeader = styled.div`
  flex-direction: row;

  span {
    width: 40px;
    text-align: center;
  }
`;
