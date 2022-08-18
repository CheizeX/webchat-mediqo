import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { Message } from '../shared';

export interface webchatProps {
  fromId?: string;
  messages?: Message[];
  uploadActive?: boolean;
  sendingMessage?: boolean;
  chatInputDialogue?: string;
  socket?: Socket;
  validationErrors?: string;
  isCollapsed?: boolean;
  agentName?: string;
  base64Avatar?: string;
  svgBack?: any;
  automatedMessages?: Message[];
  outOfHourWarning?: boolean;
  formValues?: { [key: string]: string };
  outOfHourMessage?: string;
  isSoundIconActive?: boolean;
  activeSound?: boolean;
  events?: string;
  setEvents?: Dispatch<SetStateAction<string>>;
  setIsSoundIconActive?: Dispatch<SetStateAction<boolean>>;
  setOutOfHourMessage?: Dispatch<SetStateAction<string>>;
  setUploadActive?: Dispatch<SetStateAction<boolean>>;
  setOutOfHourWarning?: Dispatch<SetStateAction<boolean>>;
  setSendingMessage?: Dispatch<SetStateAction<boolean>>;
  setChatInputDialogue?: Dispatch<SetStateAction<string>>;
  setMessages?: Dispatch<SetStateAction<Message[]>>;
  setSetingNameAndEmail?: Dispatch<SetStateAction<boolean>>;
  setConversationFinished?: Dispatch<SetStateAction<boolean>>;
  setBusyAgents?: Dispatch<SetStateAction<boolean>>;
  setIsCollapsed?: Dispatch<SetStateAction<boolean>>;
  setFormValues?: Dispatch<SetStateAction<{ [key: string]: string }>>;
  handleCollapse?: () => void;
  handleSendMessage?: (arg?: Message[], texto?: string) => void;
}
