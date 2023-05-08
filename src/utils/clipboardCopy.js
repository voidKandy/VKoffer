import { spawn } from 'child_process';

async function copyToClipboard(text) {
  const copyCommand = spawn('sh', ['-c', `echo "${text}" | pbcopy`]);

  copyCommand.on('error', (err) => {
    console.error('Error copying text to clipboard: ', err);
  });

  copyCommand.on('close', (code) => {
    if (code === 0) {
      // console.log('Text copied to clipboard');
    } else {
      console.error('Failed to copy text to clipboard');
    }
  });
}

export { copyToClipboard }; 
