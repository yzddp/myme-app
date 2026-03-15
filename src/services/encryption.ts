/**
 * MyMe App - Encryption Service
 * 加密服务 - AES-256-CBC 加密解密
 */

import CryptoJS from 'crypto-js';
import { storage } from '../utils/storage';

// 加密密钥存储key
const ENCRYPTION_KEY_STORAGE = 'encryptionKey';

// 密钥长度（256位）
const KEY_SIZE = 256;

// IV长度（128位）
const IV_SIZE = 128;

// 迭代次数
const ITERATIONS = 10000;

/**
 * 生成随机加密密钥
 * @returns 32字节的密钥（Base64编码）
 */
export const generateKey = (): string => {
  const key = CryptoJS.lib.WordArray.random(32);
  return key.toString(CryptoJS.enc.Base64);
};

/**
 * 从存储获取密钥，如果不存在则生成
 * @returns 加密密钥
 */
export const getOrCreateKey = (): string => {
  let key = storage.getString(ENCRYPTION_KEY_STORAGE);
  
  if (!key) {
    key = generateKey();
    storage.set(ENCRYPTION_KEY_STORAGE, key);
  }
  
  return key;
};

/**
 * 加密数据
 * @param text 明文
 * @param key 密钥（可选，默认使用存储的密钥）
 * @returns 加密后的字符串（格式: iv:encrypted）
 */
export const encryptData = (text: string, key?: string): string => {
  const encryptionKey = key || getOrCreateKey();
  
  // 将Base64密钥转换为WordArray
  const keyWordArray = CryptoJS.enc.Base64.parse(encryptionKey);
  
  // 生成随机IV
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // 加密
  const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  // 组合IV和密文（IV:密文格式）
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  const cipherBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  
  return `${ivBase64}:${cipherBase64}`;
};

/**
 * 解密数据
 * @param encryptedText 加密字符串（格式: iv:encrypted）
 * @param key 密钥（可选，默认使用存储的密钥）
 * @returns 解密后的明文
 */
export const decryptData = (encryptedText: string, key?: string): string => {
  const encryptionKey = key || getOrCreateKey();
  
  // 分离IV和密文
  const parts = encryptedText.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const ivBase64 = parts[0];
  const cipherBase64 = parts[1];
  
  // 转换回WordArray
  const keyWordArray = CryptoJS.enc.Base64.parse(encryptionKey);
  const ivWordArray = CryptoJS.enc.Base64.parse(ivBase64);
  const cipherParams = CryptoJS.enc.Base64.parse(cipherBase64);
  
  // 创建CipherParams对象
  const cipher = CryptoJS.lib.CipherParams.create({
    ciphertext: cipherParams,
  });
  
  // 解密
  const decrypted = CryptoJS.AES.decrypt(cipher, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * 加密日记内容
 * @param content 日记内容
 * @returns 加密后的内容
 */
export const encryptDiaryContent = (content: string): string => {
  return encryptData(content);
};

/**
 * 解密日记内容
 * @param encryptedContent 加密的日记内容
 * @returns 解密后的内容
 */
export const decryptDiaryContent = (encryptedContent: string): string => {
  // 如果内容看起来不是加密的（原文中包含特殊字符），直接返回
  if (!encryptedContent.includes(':')) {
    return encryptedContent;
  }
  
  try {
    return decryptData(encryptedContent);
  } catch {
    // 解密失败，返回原内容
    return encryptedContent;
  }
};

/**
 * 加密消息内容
 * @param content 消息内容
 * @returns 加密后的内容
 */
export const encryptMessageContent = (content: string): string => {
  return encryptData(content);
};

/**
 * 解密消息内容
 * @param encryptedContent 加密的消息内容
 * @returns 解密后的内容
 */
export const decryptMessageContent = (encryptedContent: string): string => {
  // 如果内容看起来不是加密的，直接返回
  if (!encryptedContent.includes(':')) {
    return encryptedContent;
  }
  
  try {
    return decryptData(encryptedContent);
  } catch {
    return encryptedContent;
  }
};

/**
 * 验证密钥是否有效
 * @param key 要验证的密钥
 * @returns 是否有效
 */
export const validateKey = (key: string): boolean => {
  try {
    // 尝试用密钥加密和解密测试字符串
    const testText = 'test_key_validation';
    const encrypted = encryptData(testText, key);
    const decrypted = decryptData(encrypted, key);
    return decrypted === testText;
  } catch {
    return false;
  }
};

/**
 * 清除存储的密钥（谨慎使用）
 */
export const clearKey = (): void => {
  storage.delete(ENCRYPTION_KEY_STORAGE);
};

// 导出默认对象
export const encryptionService = {
  generateKey,
  getOrCreateKey,
  encryptData,
  decryptData,
  encryptDiaryContent,
  decryptDiaryContent,
  encryptMessageContent,
  decryptMessageContent,
  validateKey,
  clearKey,
};

export default encryptionService;
