---
title: "Software"
description: "What programs are, how source code becomes something a machine can run, and how software is built and maintained."
category: "Computer Science"
slug: "software"
status: "published"
---

## 1. Definition

Software is the collection of programs, libraries, configuration, and data that tell a computer what to do. Unlike [hardware](/encyclopedia/hardware/), it has no physical form of its own and can be copied and changed without altering the machine.

A **program** is a set of instructions. A **process** is a program while it is running. One program file can be running as many processes at once.

## 2. Purpose and background

Early computers were configured by rewiring panels or feeding in raw machine code. Assemblers replaced numeric codes with readable mnemonics, and high-level languages such as Fortran (1957) let programmers express ideas without describing every register.

As systems grew, the difficulty moved from writing instructions to managing complexity. The term **software engineering** was popularized at a 1968 NATO conference held in response to projects that ran late, over budget, or failed. Version control, testing, code review, and modular design are all responses to that problem.

## 3. Types of software

| Type | Purpose | Examples |
|---|---|---|
| System software | Runs and manages the machine | Kernels, drivers, firmware |
| Application software | Accomplishes tasks for users | Browsers, editors, games |
| Middleware | Connects applications to each other | Message brokers, application servers |
| Libraries and frameworks | Reusable code for developers | React, the C standard library |
| Development tools | Build software | Compilers, debuggers, Git |

## 4. How source code becomes running software

Source code is text. It reaches the processor by one of three main routes.

| Model | How it works | Examples |
|---|---|---|
| Compiled ahead of time | A compiler produces a native binary | C, C++, Rust, Go |
| Bytecode on a virtual machine | Compiled to bytecode, then run and optimized by a VM | Java, C# |
| Interpreted or JIT | A runtime executes source, often compiling hot code at runtime | Python, [JavaScript](/encyclopedia/javascript/) |

These are properties of implementations, not absolute properties of a language. CPython, for example, compiles to bytecode before interpreting it.

The steps for a compiled program:

```text
source code → lexer → parser → semantic checks → optimizer → machine code → linker → executable
```

Here is the same small idea at the level a developer sees it:

```python
def average(values):
    """Return the mean of a non-empty list of numbers."""
    if not values:
        raise ValueError("values must not be empty")
    return sum(values) / len(values)
```

The function is short, but it shows three core habits: a clear name, a documented contract, and explicit handling of invalid input.

## 5. Internal structure of an application

Software is organized so that a change in one part does not break the others.

- **Module:** a unit of code with a defined public interface.
- **Layered architecture:** presentation, business logic, and data access are kept separate.
- **Service:** an independently deployed part of a system that communicates over an [API](/encyclopedia/api/).
- **Dependency:** third-party code the project relies on.

A typical web application combines these:

```text
Browser UI  →  HTTP API  →  Business logic  →  Database
```

### 5.1 Versions and dependencies

Semantic Versioning writes a release as `MAJOR.MINOR.PATCH`:

| Part | Increase when you… | Compatibility |
|---|---|---|
| MAJOR | Make a breaking change | May require consumer changes |
| MINOR | Add functionality | Backward compatible |
| PATCH | Fix a bug | Backward compatible |

Lock files such as `package-lock.json` record the exact versions installed, so every machine builds the same dependency tree.

## 6. Practical usage: the development lifecycle

A dependable workflow generally looks like this:

1. **Define** the required behavior.
2. **Design** the interfaces and data.
3. **Implement** on a branch under version control.
4. **Test** with automated unit and integration tests.
5. **Review** the change with another developer.
6. **Build and release** through a repeatable pipeline.
7. **Operate** with logs, metrics, and alerts.

```bash
git switch -c fix/empty-cart
npm test
git commit -am "Handle an empty cart at checkout"
git push -u origin fix/empty-cart
```

## 7. Relationships with other concepts

- Software runs on [hardware](/encyclopedia/hardware/) through the [operating system](/encyclopedia/os/).
- [Algorithms](/encyclopedia/algorithm/) are the procedures software implements.
- [JavaScript](/encyclopedia/javascript/) is the language of interactive software in the browser.
- [Docker](/encyclopedia/docker/) packages software with its runtime dependencies.

## 8. Advantages and limitations

**Advantages**

- Inexpensive to copy and distribute.
- Can be updated after release.
- Composable: new systems can be built on existing libraries.

**Limitations**

- Complexity grows quickly, and unused or poorly understood code remains costly.
- Dependencies introduce security and maintenance risks.
- Correctness is hard to prove; testing shows the presence of bugs, not their absence.
- Unlike physical goods, software can break when the environment around it changes, even if the code does not.

## 9. Common errors and troubleshooting

| Symptom | Likely cause | Approach |
|---|---|---|
| "Works on my machine" | Different versions or configuration | Pin dependencies, containerize the environment |
| Loop processes one item too many or too few | Off-by-one error | Test empty, one-item, and boundary inputs |
| Memory use grows over time | Leak or unbounded cache | Compare heap snapshots |
| Bug appears only sometimes | Race condition or timing | Add structured logs, review shared state |
| Build breaks after installing | Dependency conflict | Check the lock file and the changelog |

A reliable debugging method is to reproduce the problem, reduce it to the smallest failing case, form one hypothesis, test it, and add a regression test once it is fixed.

## 10. Learning path

1. Learn one language, such as [JavaScript](/encyclopedia/javascript/) or Python.
2. Practice with [Algorithms](/encyclopedia/algorithm/) and data structures.
3. Understand the [Operating System](/encyclopedia/os/) your code runs on.
4. Build something connected: an [API](/encyclopedia/api/) backed by a [Database](/encyclopedia/database/).

## 11. References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [NATO Software Engineering Conference report, 1968](http://homepages.cs.ncl.ac.uk/brian.randell/NATO/nato1968.PDF)
- [Pro Git](https://git-scm.com/book/en/v2)
