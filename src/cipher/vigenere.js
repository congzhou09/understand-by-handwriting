function genTransMap() {
  const endCharCode = 97 + 26;
  const retMap = {};
  for (let i = 97; i < endCharCode; i++) {
    const oneChar = String.fromCharCode(i);
    retMap[oneChar] = i - 97;
  }
  return retMap;
}

const transMap = genTransMap();
const key = 'chaiknows';
let keyIndex = 0;

function getProcessedChar(isForward, origChar) {
  if (!origChar.match(/[a-z]/)) {
    if (origChar.match(/[,.]/)) {
      keyIndex = 0;
    }
    return origChar;
  }

  const keyChar = key[keyIndex];
  const transedLen = transMap[keyChar];
  let origCharCode = origChar.charCodeAt();
  if (isForward) {
    origCharCode = origCharCode + transedLen;
    while (origCharCode >= 123) {
      origCharCode = origCharCode - 26;
    }
  } else {
    origCharCode = origCharCode - transedLen;
    while (origCharCode < 97) {
      origCharCode = origCharCode + 26;
    }
  }

  keyIndex = (keyIndex + 1) % key.length;
  return String.fromCharCode(origCharCode);
}

function getProcessedStr(isForward, transedStr) {
  let processedStr = '';
  keyIndex = 0;
  for (let i = 0; i < transedStr.length; i++) {
    processedStr += getProcessedChar(isForward, transedStr[i]);
  }
  return processedStr;
}

export default getProcessedStr;
