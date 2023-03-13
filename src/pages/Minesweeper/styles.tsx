import styled from "styled-components";

export const WrapperDiv = styled.div`
  flex-direction: row;
`;

export const MinesWrapper = styled.div<{ zoom: string }>`
  transform-origin: top;
  transform: scale(${(props) => props.zoom});
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
  cursor: pointer;
  &:hover {
    background-color: #dadada;
  }
`;
