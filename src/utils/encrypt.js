import CryptoJS from 'crypto-js';

export const EncryptMessage = (message, secret) => {
  return CryptoJS.AES.encrypt(message, secret).toString();
};
