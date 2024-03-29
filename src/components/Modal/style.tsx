import styled from "styled-components";

// Tutorial para criar modal:
//https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a

export const ModalWrapperDiv = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalDiv = styled.div`
  width: 400px;
  height: 300px;
  background-color: white;
  border-radius: 30px;
  border: solid #c2c2c2 1px;
  box-shadow: 0 0 10px 3px #c2c2c2;
  background-color: #f5f5f5;
`;

export const ModalContentDiv = styled.div`
  height: 60%;
`;

export const ModalHeaderDiv = styled.div`
  height: 20%;
`;

export const ModalFooterDiv = styled.div`
  height: 20%;
`;
