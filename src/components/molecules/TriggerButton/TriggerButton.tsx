/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { CgMoreO } from 'react-icons/cg';
import { webchatProps } from '../../WebChat/webchat.interface';
import AVATAR from '../../../assets/favicon_mediqo.png';

export const TriggerButton: FC<webchatProps> = function ({
  handleCollapse,
  isCollapsed,
  agentName,
  // base64Avatar,
  events,
}) {
  return (
    <div
      className={
        !isCollapsed ? 'button-trigger-container__ewc-class' : 'hidden'
      }>
      <button
        type="button"
        className="button-trigger__ewc-class"
        onClick={handleCollapse}>
        {agentName === '' ? (
          <img
            // src={`data:image/svg+xml;base64,${base64Avatar}`}
            src={AVATAR}
            className="avatar-img__ewc-class"
            alt="avatar"
          />
        ) : (
          <MdOutlineSupportAgent className="assistant-trigger__ewc-class" />
        )}
      </button>
      {events !== '' && (
        <CgMoreO className="notification-trigger-button__ewc-class" />
      )}
    </div>
  );
};
