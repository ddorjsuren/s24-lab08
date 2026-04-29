# Lab 7: Intro to TypeScript

## Commands

- `npm install`: installs any Node dependencies
- `npm run compile`: compiles the TypeScript program into a JavaScript program
- `npm run start` or `npm run start -- <arguments>`: runs the JavaScript program. NOTE: you will need to re-run `npm run compile` after you make changes to the program
- `npm run lint` or `npx ts-standard`: runs the `ts-standard` linter. If the linter finds errors, it can often automatically fix them using the `npx ts-standard --fix` command
- `npm run test`: runs the `jest` test framework. When your implementation is complete, all of the tests should pass
- `npm run start -- .\cards\designpatterns.csv`: runs the most basic version with all default values
- `npm run start -- .\cards\designpatterns.csv --order=worst-first`: runs with an order
- `npm run start -- .\cards\designpatterns.csv --order=recent-mistakes-first --repetitions=4 --invertCards`: runs with all options