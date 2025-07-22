export const pswDict_S = [
  "你",
  "我",
]
export const pswDict_V = [
  "操",
  "爱",
  "给了",
]
export const pswDict_O = [
  "傻逼吧",
  "傻逼",
  "你妈",
  "他妈",
  "他"
]
// 使用 Web Crypto API 实现 SHA-256 哈希算法
async function hashIndex(value: number, arrayLength: number): Promise<number> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toString()); // 将输入值转换为 Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data); // 生成 SHA-256 哈希
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 转换为字节数组
  const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // 转换为十六进制字符串
  const intValue = parseInt(hex.slice(0, 8), 16); // 截取前8位并转换为整数
  return intValue % arrayLength; // 映射到数组索引范围
}

export default async function calcTodayPsw() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 月份从0开始
  const date = today.getDate();

  // 合成一个唯一的数字
  const combinedDate = parseInt(`${year}${month.toString().padStart(2, "0")}${date.toString().padStart(2, "0")}`, 10);

  // 使用哈希函数计算索引
  const psw_S = pswDict_S[await hashIndex(combinedDate, pswDict_S.length)];
  const psw_V = pswDict_V[await hashIndex(combinedDate, pswDict_V.length)];
  const psw_O = pswDict_O[await hashIndex(combinedDate, pswDict_O.length)];

  return `${psw_S}${psw_V}${psw_O}`;
}