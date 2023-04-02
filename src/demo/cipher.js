import getProcessedStr from '../cipher/vigenere';

const transedStr = 'uooc cuw tapn lq, zpa hrbi lsq su.';
const origStr = 'lao ban dai shang wo !'; // nho jka rwa uoavq jc !

console.log(getProcessedStr(false, transedStr));
console.log(getProcessedStr(true, origStr));
