
/**
 * Simple MD5 implementation for Gravatar URLs (minimal for ESM)
 */

// Fix: Define rotateLeft as a standalone function instead of extending Math
function rotateLeft(v: number, s: number): number {
  return (v << s) | (v >>> (32 - s));
}

function md5(str: string): string {
  const k = [], s = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  let i, h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476;
  for (i = 0; i < 64; i++) k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  const words: number[] = [];
  const strLen = str.length;
  for (i = 0; i < strLen; i++) words[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
  words[strLen >> 2] |= 0x80 << ((strLen % 4) * 8);
  words[(((strLen + 8) >> 6) << 4) + 14] = strLen * 8;
  for (i = 0; i < words.length; i += 16) {
    let a = h0, b = h1, c = h2, d = h3, j, f, g;
    for (j = 0; j < 64; j++) {
      if (j < 16) { f = (b & c) | ((~b) & d); g = j; }
      else if (j < 32) { f = (d & b) | ((~d) & c); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
      else { f = c ^ (b | (~d)); g = (7 * j) % 16; }
      const temp = d;
      d = c;
      c = b;
      // Fix: Use the local rotateLeft function instead of Math.rotateLeft
      b = (b + rotateLeft(a + f + k[j] + (words[i + g] || 0), s[j])) | 0;
      a = temp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
  }
  return [h0, h1, h2, h3].map(v => (v < 0 ? v + 0x100000000 : v).toString(16).padStart(8, '0')).map(v => v.match(/../g)!.reverse().join('')).join('');
}

/**
 * Generates a Gravatar URL for a given email.
 * @param email - The user's email address
 * @param size - The desired image size (default 80)
 * @param defaultImg - Fallback image type (default 'mp' for mystery person)
 */
export const getGravatarUrl = (email: string, size: number = 80, defaultImg: string = 'mp'): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImg}&r=g`;
};
