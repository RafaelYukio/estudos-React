import styled from "styled-components";

export const WrapperDiv = styled.div`
  height: 90px;
  width: 99%;
  margin-top: 7px;
  color: black;
  border-radius: 10px;
  background-color: #6c6c6c;
  flex-direction: row;
  font-weight: bold;
`;

export const ButtonOuterWrapperDiv = styled.div`
  justify-content: start;
  align-items: start;
  width: 15%;
`;

export const ButtonInnerWrapperDiv = styled.div`
  display: flex;
  height: 120px;
  width: 40%;
  padding: 20px 20px 0 20px;
  margin-top: 60px;
  justify-content: start;
  border: none;
  border-radius: 10px;
  background-color: #6c6c6c;
`;

export const Button = styled.button`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background-color: #ececec;
  cursor: pointer;
  &:hover {
    background-color: #dadada;
  }
`;

export const InformationDiv = styled.div`
  flex-direction: row;
  font-size: 18px;
  justify-content: start;
  color: white;
  width: 15%;
`;

export const InformationSpan = styled.span`
  margin: 0 10px 0 0px;
`;

export const TitleDiv = styled.div`
  width: 70%;
  flex-direction: row;
`;

export const TitleSpan = styled.span`
  margin: 0 30px 0 30px;
  font-size: 24px;
  color: #61dafb;
`;
