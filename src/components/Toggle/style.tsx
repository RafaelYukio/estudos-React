import styled from "styled-components";

export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: auto;
  margin: 10px;
  padding: 10px 14px;
  box-shadow: 0 0 7px 7px #f9f9f9;
  border-radius: 28px;
  font-size: 14px;
`;

export const ToggleSwitch = styled.div`
  position: relative;
  width: 28px;
  height: 14px;
  background: #b3b3b3;
  border-radius: 32px;
  padding: 4px;
  transition: 150ms all;

  &:before {
    transition: 150ms all;
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 35px;
    top: 50%;
    left: 1px;
    background: white;
    transform: translate(0, -50%);
  }
`;

export const ToggleInput = styled.input`
  opacity: 0;
  position: absolute;

  // Irá executar o transform no ToggleSwitch, que está logo depois do Input com checked
  &:checked + ${ToggleSwitch} {
    background: green;

    &:before {
      transform: translate(14px, -50%);
    }
  }
`;
