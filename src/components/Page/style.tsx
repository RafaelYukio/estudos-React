import styled from "styled-components";

export const OuterWrapperDiv = styled.div<{ width: string }>`
  width: ${(props) => props.width} !important;
  border-radius: 10px;
  margin: ${(props) => (props.width === "100%" ? "7px 0 0 0" : "7px 0 0 7px")};
  background-color: #f0f0f0;
`;

export const InnerWrapperDiv = styled.div`
  width: 98%;
  background-color: #f0f0f0;
`;

export const HeaderDiv = styled.div`
  background-color: #f0f0f0;
  margin: 10px 0 30px 0;
`;

export const ContentDiv = styled.div`
  padding-top: 20px;
  border-radius: 10px;
  overflow-x: scroll;
  background-color: white;
`;
