## Read-only Files
The following files are marked read-only. You cannot edit these files
in the editor; however, it is possible from the terminal. You must not
modify or delete these files because doing so results in a zero score.

* .gitignore
* __tests__/__mocks__/index.ts
* index.ts
* jest.config.ts
* tsconfig.json // the include property was updated to have the files in `src` so that`yarn dkr:u` and `yarn dkr:ub` could run correctly.