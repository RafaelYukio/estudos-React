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

export const ButtonWrapperDiv = styled.div`
  justify-content: start;
  align-items: start;
  width: 20%;
`;

export const Button = styled.button`
  padding: 15px;
  display: flex;
  margin-left: 20px;
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
  padding-right: 20px;
  flex-direction: row;
  font-size: 18px;
  justify-content: end;
  color: white;
  width: 20%;
`;

export const InformationSpan = styled.span`
  margin: 0 10px 0 0px;
`;

export const TitleDiv = styled.div`
  width: 60%;
  flex-direction: row;
`;

export const TitleSpan = styled.span`
  margin: 0 30px 0 30px;
  font-size: 24px;
  color: #61dafb;
`;
