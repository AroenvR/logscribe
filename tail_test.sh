#!/bin/bash

if [ $# -eq 0 ]; then
  echo -e "\nPlease provide an argument for which file prefix to run.\n"
  exit 1

else
  echo -e "\Running $arg1 in watch mode with a tail file.\n"
  # At least one argument was given, execute command 2 (run specific Jest test suite) with the first argument
  arg1="$1.test.ts"
  export TAIL_TESTING="true"

  echo -e "\nExecuting npm run test:watch $arg1\n"
  npm run test:watch "$arg1"
fi

# // testServerConfig.ts
# const getLogFilePath = (): string => {
#     /* The TAIL environment variable is set by running the bash script carry.sh.
#         It stops from tests generating new files so we can watch the log being updated live while we program. */
#     if (process.env.TAIL) {
#         return path.join(__dirname, './logs', `tail.test.log`);
#     }

#     // Otherwise, generate a new file for each test with timestamps in the name.
#     return path.join(__dirname, './logs', `${new Date().toISOString().replace(/[:.]/g, '-')}.test.log`);
# }

# jest.setup.ts
# beforeAll(async () => {
#     if (process.env.TAIL) await deleteFile(path.join(__dirname, `./logs`, `tail.test.log`));
# });