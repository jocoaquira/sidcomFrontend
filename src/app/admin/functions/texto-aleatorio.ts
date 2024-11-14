export class TextoAleatorio {
    // Método para generar una cadena aleatoria asegurando mayúsculas, minúsculas y números
    static generarCadenaSegura(length: number): string {
      const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const allCharacters = upperCase + lowerCase + numbers;

      // Garantizar al menos un carácter de cada tipo
      let result = upperCase[Math.floor(Math.random() * upperCase.length)] +
                   lowerCase[Math.floor(Math.random() * lowerCase.length)] +
                   numbers[Math.floor(Math.random() * numbers.length)];

      // Completar el resto de la cadena
      for (let i = result.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        result += allCharacters[randomIndex];
      }

      // Mezclar la cadena para evitar patrones predecibles
      return result.split('').sort(() => Math.random() - 0.5).join('');
    }
  }
