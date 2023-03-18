import React, { useEffect, useRef, useState } from "react";
import * as S from "./style";

interface Props {
  start: boolean;
  timerCentiseconds: React.MutableRefObject<number>;
}

const MinesTimer = ({ start, timerCentiseconds }: Props): JSX.Element => {
  const [seconds, setSeconds] = useState<number>(0);
  const minutes: number = Math.floor(
    (timerCentiseconds.current % 360000) / 6000
  );
  const hours: number = Math.floor(
    (timerCentiseconds.current % 8640000) / 360000
  );

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        timerCentiseconds.current += 1;
        const toSetSeconds = Math.floor(
          (timerCentiseconds.current % 6000) / 100
        );
        if (toSetSeconds !== seconds && seconds < 60) setSeconds(toSetSeconds);
      }, 10);

      return function cleanup() {
        clearInterval(interval);
      };
    }
  }, [timerCentiseconds, seconds, start]);

  return (
    <S.MinesTimerDiv>
      <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </S.MinesTimerDiv>
  );
};

export default React.memo(MinesTimer);
