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
- Change gitlab ci hook to use 14.15.4 and add this back to package.json `	"engines": { "node": "14.15.4"},`

# Setup

- Clone this repository git@gitlab.com:EmmaJCline/in-memory-database.git
- Install the node version listed in package.json engines.node (14.15.4 at the time of submission). A popular tool for managing node versions is https://github.com/tj/n, but your operating system package manager would also work here.
- Install yarn 1.x which will be used as an alternative to npm https://classic.yarnpkg.com/en/docs/install
- Execute `yarn install` in the project directory

# Execution

Execute `yarn run connect-in-memory` in the project directory

# Development

All yarn tasks listed below should be run in the project directory.

- `yarn run lint`: lint all project files using https://eslint.org/.
- `yarn run fix-lint`: automatically fix all linting errors that can be automatically fixed.
- `yarn run format`: check the format for all project files using https://prettier.io/ and confirm it complies with the standard.
- `yarn run fix-format`: automatically fix the format of all files using https://prettier.io/.
- `yarn run compile`: compile all https://www.typescriptlang.org/ project files using the tsconfig.json settings specified in the root of this repository into the /bin folder.
- `yarn run test`: run all the https://mochajs.org/ tests for the project.
- `yarn run build`: check lint rules, check format rules, compile the project, and run all tests. Used for GitLab CI builds.

Note that installing TypeScript, Mocha, EsLint, Prettier, and EditorConfig extensions for your editor automates the need to run these scripts. I use VSCode for example which supports all these.

# File Structure

- `lib` contains all reusable library code not intended to be run directly.
- `lib/executeCommand.ts` contains the function executeCommand to parse user input from the CLI database REPL.
- `lib/InMemoryDatabase.ts` contains the class implementing the in memory version of Database used in the CLI program.
- `scripts` contains all code focused on executing CLI programs that is not easily reusable.
- `scripts/connect.ts` contains code for connecting the executeCommand REPL to any Database implementation. String keys and values are used as the example specifies.
- `scripts/connectInMemory.ts` invokes connect for the InMemoryDatabase.
- `test` contains all tests for lib code.
- `test/createDatabaseSpec.ts` contains a generic createDatabaseSpec function that will test all public methods of a Database implementation. String keys and values are used for simplicity of testing.
- `test/InMemoryDatabase.spec.ts` invokes createDatabaseSpec with an InMemoryDatabase.
- `.editorconfig` configures code editor settings based on what the linters and formatters for this project expect using https://editorconfig.org/.
- `.eslintignore` configures which files for https://eslint.org/ to ignore.
- `.eslintrc.js` configures https://eslint.org/ with default settings for TypeScript as well as includes an optional rule for sorting imports.
- `.gitignore` ignores build artifacts not necessary to commit to the repo.
- `.gitlab-ci.yml` sets up a GitLab CI job on commit that runs all build verification tasks.
- `.npmrc` includes a single line that instructs the npm package manager to install specific versions of libraries ensuring a consistent application across installs. By default npm allows versions greater than the specified version to be used.
- `.nycrc` configures the test coverage tool https://github.com/istanbuljs/nyc.
- `.prettierignore` configures which files for https://prettier.io/ to ignore.
- `.prettierrc.js` configures the additional rules for the code formatter https://prettier.io/.
- `LICENSE.md` notes the license of the code repository.
- `package-lock.json` ensures all sub dependencies of dependencies use exact versions across installs. This ensures dependency consistency regardless of the machine.
- `package.json` contains a list of npm scripts to develop the program and run it. It also specifies the libraries used and which version of node should be used to run the application.
- `TechAssessment.pdf` specifies the requirements of this repository.
- `tsconfig.json` configures https://www.typescriptlang.org/ for this repository.

# Decisions

- Yarn instead of npm: TODO
- TypeScript instead of JavaScript: TODO
- Class instead of function: TODO
- Why git and source control in general?: TODO
- Why linter and code formatter?: TODO

# Differences between working with git as an individual vs on a team

TODO: note how features would have been broken up in the project management tool of choice. Then PRS would be created for each feature and committed to a master branch. Since it is just me I kept it simple and committed as I went.
