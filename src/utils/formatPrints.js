
export function centerPrint(str) {
  const consoleWidth = process.stdout.columns;
  const strWidth = str.length;
  const padding = Math.floor((consoleWidth - strWidth) / 2);
  console.log('\x1b[' + padding + 'G' + str); 
};
