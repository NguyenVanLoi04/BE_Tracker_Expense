import { parsePhoneNumber } from 'awesome-phonenumber';
import crypto from 'crypto';
import forge from 'node-forge';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fisher-Yates Shuffle.
 * Warning: Array input will be restructured randomly
 */
export const shuffle = <T = any>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    const temp = array[randomIndex];
    array[randomIndex] = array[currentIndex];
    array[currentIndex] = temp;
  }

  return array;
};

/**
 * Generate random number in range, inclusive min, exclusive max
 */
export function genRandomNumber(min: number, max: number, isDecimal?: boolean) {
  let result = Math.random() * (max - min) + min;
  if (!isDecimal) result = Math.floor(result);
  return result;
}

export function genRandomString(length: number) {
  const base = uuidv4().replace(/-/g, '') + Date.now().toString(36);
  const randomPart = base
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .slice(0, length);

  return randomPart.toUpperCase();
}

export function genEvoucherCode(externalCode: string, newestCode: string) {
  if (!newestCode) {
    return `${externalCode}000001`;
  }

  const numberPart = newestCode.slice(externalCode.length);
  const nextNumber = (parseInt(numberPart, 10) || 0) + 1;

  const nextNumberStr = String(nextNumber).padStart(6, '0');

  return `${externalCode}${nextNumberStr}`;
}

export function getCurrentUnixTimestamp(date?: Date) {
  if (date) {
    return Math.floor(date.valueOf() / 1000);
  } else {
    return Math.floor(Date.now() / 1000);
  }
}

/**
 * @param amount amount number to generate
 * @param min lower limit
 * @param max upper limit
 * @returns list of random unique numbers
 */
export function genListUniqueRandomNumber(
  amount: number,
  min: number,
  max: number,
) {
  const result = new Set<number>();

  while (result.size < amount) {
    const randomNumb = genRandomNumber(min, max, false);
    result.add(randomNumb);
  }

  return result;
}

export const camelToSnakeCase = (str: string) => {
  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  );
};

export function isNullOrUndefined(obj: any) {
  if (typeof obj === 'undefined' || obj === null) return true;
  return false;
}

export function getPhoneE164(
  phone: string,
  regionCode = 'VN',
): string | undefined {
  const phoneNumber = parsePhoneNumber(phone, { regionCode });

  return phoneNumber.possible ? phoneNumber.number.e164 : phone;
}

/**
 * Synchronize sortArr's order to originArr's order in-place
 */
export function syncArrayPos(
  originArr: object[],
  sortArr: object[],
  field = 'id',
) {
  sortArr.sort((a, b) =>
    originArr.findIndex((item) => item[field] === a[field]) <
    originArr.findIndex((item) => item[field] === b[field])
      ? -1
      : 1,
  );
}

// Split array to smaller arrays
// Exp: [1,2,3,4] => [ [1,2] , [3,4] ]
export function chunk<T = any>(input: T[], size: number): T[][] {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
}

export function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
}

export function randomEnum<T>(_enum: T): T[keyof T] {
  const enumValues = Object.values(_enum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export function genRandomAlphabetToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('base64').replace(/\W/g, '');
}

export function randomArray<T>(arr: T[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function genSlug(str: string) {
  const now = new Date();
  str += '-';
  str += Math.floor(now.getTime() / 1000);
  return slugify(str, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  });
}

export function calculateHMacSHA256(
  data: string,
  key: string,
  encoding: crypto.BinaryToTextEncoding = 'hex',
) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest(encoding);
}

export function decryptRSA(
  base64EncryptedText: string,
  privateKeyPem: string,
  keySize = 1024,
) {
  try {
    if (!base64EncryptedText || !privateKeyPem) {
      return null;
    }

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Calculate block size
    const keySizeBytes = keySize / 8;
    const base64BlockSize =
      keySizeBytes % 3 !== 0
        ? Math.floor(keySizeBytes / 3) * 4 + 4
        : (keySizeBytes / 3) * 4;
    const iterations = Math.ceil(base64EncryptedText.length / base64BlockSize);

    let resultBytes = '';

    for (let i = 0; i < iterations; i++) {
      const start = i * base64BlockSize;
      const blockLength = Math.min(
        base64BlockSize,
        base64EncryptedText.length - start,
      );
      const block = base64EncryptedText.substr(start, blockLength);

      // Decode Base64
      const encryptedBytes = forge.util.decode64(block);

      // Decrypt
      const decryptedBytes = privateKey.decrypt(
        encryptedBytes.split('').reverse().join(''),
        'RSAES-PKCS1-V1_5',
      );

      resultBytes += decryptedBytes;
    }

    // Convert to UTF-8
    const decryptedText = forge.util.decodeUtf8(resultBytes);

    return decryptedText;
  } catch (err) {
    return null;
  }
}
