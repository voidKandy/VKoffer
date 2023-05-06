const readline = require('readline');

function promptUser(question) {
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    interface.question(question, (answer) => {
      interface.close();
      resolve(answer.trim());
    });
  });
}

module.exports = { promptUser };
