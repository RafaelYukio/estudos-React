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
