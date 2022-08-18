import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { Message } from '../shared';
import { OutOfHourWarningComponent } from '../molecules/InformationMessages/OutOfHourWarning/OutOfHourWarning';
import { Assistant } from '../molecules/Assistant/Assistant';
import { ChatBox } from '../molecules/ChatBox/ChatBox';
import { InputsBox } from '../molecules/InputsBox/InputsBox';
import { ChatBoxForm } from '../molecules/ChatBox/ChatBoxForm';
import { TriggerButton } from '../molecules/TriggerButton/TriggerButton';
import { FinishedConversation } from '../molecules/InformationMessages/FinishedConversation/FinishedConversation';
import { BusyAgents } from '../molecules/InformationMessages/BusyAgents/BusyAgents';
import { BotBox } from '../molecules/BotBox/BotBox';
import { initialMessage, suggestionsObjNew } from '../extra';
import { webchatProps } from './webchat.interface';
import { Confirmation } from '../molecules/InformationMessages/Confirmation/Confirmation';
import NotificationSound from '../../assets/sounds/income_message_1.mp3';

export const WebChat: FC<webchatProps> = function () {
  const [socket, setSocket] = useState(null);
  const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [formValues, setFormValues] = useState({
    name: sessionStorage.getItem('webchat_elipse_name') || '',
    email: sessionStorage.getItem('webchat_elipse_email') || '',
    phone: sessionStorage.getItem('webchat_elipse_phone') || '',
    address: sessionStorage.getItem('webchat_elipse_address') || '',
    dni: sessionStorage.getItem('webchat_elipse_dni') || '',
    rut: sessionStorage.getItem('webchat_elipse_rut') || '',
  });
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [uploadActive, setUploadActive] = useState(false);
  const [outOfHourWarning, setOutOfHourWarning] = useState(false);
  const [outOfHourMessage, setOutOfHourMessage] = useState('');
  const [conversationFinished, setConversationFinished] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [busyAgents, setBusyAgents] = useState(false);
  const [agentName, setAgentName] = useState(
    sessionStorage.getItem('webchat_elipse_agent_name') || '',
  );
  const [svgI, setSvgI] = useState('');
  const [svgBack, setSvgBack] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggleBotWithAgent, setToggleBotWithAgent] = useState(
    suggestionsObjNew.length < 1 || false,
  );
  const [automatedMessages, setAutomatedMessages] = useState<Message[]>(
    !sessionStorage.getItem('chatId') && initialMessage,
  );
  const [formFieldsAndAutomatedMessages, setFormFieldsAndAutomatedMessages] =
    useState<Message[]>([]);
  const [configData, setConfigData] = useState<any>('');
  const [isSoundIconActive, setIsSoundIconActive] = useState(true);
  const [events, setEvents] = useState<string>('');

  const audio = new Audio(NotificationSound || configData.notificationSound);
  const audioPlayer = useRef(audio);
  const playAudio = async () => {
    await audioPlayer.current.play();
  };

  const getAvatar = useCallback(async () => {
    const { data } = await axios.get(processEnv.avatar);
    setSvgI(data);
  }, []);

  const getAllImages = useCallback(async () => {
    setLoading(true);
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `${processEnv.restUrl}/webchat/webchatFiles/icons`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios(axiosConfig);
      setSvgBack(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getConfigData = useCallback(async () => {
    setLoading(true);
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `${processEnv.restUrl}/settings/webchat?companyId=${processEnv.companyId}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios(axiosConfig);
      setConfigData(data.result.webchatConfig);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMessages = useCallback(
    async (idChat) => {
      try {
        const axiosConfig: AxiosRequestConfig = {
          url: `${processEnv.restUrl}/webchat/getConversation/${idChat}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios(axiosConfig);
        if (response.data.success) {
          setMessages(response.data.result);
        } else {
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [setMessages],
  );

  const handleCollapse = async () => {
    setEvents('');
    setIsCollapsed(!isCollapsed);
  };

  const handleSendMessage = useCallback(
    async (botInteractedMessages?: Message[]) => {
      if (socket.connected) {
        setChatInputDialogue('');
        // Objeto para el valor del input
        const bodyObject: Message = {
          content: chatInputDialogue,
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };
        // Objeto para el contenido de la interacción con el bot
        const bodyObjectArray = {
          content: botInteractedMessages || chatInputDialogue,
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };

        try {
          setSendingMessage(true);
          const axiosConfig: AxiosRequestConfig = {
            url: `${processEnv.restUrl}/webchat/sendMessageToAgent`,
            method: 'post',
            data: sessionStorage.getItem('chatId')
              ? bodyObject
              : bodyObjectArray,
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              chatId: sessionStorage.getItem('chatId'),
              companyId: processEnv.companyId,
            },
          };

          const response = await axios(axiosConfig);
          if (response.data.success) {
            if (response?.data?.result?._id) {
              sessionStorage.setItem('chatId', response.data.result._id);
              socket.emit(
                'joinWebchatUser',
                response.data.result.client.clientId,
              );
              setMessages(response.data.result.messages);
              sessionStorage.removeItem('allAgentsBusy');
              sessionStorage.removeItem('outOfHour');
            } else {
              sessionStorage.removeItem('allAgentsBusy');
              sessionStorage.removeItem('outOfHour');
              setMessages(response.data.result);
            }
          } else if (response?.data.errorMessage) {
            const errorMess = response.data.errorMessage;
            const ailaliaError = response.data.ailaliaErrorCode;

            if (errorMess === 'Agents not available') {
              sessionStorage.setItem('allAgentsBusy', 'true');
              setBusyAgents(true);
              setMessages(response.data.chat.messages);
              sessionStorage.setItem('chatId', response.data.chat._id);
            }

            if (ailaliaError === 'Out of time') {
              setOutOfHourMessage(
                errorMess === 'Not setted'
                  ? 'En este momento no podemos atenderte, por favor comunícate dentro de nuestro horario de atención, muchas gracias.'
                  : errorMess,
              );
              sessionStorage.setItem('outOfHour', 'true');
              setOutOfHourWarning(true);
            }
          } else {
            Swal.fire({
              title:
                'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
              confirmButtonText: 'OK',
              confirmButtonColor: processEnv.mainColor,
              customClass: {
                popup: 'animated animate__fadeInDown',
              },
            });
          }
          setSendingMessage(false);
        } catch (error) {
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
          setSendingMessage(false);
        }
      } else {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [
      chatInputDialogue,
      socket,
      setMessages,
      setChatInputDialogue,
      setSendingMessage,
      setBusyAgents,
    ],
  );

  useEffect(() => {
    if (isSoundIconActive) {
      audioPlayer.current = audio;
    } else {
      audioPlayer.current = null;
    }
  }, [isSoundIconActive]);

  useEffect(() => {
    if (sessionStorage.getItem('chatId')) {
      const idChat = sessionStorage.getItem('chatId');
      getMessages(idChat);
      setToggleBotWithAgent(true);
    }
  }, [getMessages]);

  useEffect(() => {
    const socketConnection = io(processEnv.socketUrl);
    setSocket(socketConnection);
  }, [setSocket]);

  useEffect(() => {
    getAvatar();
  }, []);

  useEffect(() => {
    getAllImages();
  }, []);

  useEffect(() => {
    getConfigData();
  }, []);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('Webchat connected');
    });

    socket?.on('newMessageToWebchatUser', async (arg: Message[]) => {
      setEvents('newMessageToWebchatUser');
      setMessages(arg);
      if (audioPlayer.current) {
        await playAudio();
      }
    });

    socket?.on('finishConversationForWebchat', () => {
      setEvents('finishConversationForWebchat');
      setFormValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        dni: '',
        rut: '',
      });
      setMessages([]);
      sessionStorage.removeItem('chatId');
      sessionStorage.removeItem('webchat_elipse_name');
      sessionStorage.removeItem('webchat_elipse_email');
      sessionStorage.removeItem('webchat_elipse_agent_name');
      setConversationFinished(true);
      if (suggestionsObjNew.length > 0) {
        setToggleBotWithAgent(false);
      } else {
        setToggleBotWithAgent(true);
      }
      setAutomatedMessages(initialMessage);
      setAgentName('');
    });

    socket?.on('agentData', (data: { name: string; id: string }) => {
      setEvents('agentData');
      sessionStorage.setItem('webchat_elipse_agent_name', data.name);
      setAgentName(data.name);
      sessionStorage.removeItem('allAgentsBusy');
      setBusyAgents(false);
    });

    if (sessionStorage.getItem('webchat_elipse_email')) {
      socket?.emit(
        'joinWebchatUser',
        sessionStorage.getItem('webchat_elipse_email'),
      );
    }
  }, [socket]);

  return (
    <>
      {!loading && (
        <div className={isCollapsed ? 'chat-container__ewc-class' : 'hidden'}>
          {outOfHourWarning && (
            <OutOfHourWarningComponent
              setOutOfHourMessage={setOutOfHourMessage}
              outOfHourMessage={outOfHourMessage}
              setOutOfHourWarning={setOutOfHourWarning}
              svgBack={svgBack}
            />
          )}
          {conversationFinished && (
            <FinishedConversation
              setConversationFinished={setConversationFinished}
              handleCollapse={handleCollapse}
              svgBack={svgBack}
            />
          )}
          {busyAgents && (
            <BusyAgents
              setBusyAgents={setBusyAgents}
              svgBack={svgBack}
              handleSendMessage={handleSendMessage}
              automatedMessages={automatedMessages}
            />
          )}
          {confirmation && sessionStorage.getItem('chatId') && (
            <Confirmation
              setConfirmation={setConfirmation}
              svgBack={svgBack}
              handleSendMessage={handleSendMessage}
              automatedMessages={automatedMessages}
            />
          )}

          <Assistant
            handleCollapse={handleCollapse}
            agentName={agentName}
            base64Avatar={svgI}
            svgBack={svgBack}
            isSoundIconActive={isSoundIconActive}
            setIsSoundIconActive={setIsSoundIconActive}
            activeSound={configData?.activeSound}
          />

          {sessionStorage.getItem('webchat_elipse_name') &&
            sessionStorage.getItem('webchat_elipse_email') &&
            !sessionStorage.getItem('outOfHour') &&
            toggleBotWithAgent && (
              <>
                <ChatBox
                  isCollapsed={isCollapsed}
                  messages={messages}
                  agentName={agentName}
                  base64Avatar={svgI}
                  svgBack={svgBack}
                />
                <InputsBox
                  messages={messages}
                  uploadActive={uploadActive}
                  sendingMessage={sendingMessage}
                  chatInputDialogue={chatInputDialogue}
                  outOfHourWarning={outOfHourWarning}
                  setOutOfHourWarning={setOutOfHourWarning}
                  setUploadActive={setUploadActive}
                  setSendingMessage={setSendingMessage}
                  setChatInputDialogue={setChatInputDialogue}
                  setMessages={setMessages}
                  setBusyAgents={setBusyAgents}
                  socket={socket}
                  svgBack={svgBack}
                  handleSendMessage={handleSendMessage}
                />
              </>
            )}

          {!toggleBotWithAgent && suggestionsObjNew.length >= 1 && (
            <BotBox
              handleSendMessage={handleSendMessage}
              setToggleBotWithAgent={setToggleBotWithAgent}
              automatedMessages={automatedMessages}
              setAutomatedMessages={setAutomatedMessages}
              base64Avatar={svgI}
              setFormFieldsAndAutomatedMessages={
                setFormFieldsAndAutomatedMessages
              }
            />
          )}

          {(!sessionStorage.getItem('webchat_elipse_name') ||
            !sessionStorage.getItem('webchat_elipse_email') ||
            sessionStorage.getItem('outOfHour')) &&
            toggleBotWithAgent && (
              <ChatBoxForm
                formValues={formValues}
                setFormValues={setFormValues}
                setSetingNameAndEmail={setSetingNameAndEmail}
                setMessages={setMessages}
                automatedMessages={automatedMessages}
                handleSendMessage={handleSendMessage}
                setOutOfHourWarning={setOutOfHourWarning}
                svgBack={svgBack}
                formFieldsAndAutomatedMessages={formFieldsAndAutomatedMessages}
              />
            )}

          <div className="footer__ewc-class">
            <a
              href="https://elipse.ai/elipse-chat/#preciosyplanes"
              target="_blank"
              className="footer-button"
              rel="noreferrer">
              Powered by Elipse
            </a>
          </div>
        </div>
      )}
      {!loading && (
        <TriggerButton
          events={events}
          setEvents={setEvents}
          base64Avatar={svgI}
          handleCollapse={handleCollapse}
          isCollapsed={isCollapsed}
          agentName={agentName}
          svgBack={svgBack}
        />
      )}
    </>
  );
};
