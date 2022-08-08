# Takehome Project

This document outlines the instructions to set up the project locally and run
all the tests and checks required to pass the challenge.

The test instructions are located in the [`README.md`](README.md) document.

## Prerequisites

This project requires that you have the following software installed:

- [Node.js](https://nodejs.org/en/) (v14 or greater, since we like to be
  up-to-date)
- [Yarn](https://yarnpkg.com/) for package management

**Note: if you are making the changes in the online IDE,
the commands shown below can be executed via a built-in terminal that is
reachable in the top menu bar**

### Node.js

As outlined above, this project requires Node.js to be available in the 
development environment for you to be able to install the dependencies, run
the tests and (optionally) run the service locally.

If you're using the online IDE, the environment is already provisioned with
Node.js v14, so you should be able to carry on with your work without the need
for you to go over this section.

To quickly install Node.js run the following commands:

_If taking the test via the online IDE:_

```shell
sudo apt update
sudo apt upgrade
```

To install Node v14:

```shell
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Yarn

Once you have the Node.js version up to date, installing Yarn should be pretty
straightforward:

```shell
sudo npm i -g npm   # Optional
sudo npm i -g yarn
```

## Install Dependencies

```shell
yarn install
```

## Run Checks

To run all the automated tests:

```shell
yarn test
```

To run the linter against the code:

```shell
yarn lint
```

## Build and Run

If needed, you can build the project explicitly and run it in your local
machine. Executing the following commands will accomplish this:

```shell
yarn build
yarn start
```

If you also want to restart the server while making changes to the codebase, the
following command will let you do that:

```shell
yarn dev
```
