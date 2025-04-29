export const spanishErrorMessages: { [key: string]: string } = {
    'EMPTY_FIELDS' : 'Verifique los campos vacíos',
    'PASSWORD_TO_SHORT' : 'La contraseña debe tener al menos 8 caracteres',
    'INVALID_EMAIL' : 'Ingrese un correo valido',
    'EMAIL_ALREADY_TAKEN' : 'El correo ya esta registrado',
    'NON_EXISTING_ACCOUNT' : 'La cuenta no existe',
    'INCORRECT_PASSWORD' : 'Contraseña incorrecta',
    'UNATHORIZED_TO_POST_PROPERTY' : 'No estas autorizado para publicar',
    'INVALID_DEPARTMENT' : 'Departamento invalido',
    'INVALID_PARAMETERS' : 'Verifique los parametros',
    'UNATHORIZED_TO_EDIT_PROPERTY' : 'No estas autorizado para editar',
    'UNABLE_TO_STORE_IMAGE' : 'No estas autorizado para publicar una foto',
    'FILE_NOT_FOUND' : 'El archivo no fue encontrado',
    'UNABLE_TO_SEND_EMAIL' : 'No se pudó enviar el correo de confirmacion',
    'PROPERTY_NOT_FOUND' : 'Propiedad no encontrada',
    'UNATHORIZED_TO_REQUEST' : 'No estas autorizado para realizar esta accion',
    'INVALID_SCHEDULE_DATES' : 'Fechas de reserva invalidas (verifique disponibilidad)',
    'REQUEST_NOT_FOUND' : 'La solicitud no fue encontrada',
    'UNABLE_TO_EDIT_REQUEST' : 'No se puedo editar la solicitud',
    'REQUEST_ISNT_IN_PAYMENT' : 'No puede pagar esta solicitud aun',
    'USER_IS_NOT_THE_REQUEST_ONE' : 'Usted no es el usuario de esta solicitud',
    'CANT_RATE_YET' : 'Aun no se puede calificar',
    'UNATHORIZED_TO_RATE' : 'No estas autorizado para calificar',
    'ALREADY_RATED' : 'Ya fue calificada',
    'INVALID_TOKEN' : 'INVALID_TOKEN', //INTERNAL ERROR, SO there's no need for a readable message
    'EXPIRED_TOKEN': 'EXPIRED_TOKEN', //same error code since I need it to refresh
};
  

export function getErrorMessage(code :string): string{
    const message = spanishErrorMessages[code];
    console.log(code)
    if (message) {
      return message;
    }   
    return "SUcedio un error";
}