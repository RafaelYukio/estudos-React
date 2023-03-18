import React from "react";
import * as S from "./styles";

// Implementação de interface para passar props para componentes:
// https://bobbyhadz.com/blog/react-typescript-pass-function-as-prop
interface FieldRefs {
  [key: string]: any;
}
interface FieldHighlighProp {
  function: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    css: string
  ) => void;
  cssOnMouseEnter: string;
  cssOnMouseLeave: string;
}
interface DivMatrixMinesProps<T> {
  matrix: Array<Array<T>>;
  fieldLeftClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  fieldRightClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onMouseDown?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  fieldHighligh?: FieldHighlighProp;
  fieldRefs?: FieldRefs;
  children: React.ReactNode;
}

// Função com tipo genérico:
// https://stackoverflow.com/questions/53958028/how-to-use-generics-in-props-in-react-in-a-functional-component
const MinesDivMatrix = <T,>({
  matrix,
  fieldLeftClick,
  fieldRightClick,
  onMouseDown,
  onMouseUp,
  fieldHighligh,
  fieldRefs,
  children,
}: DivMatrixMinesProps<T>): JSX.Element => {
  return (
    <S.MatrixWrapperDiv>
      {children}
      <S.WrapperDiv>
        {matrix.map((content, columnIndex) => (
          <S.ColumnDiv key={columnIndex}>
            {content.map((content, rowIndex) => (
              <S.MineButton
                onMouseEnter={(button) => {
                  if (fieldHighligh !== undefined)
                    fieldHighligh.function(
                      button,
                      fieldHighligh.cssOnMouseEnter
                    );
                }}
                onMouseLeave={(button) => {
                  if (fieldHighligh !== undefined)
                    fieldHighligh.function(
                      button,
                      fieldHighligh.cssOnMouseLeave
                    );
                }}
                onContextMenu={(event) => {
                  if (fieldRightClick !== undefined) fieldRightClick(event);
                }}
                onMouseDown={(event) => {
                  if (onMouseDown !== undefined) onMouseDown(event);
                }}
                onMouseUp={(event) => {
                  if (onMouseUp !== undefined) onMouseUp(event);
                }}
                key={`mm ${columnIndex} ${rowIndex}`}
                id={`mm ${columnIndex} ${rowIndex}`}
                ref={(ref) => {
                  if (fieldRefs !== undefined)
                    fieldRefs[`c${columnIndex}r${rowIndex}`] = ref;
                }}
                content={content as string}
                onClick={(button) => {
                  if (fieldLeftClick !== undefined) fieldLeftClick(button);
                }}
              >
                {content as string}
              </S.MineButton>
            ))}
          </S.ColumnDiv>
        ))}
      </S.WrapperDiv>
    </S.MatrixWrapperDiv>
  );
};

// Como os sets estão no componente pai, usando o React.memo, este componente sabe que não precisa se rerenderizar lá
export default React.memo(MinesDivMatrix);
