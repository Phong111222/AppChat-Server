import CryptoJS from 'crypto-js';

export const EncryptMessage = (message, secret) => {
  return CryptoJS.AES.encrypt(message, secret).toString();
};
export const DecryptMessage = (message, roomId) => {
  const bytes = CryptoJS.AES.decrypt(message, `${roomId} tienphong24031999`);
  return bytes.toString(CryptoJS.enc.Utf8);
};
