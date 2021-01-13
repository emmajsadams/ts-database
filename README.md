# In Memory Database

Take home project for https://www.devoted.com/. Implemented following the TechAssignment.pdf requirements. If you would like to be added to the private GitLab repo https://gitlab.com/EmmaJCline/in-memory-database just send me an email at emma@cline.engineer. It shows the current CI job status and that all the commits were verified with my local gpg key.

# Setup

- Clone this repository `git@gitlab.com:EmmaJCline/in-memory-database.git`
- Install the node version listed in package.json engines.node (lts which is 14.15.4 at the time of submission). A popular tool for managing node versions is https://github.com/tj/n, but your operating system package manager would also work here.
- Execute `npm install` in the project directory

# Connect to in memory database

Execute `npm run connect-in-memory` in the project directory to start the REPL environment necessary to replicate the TechAssignment.pdf examples. Please note as mentioned in #Decisions my program does not display NULL for unset keys (further reasoning below) so the example output will not exactly match my output.

# Development

All npm tasks listed below should be run in the project directory.

- `npm run lint`: lint all project files using https://eslint.org/.
- `npm run fix-lint`: automatically fix all linting errors that can be automatically fixed using https://eslint.org/.
- `npm run format`: check the format for all project files using https://prettier.io/.
- `npm run fix-format`: automatically fix the format of all files using https://prettier.io/.
- `npm run compile`: compile all https://www.typescriptlang.org/ project files using the `tsconfig.json` settings specified in the root of this repository into the `/bin` folder.
- `npm run test`: run all the https://mochajs.org/ tests for the project.
- `npm run build`: check lint rules, check format rules, compile the project, and run all tests. Used for GitLab CI builds.

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

# Key Decisions

- Displaying no output from "GET" as no new line instead of as "NULL": `TechAssessment.pdf` notes that values can be strings, and no value is represented as NULL. However what if the user sets a value to the string NULL? There is currently no way to distinguish via CLI GET output between no value (NULL) and the string value NULL. My thought was to not print a new line after GET if the value is null instead of printing NULL. This changes the expected output, but results in a less confusing program for the user.
- Documentation using JSDOC: By using the JSDoc syntax for comments it means that I could easily setup a tool like https://typedoc.org/guides/installation/ to automatically generate html documentation for the classes.
- New transactions copy the previous transaction data instead of needing to iterate through the history of transactions: I saw two key ways of implementing transactions. One possible way was to have each transaction be the unique changes made in that transaction. This means that any operation in the Database must access all transactions in order to determine the current state. The alternative method I chose was to copy the previous transaction changes into the new transaction. This means that any operation in the Database only needs to access the most recent transaction. I decided that avoiding the O(n) runtime where n is the number of transactions seemed like a better default than avoiding the space cost of copying transactions.
- TypeScript instead of JavaScript: The Database concept seemed like it would be best implemented as a class with OOP due to the fact that there is a clear public interface of methods encapsulating the private database data that should not be manipulated any other way. Taking this idea further it seemed like an InMemoryDatabase was just one possible implementation of a Database. Not to mention there could be other possible keys and values we want to use with our Database besides strings. All this lead me to believe that TypeScript was a good choice. TypeScript has interface and generics syntax that can compile time enforce these OOP principles.
- Separating executeCommand and Database: Parsing the user input in the CLI Database REPL seems like a separate task from actually using the Database. If for example I was asked to embed this Database into another program I could simply import the InMemoryDatabase and use the functions in TypeScript rather than having to execute CLI programs in my new program. This separation of concerns increases the reusability of InMemoryDatabase at little cost the application structure.
- Using git source control: Git is a popular decentralized source control that lets developers work on local offline copies of a code repository. All changes are pushed up to the server when ready. I intentionally broke up my commits into small logical chunks that could be easily reverted and reviewed if necessary. However if I was working on a team I would be sure to work on a separate branch from main named after the feature I am working on. Once that feature was ready I would submit it for code review then squash merge it into the main branch.
- Using eslint and prettier for code formatting: Both these tools have robust automatically fixable style rules that keep code in a consistent readable manner regardless of who writes it, while avoiding the need for developers to internalize styleguides.
- No default exports: I avoid using default exports in node modules because this ensures names of exports are kept up to date across the codebase and explicit renames are identified clearly. See this link for more information https://basarat.gitbook.io/typescript/main-1/defaultisbad
- Testing by behavior: Rather than breaking up tests by specific methods, I prefer to test by behaviors instead. Often times unit tests involve several methods such as get and set in order to test a behavior. This makes trying to break up tests by method somewhat confusing. Focusing on all the unique behaviors of a system under test avoids the need to specify which method is being tested.

# Example output

Here is the output of me recreating all the examples listed in the TechAssessment.pdf

```
emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> GET a
>> SET a foo
>> SET b foo
>> COUNT foo
2
>> COUNT bar
0
>> DELETE a
>> COUNT foo
1
>> SET b baz
>> COUNT foo
0
>> GET b
baz
>> GET B
>> END
emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> SET a foo
>> SET a foo
>> COUNT foo
1
>> GET a
foo
>> DELETE a
>> GET a
>> COUNT foo
0
>> END

emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> BEGIN
>> SET a foo
>> GET a
foo
>> BEGIN
>> SET a bar
>> GET a
bar
>> SET a baz
>> ROLLBACK
>> GET a
foo
>> ROLLBACK
>> GET a
>> END

emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> SET a foo
>> SET b baz
>> BEGIN
>> GET a
foo
>> SET a bar
>> COUNT bar
1
>> BEGIN
>> COUNT bar
1
>> DELETE a
>> GET a
>> COUNT bar
0
>> ROLLBACK
>> GET a
bar
>> COUNT bar
1
>> COMMIT
>> GET a
bar
>> GET b
baz
>> END
```

Here is the output of all the unique errors. Note at the end the user terminates the program thus `Ending connection!` is displayed.
```
emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> SET foo
Recognized command SET, but invalid number of parameters specified
>> GET foo bar
Recognized command GET, but invalid number of parameters specified
>> DELETE foo bar
Recognized command DELETE, but invalid number of parameters specified
>> COUNT foo bar
Recognized command COUNT, but invalid number of parameters specified
>> FAKE
Unexpected Input. Nothing happened.
>>
Ending connection!
emma@Blighttown:~/in-memory-database$
```

Here is the output showing how my tweak to the CLI output can distinguish between no key and the string value NULL
```
emma@Blighttown:~/in-memory-database$ npm run connect-in-memory

> in-memory-database@1.0.0 connect-in-memory /home/emma/in-memory-database
> ts-node ./scripts/connectInMemory.ts

>> SET a NULL
>> GET a
NULL
>> GET b
>> END
```
