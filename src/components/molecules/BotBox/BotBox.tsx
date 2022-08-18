import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
} from 'react';
import { ReactSVG } from 'react-svg';
import { MdAssignmentReturn, MdOutlineSupportAgent } from 'react-icons/md';
import { SpinnerRoundFilled } from 'spinners-react';
import { GrFormClose } from 'react-icons/gr';
import { GiClick } from 'react-icons/gi';
import {
  ContentTypes,
  DERIVATIONS,
  FormProps,
  Message,
  MessageFrom,
  SuggestionsProps,
} from '../../shared';
import { suggestionsObjNew } from '../../extra';
import { webchatProps } from '../../WebChat/webchat.interface';
import { Forms } from '../BotForms/BotForms';

interface BotBoxProps {
  automatedMessages: Message[];
  setToggleBotWithAgent: Dispatch<SetStateAction<boolean>>;
  setAutomatedMessages: Dispatch<SetStateAction<Message[]>>;
  setFormFieldsAndAutomatedMessages: Dispatch<SetStateAction<Message[]>>;
}

export const BotBox: FC<webchatProps & BotBoxProps> = function ({
  automatedMessages,
  base64Avatar,
  setToggleBotWithAgent,
  setAutomatedMessages,
  setFormFieldsAndAutomatedMessages,
}) {
  const dialogueBoxRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [lastTime, setLastTime] = useState('');
  const [suggestions, setSuggestions] = useState(suggestionsObjNew);
  const [isFormActive, setIsFormActive] = useState(false);
  const [formFields, setFormFields] = useState<FormProps[]>([]);
  const [derivationFormName, setDerivationFormName] = useState('');

  const scrollToBottom = useCallback(() => {
    dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueBoxRef]);

  const addFormValuesToMessage = async () => {
    // acomodo los campos del FORM para transformarlos en mensajes
    const formValues = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {},
    );
    const fieldValues = Object.entries(formValues).map((key) => ({
      name: key[0],
      value: key[1],
    }));
    const fieldsToMessages = fieldValues.map((field) => {
      return {
        contentType: ContentTypes.TEXT,
        from: MessageFrom.USER,
        content: `${field.name}: ${field.value}`,
      };
    });

    // valido que el formulario sea enviado completo
    if (fieldValues.every((field) => field.value)) {
      // agrego los campos del FORM al resto de los mensajes en el componente padre
      setFormFieldsAndAutomatedMessages([
        ...automatedMessages,
        {
          contentType: ContentTypes.TEXT,
          from: MessageFrom.BOT,
          content: `Formulario [ ${derivationFormName} ]`,
        },
        ...fieldsToMessages,
      ]);

      setFormFields([]);
      setIsFormActive(false);
      setLoadingMessage(false);
      scrollToBottom();
      setToggleBotWithAgent(true);
    }
  };

  const handleDerivation = (derivation: DERIVATIONS) => {
    setAutomatedMessages([
      ...automatedMessages,
      {
        contentType: ContentTypes.TEXT,
        from: MessageFrom.BOT,
        content: 'Proceso de derivación hacia un agente',
      },
    ]);
    setTimeout(() => {
      setLoadingMessage(false);
      scrollToBottom();
      if (derivation === DERIVATIONS.AGENT) {
        setToggleBotWithAgent(true);
      }
    }, 2000);
  };

  const handleAutomatedMessages = (suggestion: any) => {
    const currentTime = new Date();
    localStorage.setItem('lastTime', JSON.stringify(currentTime.getTime()));

    // SI NO HAY OPCIONES, ENTONCES DEVUELVE EL RESTO DE LAS SUGERENCIAS EXCEPTO LA QUE ELIGIO EL USUARIO, DE LO CONTRARIO DEVUELVE UN ARRAY [] VACIO PARA QUE SOLO MUESTRE LAS OPCIONES Y NO EL RESTO DE LAS SUGERENCIAS
    const newSuggestions = !suggestion.options
      ? suggestion.subItems?.filter((item: any) => item)
      : [];

    if (newSuggestions) {
      setSuggestions(newSuggestions);
    } else {
      setSuggestions(
        suggestions.filter((item: any) => item.name !== suggestion.name),
      );
    }

    // VERIFICA SI HAY DERIVACIONES AL AGENTE O CON PREVIO FORMULARIO
    if (suggestion.derivation) {
      if (suggestion.derivation === DERIVATIONS.AGENT) {
        setLoadingMessage(true);
        handleDerivation(suggestion.derivation);
      }
      if (suggestion.derivation === DERIVATIONS.FORM) {
        setFormFields(suggestion.derivationForm);
        setDerivationFormName(suggestion.name);
        setIsFormActive(true);
      }
      return;
    }

    // AGREGA LA PREGUNTA
    if (suggestion.question) {
      setLoadingMessage(true);
      setTimeout(() => {
        setAutomatedMessages([
          ...automatedMessages,
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.USER,
            content: suggestion.name || '',
          },
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.BOT,
            content: suggestion.question || '',
          },
        ]);
        setLoadingMessage(false);
        scrollToBottom();
      }, 500);
    } else {
      setAutomatedMessages([
        ...automatedMessages,
        {
          contentType: ContentTypes.TEXT,
          from: MessageFrom.USER,
          content: suggestion.name || '',
        },
      ]);
    }

    // AGREGA LAS OPCIONES PARA ELEGIR DESPUED DE LA PREGUNTA
    if (!suggestion.subItems) {
      setLoadingMessage(true);
      setTimeout(() => {
        setAutomatedMessages([
          ...automatedMessages,
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.USER,
            content: suggestion.name || '',
            icon: suggestion.icon || '',
          },
          ...suggestion.options.map((option: any) => ({
            contentType: ContentTypes.TEXT,
            from: MessageFrom.BOT,
            content: option.text || '',
            icon: option.icon || '',
            link: option.link || '',
          })),
        ]);
        setLoadingMessage(false);
        scrollToBottom();
      }, 500);
      setLastTime(localStorage.getItem('lastTime'));
    }
  };

  useEffect(scrollToBottom, [
    scrollToBottom,
    automatedMessages,
    setSuggestions,
  ]);

  return (
    <div className="chat-box__bot-ewc-class">
      <div className="dialogues-box__bot-ewc-class">
        {/* MAPEO LO QUE CONTESTA EL BOT AL ELEGIR UNA OPCION */}
        {automatedMessages &&
          automatedMessages.map((message, index) =>
            message.from === MessageFrom.BOT ? (
              <Fragment key={index.toString()}>
                {/* SOLO CONTESTACIONES DEL BOT DEL LADO IZQUIERDO */}
                <div>
                  <div className="bot-dialogue__bot-ewc-class">
                    <div className="bot-image-container__bot-ewc-class">
                      {/* SI HAY UN ICONO DENTRO DE LA OPCION, SE PONE EL ICONO Y SINO EL AVATAR X DEFECTO */}
                      {message.icon ? (
                        <ReactSVG
                          className="bot-svg-and-icon__bot-ewc-class"
                          src={message.icon}
                        />
                      ) : (
                        <img
                          src={`data:image/svg+xml;base64,${base64Avatar}`}
                          className="avatar-chat__ewc-class"
                          alt="avatar"
                        />
                      )}
                    </div>

                    <div
                      className={
                        message.contentType === ContentTypes.ATTACHMENT
                          ? 'bot-text-container__bot-ewc-class clickable-bot__bot-ewc-class'
                          : 'bot-text-container__bot-ewc-class'
                      }>
                      {/* SI EL MENSAJE INCLUYE UN LINK, VA A SER CLICKEABLE EL DIALOGO DEL BOT Y ME VA A REDIRECCIONAR */}
                      {message.contentType === ContentTypes.TEXT &&
                        message.link && (
                          <a
                            className="bot-text-link__bot-ewc-class"
                            href={message.link}
                            target="_blank"
                            rel="noreferrer">
                            <GiClick size={24} />
                            {message.content}
                          </a>
                        )}

                      {/* SI EL MENSAJE NO INCLUYE EL LINK MUESTRA EL TEXTO */}
                      {message.contentType === ContentTypes.TEXT &&
                        !message.link && (
                          <span className="bot-text__bot-ewc-class">
                            {message.content}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment key={index.toString()}>
                {/* ELECCIONES DEL USUARIO DEL LADO DERECHO */}
                <div>
                  <div className="user-dialogue__bot-ewc-class">
                    <div
                      className={
                        message.contentType === ContentTypes.ATTACHMENT
                          ? 'user-dialogue-container__bot-ewc-class clickable-user__bot-ewc-class'
                          : 'user-dialogue-container__bot-ewc-class'
                      }>
                      {message.contentType === ContentTypes.TEXT &&
                        message.content}
                    </div>
                  </div>
                </div>
              </Fragment>
            ),
          )}

        {/* HORA DE LA ULTIMA INTERACCION REALIZADA POR EL USUARIO */}
        {lastTime && !loadingMessage && (
          <div className="auto-time__bot-ewc-class">
            {'Última interacción '}
            {new Date(
              JSON.parse(localStorage.getItem('lastTime')),
            ).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </div>
        )}

        {/* BOTONES CON LAS OPCIONES QUE ME DA EL BOT */}
        {!loadingMessage ? (
          <div className="automatized-text-container__bot-ewc-class">
            {suggestions.map((sugg, index) => (
              <button
                className="automatized-text__bot-ewc-class"
                key={index.toString()}
                type="button"
                onClick={() => {
                  handleAutomatedMessages(sugg as SuggestionsProps);
                }}>
                {/* {sugg.icon && (
                  <ReactSVG classNmae="svg-logo_ewc-class" src={sugg.icon} />
                )} */}
                {sugg.name}
              </button>
            ))}
            {isFormActive && (
              <div className="form-modal__bot-ewc-class">
                <div>
                  <div className="form-text-before__bot-ewc-class">
                    Datos necesarios para continuar
                    <button
                      type="button"
                      onClick={() => setIsFormActive(false)}>
                      <GrFormClose />
                    </button>
                  </div>
                  <div className="form-cont__bot-ewc-class">
                    <Forms
                      formFields={formFields}
                      setFormFields={setFormFields}
                    />
                    <button
                      type="button"
                      className="form-button__bot-ewc-class"
                      onClick={addFormValuesToMessage}>
                      Contactarme con un agente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BOTONES DE MENU PRINCIPAL Y CONTACTAR DIRECTO CON AGENTE AL FINAL DE LAS OPCIONES */}
            {JSON.stringify(suggestions) !==
              JSON.stringify(suggestionsObjNew) && (
              <>
                {/* BOTON DE MENU PRINCIPAL */}
                <button
                  className="automatized-text-back__bot-ewc-class"
                  type="button"
                  onClick={() =>
                    handleAutomatedMessages({
                      name: 'Menú Principal',
                      subItems: suggestionsObjNew,
                    })
                  }>
                  <MdAssignmentReturn />
                  Menú Principal
                </button>

                {/* BOTON DE CONTACTO DIRECTO CON UN AGENTE */}
                <button
                  className="automatized-text-go-with-agent__bot-ewc-class"
                  type="button"
                  onClick={() =>
                    handleAutomatedMessages({
                      name: 'Contactarme con un agente',
                      // subItems: suggestionsObjNew,
                      derivation: DERIVATIONS.AGENT,
                    })
                  }>
                  <MdOutlineSupportAgent />
                  ¿Necesitas ayuda?
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* LOADING DE MENSAJE */}
            <div className="spinner-before-suggestions__bot-ewc-class">
              <SpinnerRoundFilled
                size={25}
                thickness={120}
                speed={180}
                color={processEnv.mainColor}
              />
            </div>
          </>
        )}
        <div
          ref={dialogueBoxRef}
          style={{
            marginTop: '20px',
          }}
        />
      </div>
    </div>
  );
};
