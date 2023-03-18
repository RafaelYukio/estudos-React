import React from "react";
import Button from "../Button";
import * as S from "./style";

interface Props {
  primaryButtonOnClick: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  secondaryButtonOnClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  header: string;
  footer?: string;
  children: React.ReactNode;
}

const Modal = ({
  primaryButtonOnClick,
  secondaryButtonOnClick,
  header,
  footer,
  children,
}: Props): JSX.Element => {
  return (
    <S.ModalWrapperDiv>
      <S.ModalDiv>
        <S.ModalHeaderDiv>{header}</S.ModalHeaderDiv>
        <S.ModalContentDiv>{children}</S.ModalContentDiv>
        <S.ModalFooterDiv>
          {footer}
          <Button onClick={primaryButtonOnClick}>Fechar</Button>
          {secondaryButtonOnClick && (
            <Button onClick={secondaryButtonOnClick}>Fechar</Button>
          )}
        </S.ModalFooterDiv>
      </S.ModalDiv>
    </S.ModalWrapperDiv>
  );
};

export default React.memo(Modal);
