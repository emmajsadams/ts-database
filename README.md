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
- Use commander to to implement CLI interface for InMemoryDatabase
- Explain how to install node with n
- Explain how to install yarn
- Consider implementing a main JS file with TSC build so this could be included as a library. `"main": "scripts/connectInMemory",`

# Setup

- Clone this repository git@gitlab.com:EmmaJCline/in-memory-database.git
- Install the node version listed in package.json engines.node (14.15.4 at the time of submission). A popular tool for managing node versions is https://github.com/tj/n, but your operating system package manager would also work here.
- Install yarn 1.x which will be used as an alternative to npm https://classic.yarnpkg.com/en/docs/install
- Execute `yarn install` in the project directory

# File Structure

- package.json contains a list of yarn scripts to develop the program and run it. It also specifies the libraries used and which version of node should be used to run the application.
- .yarnrc includes a single line that instructs the yarn package manager to install specific versions of libraries ensuring a consistent application across installs.

# Decisions

- Yarn instead of npm: TODO
- TypeScript instead of JavaScript: TODO
- Class instead of function: TODO
- Why git and source control in general?: TODO
- Why linter and code formatter?: TODO
