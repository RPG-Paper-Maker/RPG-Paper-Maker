# :construction_worker: Contributing to RPM

Thank you for considering contributing to the RPM! Welcome to our Contribution Guide.

## Table of Contents

1. [Getting Started](#getting-started)
2. [How to contribute](#how-to-contribute)
3. [Automated tests](#automated-tests)
4. [Code style](#code-style)

## Getting Started

You can help by contributing on the engine or/and the game engine. First, be sure to be familiar with **git**, how to **fork a project** and how to **submit a pull request**.

That means that you should:

- Click on the fork button.
- Clone your fork.
- Add a remote to the original project in order to always have access to the `develop` branch:

```bash
git remote add rpm https://github.com/Wano-k/RPG-Paper-Maker.git
```

Before starting any correction, you should first pull the develop progress in order to be sure that you have the most recent version of development:

```bash
git pull rpm develop
```

After that, you should create a branch for your correction:

```bash
git checkout -b <choose_a_branch_name>
```

When your correction is done, push it (always in your branch). Finally, just propose you branch as a new pull request in the original project.

## How to contribute

RPG Paper Maker has a `master` branch for stable releases and a `develop` branch for development where you should always try to submit your features.

**If you want to add new features or correct a bug** for the next stable version, we are always using this [Trello board](https://trello.com/b/mMsMtdi1/rpm) which is listing all the features that needs to be completed for the next release. If you would like to do one of the task in this todo list, you should signal that you are on it in the [Git chat](https://gitter.im/RPG-Paper-Maker/Lobby). Same thing if you want to do anything that is not already in the todo list.

## Automated tests

We recommend contributors to add unit tests to verify the behavior of new features and bugfixes as much as possible. Start by testing low-level functions, then depending on the complexity, add tests for higher level behaviors.

Everything related to testing is located in the `Test` folder, which contains the test project `Test.pro` as well as test sources `test_xxx.cpp`. We use **Qt Test** as test framework; you will find more information in the [official documentation](https://doc.qt.io/qt-5/qttest-index.html) as well as in tutorials such as [this series on making unit tests for both plain C++ and Qt GUI](http://blog.davidecoppola.com/2017/11/cpp-unit-testing-with-qt-test-introduction/).

The Test project is still very young, so there are not many test files. When adding a test for a class `MyClass` that doesn't have an associated test class already, just add a `test_myclass.cpp` to the Test project, directly under the `Test` directory. Later, when we have more tests, we will organize them in sub-directories.

All tests are run during Continuous Integration with Travis, including during PR submission.

## Code style

Try to respect the code style as much as possible. See the wiki page for code style [here](https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/Coding-style).
