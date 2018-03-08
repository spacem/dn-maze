function parameterize(str, params, messages) {
  if (!str) {
    return str;
  }

  if (params) {
    params = params.split(',').map((p) => {
      if (p.startsWith('{')) {
        return messages[p.substring(1, p.length - 1)];
      }

      return p;
    });
  }

  for (let i = 0; i < params.length; i += 1) {
    str = str.replace(`{${i}}`, params[i]);
  }

  let c = 0;
  let w = 0;
  let newStr = '';
  let startPos = 0;

  for (let i = 0; i < str.length - 1; i += 1) {
    switch (str.substr(i, 2)) {
      case '#y':
      case '#p':
      case '#r':
      case '#s':
      case '#v':
        if (c - w === 1) { // needed a closing </span>
          newStr += `${str.substring(startPos, i)}</span><span class="${str.substr(i + 1, 1)}">`;
        } else {
          newStr += `${str.substring(startPos, i)}<span class="${str.substr(i + 1, 1)}">`;
          c += 1;
        }

        startPos = i + 2;
        i += 1;
        break;
      case '#w':
        if (w === c) { // early #w
          newStr += str.substring(startPos, i);
        } else {
          newStr += `${str.substring(startPos, i)}</span>`;
          w += 1;
        }

        startPos = i + 2;
        i += 1;
        break;
      default:
        break;
    }
  }

  newStr += str.substr(startPos);

  if (c !== w) {
    newStr = `${newStr}</span>`;
  }

  return newStr.replace(/\\n/g, '<br />');
}

export default parameterize;
