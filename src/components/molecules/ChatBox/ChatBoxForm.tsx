import React, { FC, useState } from 'react';
import * as yup from 'yup';
import { formToInitConversation } from '../../formToInitConversation';
import { Message } from '../../shared';
import { webchatProps } from '../../WebChat/webchat.interface';

interface BotBoxProps {
  automatedMessages: Message[];
  formFieldsAndAutomatedMessages: Message[];
  handleSendMessage: (arg?: Message[]) => void;
}

export const ChatBoxForm: FC<webchatProps & BotBoxProps> = function ({
  automatedMessages,
  handleSendMessage,
  setSetingNameAndEmail,
  formFieldsAndAutomatedMessages,
  formValues,
  setFormValues,
}) {
  const [validationErrors, setValidationErrors] = useState('');

  const includedFields = formToInitConversation.map((field) => field.name);

  // <<< VALIDACIÓN DE INPUTS >>>
  const validationSchema = yup.object().shape({
    dni:
      includedFields.includes('dni') &&
      yup
        .string()
        .required('Debe completar todos los campos')
        .min(8, 'El DNI debe tener 8 caracteres como mínimo'),
    rut:
      includedFields.includes('rut') &&
      yup
        .string()
        .required('Debe completar todos los campos')
        .min(8, 'El RUT debe tener 8 caracteres como mínimo'),
    address:
      includedFields.includes('address') &&
      yup.string().required('Debe completar todos los campos'),
    phone:
      includedFields.includes('phone') &&
      yup.string().required('Debe completar todos los campos'),
    email:
      includedFields.includes('email') &&
      yup
        .string()
        .required('Debe completar todos los campos')
        .email('Debe introducir un Email válido'),
    name:
      includedFields.includes('name') &&
      yup
        .string()
        .required('Debe completar todos los campos')
        .min(3, 'El Nombre debe tener 3 caracteres como mínimo'),
  });

  const handleSendButton = async () => {
    try {
      await validationSchema.validate({
        email: formValues.email,
        name: formValues.name,
        phone: formValues.phone,
        address: formValues.address,
        dni: formValues.dni,
        rut: formValues.rut,
      });
      sessionStorage.setItem('webchat_elipse_name', formValues.name);
      sessionStorage.setItem('webchat_elipse_email', formValues.email);
      setSetingNameAndEmail(true);
      setValidationErrors('');
      if (includedFields.every((field) => formValues[field] !== '')) {
        if (!sessionStorage.getItem('chatId')) {
          if (formFieldsAndAutomatedMessages.length === 0) {
            handleSendMessage(automatedMessages);
          } else {
            handleSendMessage(formFieldsAndAutomatedMessages);
          }
        }
      }
    } catch (err) {
      setValidationErrors(err.errors[0]);
    }
  };

  const handleValues = (
    e: React.ChangeEvent<HTMLInputElement>,
    arg: string,
  ) => {
    setFormValues((prevState) => ({
      ...prevState,
      [arg]: e.target.value,
    }));
  };

  return (
    <div className="chat-box-without-name-and-RUT__ewc-class">
      <div className="without-header__ewc-class">
        <div className="without-welcome__ewc-class">Bienvenido!</div>
        <div className="without-information__ewc-class">
          Completa los siguientes campos para poder iniciar la comunicación con
          uno de nuestros agentes.
        </div>
      </div>
      <form className="without-body__ewc-class">
        <div className="without-body-inputs-box-container__ewc-class">
          {formToInitConversation.map((field) => (
            <input
              key={field.name}
              type={field.type}
              className={
                validationErrors.includes(field.name)
                  ? 'inp-control__ewc-class inp-control-error__ewc-class'
                  : 'inp-control__ewc-class'
              }
              placeholder={field.placeholder}
              onChange={(e) => handleValues(e, field.name)}
            />
          ))}
        </div>

        <p className="error-message__ewc-class">{validationErrors}</p>
        <button
          type="button"
          className="but-control__ewc-class"
          onClick={handleSendButton}>
          ENVIAR
        </button>
      </form>
    </div>
  );
};
