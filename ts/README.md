# Starter seed : Typescript - Jest

Uses :
* __Jest__ as unit testing engine and reporting engine
* __ts-node__ to perform conversion from TS to JS
* __prettier & ESLint__ for cleaner code
* __Stryker__ as mutation testing engine

## Installation

> npm i


## Running tests

> npm test

## Code coverage

The coverage is automatically run with `npm test`. You have a report directly in console. The HTML report can be found in `reports/coverage/lcov-report/index.html`

## Mutation testing

> npm test:mutation

You need green tests to perform the mutation testing. 

The mutation report will be located in `reports/mutation/index.html`