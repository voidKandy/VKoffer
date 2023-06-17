# VKoffer
What started as a basic password and API key manager is now also an AI assistant that runs completely on the command line.

As an experiment I tried to have as little dependencies as possible.

As of right now, the copy to clipboard functionality only works on Mac or Linux.

## Getting Started
After cloning the repo, cd into it and run:
`npm i -g`

You now have access to ***vkoffer***!

#### Setting up .env
Create a `.env` file and fill out all fields in `.env-example` for full functionality
The password manager will work without any environment variables, but that's no fun

#### Embedding a directory
Just run `vkoffer walk <path/to/directory>` to recursively embed any text based files in a directory

## Language interface
To open the language interface run `vkoffer lui`

run terminal commands from the lui by prepending anything with `!`

Ask questions about the currently Vector Embedded directory by prepending with `~`

## Adding password data and interacting with passwords
If you use google chrome, export a Passwords.csv file to use any passwords chrome has already stored for you.

All keys and passwords are saved encrypted in .jsons, make sure to create an `ENCRYPTION_KEY` in `.env`

`vkoffer import <path-to-csv>` will read all you data into a json

As of right now there are 5 commands:
1. `q <string>` where string is the website you want your password to
2. `k <string>` where string service you want your API key to
2. `import <path-to-csv>` see above
3. `add` to manually add data
4. `remove` to manually remove data by user (WIP)
5. `+key` to add to the special keys.json (More API key features coming soon)
