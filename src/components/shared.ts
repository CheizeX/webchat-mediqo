/* eslint-disable no-restricted-syntax */
export enum Channels {
  WHATSAPP = 'WhatsApp',
  MESSENGER = 'Messenger',
  INSTAGRAM = 'Instagram',
  WEBCHAT = 'Webchat',
}
export enum ChatStatus {
  ASSIGNMENT_PENDING = 'ASSIGNMENT_PENDING',
  ON_CONVERSATION = 'ON_CONVERSATION',
  FINISHED = 'FINISHED',
}
export enum UserStatus {
  AVAILABLE = 'AVAILABLE',
  DISCONNECTED = 'DISCONNECTED',
  BATHROOM = 'BATHROOM',
  LUNCH = 'LUNCH',
  CALL = 'CALL',
  ALL = 'ALL',
}
export enum UserRole {
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}
export enum ChatFinishedStatus {
  SATISFACTORY = 'SATISFACTORY',
  UNSATISFACTORY = 'UNSATISFACTORY',
}
export enum StatusAgent {
  AVAILABLE = 'AVAILABLE',
  BATHROOM = 'BATHROOM',
  LUNCH = 'LUNCH',
}
export enum ContentTypes {
  TEXT = 'TEXT',
  ATTACHMENT = 'ATTACHMENT',
}
export type Tag = {
  _id?: string;
  name: string;
  color: string;
};
export enum MessageFrom {
  AGENT = 'AGENT',
  USER = 'USER',
  BOT = 'BOT',
}

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  tags: Tag[] | undefined;
  status?: UserStatus;
  urlAvatar?: string;
};

export type Client = {
  _id: string;
  clientId: string;
  name: string;
  profilePic?: string;
};

export type Message = {
  infoUser?: string;
  from?: string;
  content: string;
  name?: string;
  contentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  size?: string;
  _id?: string;
  mid?: string;
  isDeleted?: boolean;
  icon?: string;
  link?: string;
};

export type Chat = {
  _id: string;
  channel: Channels;
  client: Client;
  status: ChatStatus;
  companyId: string;
  fromLaravel: boolean;
  assignedAgent: User;
  messages: Message[];
  tags: Tag[];
  isTransfer: boolean;
  isPaused: boolean;
  unreadMessages: number;
  selected: boolean;
  createdAt: Date;
  updatedAt: Date;
  finishedStatus?: ChatFinishedStatus;
  feedback?: string;
};

export interface OptionsSuggestionsProps {
  icon?: string;
  link?: string;
  text?: string;
}
export interface SubItemsSuggestionsProps {
  icon?: string;
  link?: string;
  text?: string;
}
export enum DERIVATIONS {
  AGENT = 'agent',
  FORM = 'form',
  LINK = 'link',
}
export enum FormTypes {
  NAME = 'name',
  EMAIL = 'email',
  TEL = 'tel',
  ADDRESS = 'address',
  DNI = 'dni',
  RUT = 'rut',
  TEXT = 'text',
  NUMBER = 'number',
  PASSWORD = 'password',
}
export interface FormProps {
  name: string;
  type: FormTypes;
  placeholder?: string;
  value?: string;
}
export interface SuggestionsProps {
  icon?: string;
  name?: string;
  options?: OptionsSuggestionsProps[];
  subItems?: SubItemsSuggestionsProps[];
  question?: string;
  derivation?: DERIVATIONS;
  derivationLink?: string;
  derivationForm?: FormProps[];
}
