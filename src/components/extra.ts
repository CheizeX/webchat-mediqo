import {
  formulario1,
  formulario2,
  formulario3,
} from './molecules/Forms/formsToUse';
import { ContentTypes, DERIVATIONS, MessageFrom } from './shared';

export const initialMessage = [
  {
    contentType: ContentTypes.TEXT,
    from: MessageFrom.BOT,
    content: `¡Hola, estoy aquí para guiarte en los servicios de mediQo!
      Selecciona una de las siguientes opciones:`,
    // content: `Hola. ¿En qué podemos ayudarte?`,
  },
];

export const suggestionsObjNew = [
  // ----------------------- <MEDICO> -----------------------
  {
    name: 'Soy médico',
    // icon: HorasMedPresSVG,
    question: '¿Ya formas parte de nuestra red médica?',
    // derivation: DERIVATIONS.AGENT,
    subItems: [
      {
        name: 'Si',
        // icon: CamaraSVG,
        subItems: [
          {
            name: 'Tengo dudas de la facturación',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario3,
          },
          {
            name: 'No funciona mi plataforma',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario3,
          },
          {
            name: 'Necesito hablar con HELP DESK',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario3,
          },
        ],
      },
      {
        name: 'No',
        // icon: CamaraSVG,
        options: [
          {
            text: `Ir a Informes y registro`,
            icon: '',
            link: `https://medics.mediqo.com/join`,
          },
        ],
      },
    ],
  },

  // ----------------------- <PACIENTE> -----------------------

  {
    name: 'Soy paciente',
    // icon: MedicalSVG,
    question: '¿Qué necesitas?',
    subItems: [
      {
        name: 'Prueba COVID',
        // icon: SignpostSVG,
        subItems: [
          {
            name: 'PCR: $1350',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
          {
            name: 'Antígeno: $800',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
        ],
      },

      {
        name: 'Médico a domicilio $650',
        options: [
          {
            text: `Solicitar un médico a domicilio`,
            icon: '',
            link: `https://mediqo.com/create_service?serviceType=0`,
            derivation: DERIVATIONS.AGENT,
          },
        ],
      },

      {
        name: 'Asesoría Virtual $350',
        options: [
          {
            text: `Realizar una asesoría virtual`,
            icon: '',
            link: 'https://mediqo.com/create_service?serviceType=1',
          },
        ],
      },

      {
        name: 'Tuve problemas con mi servicio. Necesito AYUDA',
        // icon: OtrasConsultasSVG,
        derivation: DERIVATIONS.FORM,
        derivationForm: formulario1, // FORMULARIOS DEFINIDOS EN EL ARCHIVO "formsToUse.ts"
      },

      {
        name: 'Más información sobre nuestros servicios',
        subItems: [
          {
            name: `¿Cuáles son sus zonas de cobertura para servicios a domicilio?`,
            options: [
              {
                text: '1. Los Cabos | 2. Cancún | 3. Playa del Carmen | 4. Acapulco | 5. Chihuahua | 6. Tijuana | 7. Villahermosa | 8. Mexicalli | 9. Monterrey | 10. Apodaca | 11. San Pedro Garza García | 12. Escobedo | 13. Santa Catarina | 14. Guadalupe | 15. San Nicolás | 16. Guadalajara | 17. Zapopan | 18. Santiago de Querétaro | 19. Juriquilla | 20. Coacalco | 21. Ecatepec | 22. Cuautitlán | 23. Naucalpan | 24. Huixquilucan | 25. Cd. López Mateos | 26. Tecámac | 27. Tlalnepantla | 28. Toluca | 29. Nezahualcóyotl | 30. Puebla de Zaragoza | 31. Angelópolis | 32. Cholula | 33. Tlaxcalancingo | 34. Mérida | 35. Morelia |',
              },
            ],
          },
          {
            name: `¿En cuánto tiempo llegará el médico a mi docmicilio?`,
            options: [
              {
                text: `Aproximadamente 60-90 minutos.`,
              },
            ],
          },
          {
            name: `¿En cuánto tiempo estarán listos los resultados de mi prueba COVID-19?`,
            options: [
              {
                text: `Para las pruebas de antígenos, sabrá el resultado en unos 20-25 minutos, y el certificado le llegará por correo en 3 horas.`,
              },
              {
                text: `Para las pruebas PCR, el certificado junto con los resultados, se enviará en un paroximado de 12 horas.`,
              },
            ],
          },
          {
            name: `¿Puedo pedir atención de especialistas?`,
            options: [
              {
                text: `Para servicios a domicilio la red está conformada por médicos generales.`,
              },
              {
                text: `Sin embargo contamos con asesorías nutricionales y psicológicas de manera virtual`,
              },
            ],
          },
        ],
      },
    ],
  },
];
