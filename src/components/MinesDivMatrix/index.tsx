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
  fieldHighligh?: FieldHighlighProp;
  matrixRefs?: FieldRefs;
  children: React.ReactNode;
}

// Função com tipo genérico:
// https://stackoverflow.com/questions/53958028/how-to-use-generics-in-props-in-react-in-a-functional-component
const MinesDivMatrix = <T,>({
  matrix,
  fieldLeftClick,
  fieldRightClick,
  fieldHighligh,
  matrixRefs,
  children,
}: DivMatrixMinesProps<T>): JSX.Element => {
  return (
    <S.MatrixWrapperDiv>
      {children}
      <S.WrapperDiv>
        {matrix.map((content, indexColumn) => (
          <S.ColumnDiv key={indexColumn}>
            {content.map((content, indexRow) => (
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
                key={`mm ${indexColumn} ${indexRow}`}
                id={`mm ${indexColumn} ${indexRow}`}
                ref={(ref) => {
                  if (matrixRefs !== undefined)
                    matrixRefs[`c${indexColumn}r${indexRow}`] = ref;
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

export default React.memo(MinesDivMatrix);
