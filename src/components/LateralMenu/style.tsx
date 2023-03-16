import styled from "styled-components";

export const WrapperDiv = styled.div`
  height: 500px;
  width: 15% !important;
  margin-top: -20px;
  border: none;
  border-radius: 10px;
  background-color: #5f5f5f;
  font-weight: bold;
`;

export const TitleDiv = styled.div`
  margin-top: 15px;
`;

export const Divider = styled.hr`
  width: 90%;
  border: solid #6c6c6c 1px;
`;

export const Button = styled.button`
  padding: 15px 0 15px 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  border: none;
  background-color: #ececec;
  cursor: pointer;
  &:hover {
    background-color: #dadada;
  }
`;

export const WrapperButtonDiv = styled.div`
  height: 93%;
  width: 96%;
  margin: 27px 0 7px 0;
  padding: 10px 0 10px 0;
  justify-content: start;
  border-radius: 10px;
  background-color: #ececec;
`;
