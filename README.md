# In Memory Database

take-home project for devoted health implemented following TechAssignment.pdf requirements

# TODOS

- Add interface for Database
- Implement Database interface as InMemoryDatabase. First as psuedocode skeleton. Then method by method
- Setup prettier
- Setup eslint
- Setup ts-node to execute script
- Setup tsdoc https://typedoc.org/guides/doccomments/
- Setup mocha for testing. Consider testing both the CLI and the InMemoryDatabase.
- Setup code coverage tool like nyc or instabul
- Use commander to to implement CLI interface for InMemoryDatabase
- Migrate to Yarn 2 before submission https://yarnpkg.com/getting-started/migration (current project/guide uses yarn 1)
- Create a bash script to automate setup of all dependencies (would need to assume n is used for managing node)
- Consider implementing a main JS file with TSC build so this could be included as a library. `"main": "scripts/connectInMemory",`
- Create a video walk-through using OBS and capture sample output that mirrors requirement output.
- Create gitlab ci hook to run all development tasks (consolidate into a single CI task)

# Setup

- Clone this repository git@gitlab.com:EmmaJCline/in-memory-database.git
- Install the node version listed in package.json engines.node (14.15.4 at the time of submission). A popular tool for managing node versions is https://github.com/tj/n, but your operating system package manager would also work here.
- Install yarn 1.x which will be used as an alternative to npm https://classic.yarnpkg.com/en/docs/install
- Execute `yarn install` in the project directory

# Execution

Execute `yarn run connect-in-memory` in the project directory

# Development

- Execute `yarn run lint` in the project directory to lint all project files using https://eslint.org/.
- Execute `yarn run fix-lint` in the project directory to automatically fix all linting errors that can be automatically fixed.
- Execute `yarn run format` in the project directory to check the format for all project files using https://prettier.io/ and confirm it complies with the standard.
- Execute `yarn run fix-format` in the project directory to automatically fix the format of all files using https://prettier.io/.
- Execute `yarn run build` in the project directory to compile all https://www.typescriptlang.org/ project files using the tsconfig.json settings specified in the root of this repository into the /bin folder.
- Execute `yarn run test` in the project directory to run all the https://mochajs.org/ tests for the project.

Note that installing TypeScript, Mocha, EsLint, Prettier, and EditorConfig extensions for your editor automates the need to run these scripts. I use VSCode for example which supports all these.

# File Structure

- package.json contains a list of yarn scripts to develop the program and run it. It also specifies the libraries used and which version of node should be used to run the application.
- .yarnrc includes a single line that instructs the yarn package manager to install specific versions of libraries ensuring a consistent application across installs.
- .editorconfig configures code editor settings based on what the linters and formatters for this project expect. It is supported by a wide variety of code editors https://editorconfig.org/

# Decisions

- Yarn instead of npm: TODO
- TypeScript instead of JavaScript: TODO
- Class instead of function: TODO
- Why git and source control in general?: TODO
- Why linter and code formatter?: TODO

# Differences between working with git as an individual vs on a team

TODO: note how features would have been broken up in the project management tool of choice. Then PRS would be created for each feature and committed to a master branch. Since it is just me I kept it simple and committed as I went.
