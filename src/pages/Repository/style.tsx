import styled from "styled-components";

export const FilesWrapperDiv = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  justify-content: start;
  align-items: start;
  border: solid #f0f0f0 2px;
  border-radius: 10px;
  width: 60%;
`;

export const FilesContentWrapperDiv = styled.div`
  justify-content: start;
  align-items: start;
  padding: 20px;
  overflow: auto;
  max-height: 500px;
`;

export const SpanRow = styled.span`
  display: flex;
  align-items: center;
`;

export const FilesContentPathWrapperDiv = styled.div`
  justify-content: start;
  align-items: start;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
`;

export const DescriptionWrapperDiv = styled.div`
  width: auto;
  margin: 20px;
`;

export const FileDirButton = styled.button<{ dataType: string }>`
  border: ${(props) =>
    props.dataType === "file" ? `none` : `solid #f0f0f0 1px`};
  background-color: white;
  border-radius: 10px;
  margin: 3px;
  padding: 7px;
  font-size: 14px;
  cursor: pointer;
`;
