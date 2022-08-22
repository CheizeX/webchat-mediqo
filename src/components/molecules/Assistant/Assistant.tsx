import React, { FC } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
  MdOutlineSupportAgent,
  MdOutlineNotificationsNone,
  MdNotificationsOff,
} from 'react-icons/md';
import { webchatProps } from '../../WebChat/webchat.interface';
import { AnimationSvg } from '../AnimationSvg/Animation';
import AVATAR from '../../../assets/favicon_mediqo.png';

export const Assistant: FC<webchatProps> = function ({
  handleCollapse,
  agentName,
  base64Avatar,
  isSoundIconActive,
  setIsSoundIconActive,
  activeSound,
}) {
  return (
    <div className="assistant__ewc-class">
      <AnimationSvg />
      {agentName === '' ? (
        <div className="avatar__ewc-class">
          <img
            // src={`data:image/svg+xml;base64,${base64Avatar}`}
            src={AVATAR}
            className="avatar-img__ewc-class"
            alt="avatar"
          />
        </div>
      ) : (
        <MdOutlineSupportAgent className="assistant-image__ewc-class" />
      )}
      <div className="titles-container__ewc-class">
        {agentName === '' ? (
          <>
            <h1 className="assistant-name__ewc-class" title={processEnv.name}>
              {processEnv.name}
            </h1>
            <p
              className="assistant-title__ewc-class"
              title={processEnv.description}>
              {processEnv.description}
            </p>
          </>
        ) : (
          <>
            <h1 className="assistant-name__ewc-class" title={agentName}>
              {agentName}
            </h1>
            <p className="assistant-title__ewc-class">Agente</p>
          </>
        )}
      </div>
      {activeSound && (
        <button
          className="sound-bell-button__ewc-class"
          type="button"
          onClick={() => setIsSoundIconActive(!isSoundIconActive)}>
          {isSoundIconActive ? (
            <MdOutlineNotificationsNone className="sound-bell_ewc-class" />
          ) : (
            <MdNotificationsOff className="sound-bell_ewc-class" />
          )}
        </button>
      )}
      <div className="header-button-conatiner__ewc-class">
        <button
          type="button"
          className="colapse-button__ewc-class"
          onClick={handleCollapse}>
          <IoMdClose color="white" size="24px" />
        </button>
      </div>
    </div>
  );
};
