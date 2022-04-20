/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import Warning from '../../../../assets/warning.svg';
import { webchatProps } from '../../../WebChat/webchat.interface';

export const OutOfHourWarningComponent: FC<webchatProps> = function ({
  setOutOfHourWarning,
}) {
  return (
    <div className="out-of-hour__ewc-class">
      <div>
        <img src={Warning} alt="out of hour" />
      </div>
      <h1>FUERA DE HORARIO</h1>
      <span>
        Ahora no podemos atenderte. Comunícate dentro de nustro horario de
        atención.
      </span>
      <span>Muchas gracias.</span>
      <button
        className="button-close-out-of-our__ewc-class"
        type="button"
        onClick={() => setOutOfHourWarning(false)}>
        OK
      </button>
    </div>
  );
};
