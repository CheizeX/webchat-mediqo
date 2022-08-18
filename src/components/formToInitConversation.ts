import { FormTypes } from './shared';

// OBJETOS DE FORMULARIOS :  el array en el órden que se quieran mostrar los campos, se puede usar dentro del objeto del bot o en el fomulario para iniciar conversación

export const formToInitConversation = [
  {
    name: 'name',
    type: FormTypes.NAME,
    placeholder: 'Nombre Completo',
  },
  {
    name: 'email',
    type: FormTypes.EMAIL,
    placeholder: 'Email',
  },
  // {
  //   name: 'phone',
  //   type: FormTypes.TEL,
  //   placeholder: 'Teléfono',
  // },
  // {
  //   name: 'address',
  //   type: FormTypes.ADDRESS,
  //   placeholder: 'Domicilio',
  // },
  // {
  //   name: 'dni',
  //   type: FormTypes.DNI,
  //   placeholder: 'DNI',
  // },
  // {
  //   name: 'rut',
  //   type: FormTypes.RUT,
  //   placeholder: 'RUT',
  // },
];
