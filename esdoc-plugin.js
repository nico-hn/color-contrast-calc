"use strict";

exports.onHandleCode = function(ev) {
  const classRe = /^\s*class\s+(\S+)\s+\{/gm;
  const origCode = ev.data.code;
  let classNames = [];
  let className = null;

  while((className = classRe.exec(origCode)) !== null) {
    classNames.push(className[1]);
  }

  ev.data.code = classNames.reduce((code, name) => {
    const re = new RegExp(`module\\.exports\\.${name} = ${name}`);
    return code.replace(re, `export { ${name} }`);
  }, origCode);
};
