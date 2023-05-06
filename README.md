# VKoffer
A basic password and API key manager that runs completely on the command line.

This is a basic password manager I've made for fun, as an experiment I tried to have as little dependencies as possible.

As of right now, the copy to clipboard functionality only works on Mac or Linux.

## Getting Started
After cloning the repo, cd into it and run:
`npm i -g`

You now have access to ***vkoffer***!

If you use google chrome, export a Passwords.csv file to use any passwords chrome has already stored for you.

`vkoffer import <path-to-csv>` will read all you data into a json

As of right now there are 5 commands:
1. `q <string>` where string is the website you want your password to
2. `import <path-to-csv>` see above
3. `add` to manually add data
4. `remove` to manually remove data by user (WIP)
5. `+key` to add to the special keys.json (More API key features coming soon)


## Planned features
* Password generator
* API key favorites quick access
* More in depth removal
* Get on command line package manager 🤓
