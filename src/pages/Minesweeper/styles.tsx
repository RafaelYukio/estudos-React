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

export const HelpMatrixWrapperDiv = styled.div`
  width: auto;
`;

export const HelpPossibilitiesDiv = styled.div`
  height: 140px;
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
