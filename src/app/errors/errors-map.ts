export const spanishErrorMessages: { [key: string]: string } = {
    400: 'Bad Request: The request was malformed or invalid.',
};
  

function getErrorMessage(code :string): string{
    const message = spanishErrorMessages[code];
    if (message) {
      return message;
    }   
    return "SUcedio un error";
}