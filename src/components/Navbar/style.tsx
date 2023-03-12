import styled from "styled-components";

export const WrapperDiv = styled.div`
  height: 90px;
  width: 99%;
  margin-top: 7px;
  color: black;
  border-radius: 10px;
  background-color: #e6f5ff;
  box-shadow: 0 0 7px 1px #ececec;
  flex-direction: row;
  font-size: 24px;
  font-weight: bold;
`;

export const ButtonWrapperDiv = styled.div`
  width: 10%;
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

export const InformationDiv = styled.div`
  width: 10%;
`;

export const TitleSpan = styled.span`
  width: 80%;
  text-align: center;
`;
