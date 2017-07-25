"use strict";

exports.onHandleCode = function(ev) {
  const classRe = /^\s*class\s+(\S+)\s+\{/gm;
  let code = ev.data.code;
  let classNames = [];
  let className = null;

  while((className = classRe.exec(code)) !== null) {
    classNames.push(className[1]);
  }

  classNames.forEach(name => {
    const re = new RegExp(`module\\.exports\\.${name} = ${name}`);
    code = code.replace(re, `export { ${name} }`);
  });

  ev.data.code = code;
};
