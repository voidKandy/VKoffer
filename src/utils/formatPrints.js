import { blue, magenta, green, yellow, cyan } from "colorette"

export function centerPrint(str, color = null) {
  const consoleWidth = process.stdout.columns;
  const strWidth = str.length;
  const padding = Math.floor((consoleWidth - strWidth) / 2);

  if (color) {
    console.log('\x1b[' + padding + 'G' + color(str));
  } else {
    console.log('\x1b[' + padding + 'G' + str);
  }
};
