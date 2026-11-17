---
title: "Bash (Bourne Again Shell)"
description: "What Bash is, how a shell turns a typed line into running programs, and the commands, pipes, variables and scripts a developer uses every day."
category: "Infrastructure"
slug: "bash"
status: "published"
---

## 1. Definition

Bash (Bourne Again SHell) is a **shell**: a program that reads a line of text, works out which programs to run and with what input, runs them, and shows their output. It is the default interactive shell on most [Linux](/encyclopedia/linux/) distributions, ships with Git for Windows as *Git Bash*, and is the language of most build, deploy and CI scripts.

A shell is not the terminal. The **terminal** is the window that shows text; the **shell** is the program inside it that interprets what you type.

## 2. Purpose and background

Bash was written by Brian Fox for the GNU Project in 1989 as a free replacement for the Bourne shell (`sh`, 1979). It keeps `sh` compatibility, so old scripts still run, and adds history, tab completion, arrays and better scripting.

Developers need it because almost every tool is reachable from a command line, and anything you can type once you can put in a script and run a thousand times: in a CI pipeline, on a server over SSH, or in a Docker image.

## 3. How it works

When you press Enter, Bash:

1. **Splits** the line into words, respecting quotes: `echo "a b"` is two words, `echo a b` is three.
2. **Expands** what it finds: `$HOME` becomes `/home/you`, `*.java` becomes the matching file names, `$(date)` becomes the output of `date`.
3. **Sets up redirections and pipes**: `>` sends output to a file, `|` connects one program's output to the next program's input.
4. **Finds the program**: a built-in (`cd`, `echo`), or an executable found by searching each folder in `$PATH` in order.
5. **Runs it** as a child [process](/encyclopedia/os/) and waits, then stores its **exit code** in `$?` (`0` means success).

```bash
grep -r "TODO" src | wc -l    # grep writes matching lines, wc counts them
echo $?                       # 0: the last command succeeded
```

## 4. Internal structure

| Piece | What it is | Example |
|---|---|---|
| Built-ins | Commands inside Bash itself, which can change the shell's own state | `cd`, `export`, `source` |
| External programs | Files on disk found through `PATH` | `git`, `java`, `node` |
| Variables | Text values; exported ones are passed to child processes | `export DB_PASSWORD=...` |
| Streams | Every process has stdin (0), stdout (1), stderr (2) | `cmd 2> errors.log` |
| Exit codes | Number from 0 to 255; `&&` runs the next command only on 0 | `npm test && git push` |
| Startup files | Run when a shell starts | `~/.bashrc`, `~/.bash_profile` |

## 5. Practical usage

### 5.1 Moving around and looking

```bash
pwd                 # where am I
ls -la              # list, including hidden files
cd ~/projects/app   # go to a folder (~ is your home folder)
cd ..               # one level up
cat README.md       # print a file
less app.log        # scroll through a long file (q quits)
```

### 5.2 Finding things

```bash
grep -rn "findAll" src/          # which files mention findAll, with line numbers
find . -name "*.yml"             # files by name
history | grep gradle            # commands you ran before
```

### 5.3 Combining commands

```bash
./gradlew test && git push                   # push only if tests pass
tail -f logs/app.log | grep ERROR            # watch a log for errors
curl -s localhost:8080/api/stores | head     # first lines of an API response
```

### 5.4 A safe script

```bash
#!/usr/bin/env bash
set -euo pipefail          # stop on errors, unset variables and failed pipes
cd "$(dirname "$0")"       # run from the script's own folder
./gradlew test
echo "Tests passed at $(date)"
```

### 5.5 Bash on Windows

Git Bash gives Windows a Bash with Unix paths: `C:\Users\me` is `/c/Users/me`. Windows batch files still run (`./gradlew.bat test`). PowerShell is a different shell with different syntax; commands copied between them often fail.

## 6. Relationships with other concepts

- [Linux](/encyclopedia/linux/) and the [Operating System](/encyclopedia/os/): Bash asks the OS to start processes and open files.
- [Docker](/encyclopedia/docker/): `RUN` lines in a Dockerfile are shell commands.
- [Server](/encyclopedia/server/): administration over SSH happens in a shell.
- [Cloud](/encyclopedia/cloud/): CI/CD pipelines are mostly Bash scripts.

## 7. Advantages and limitations

**Advantages**
- Available almost everywhere, including servers, containers and CI runners.
- Small programs combined with pipes solve problems no single tool was built for.
- Anything typed once can be scripted and repeated exactly.

**Limitations**
- Everything is text; there are no real data types or objects.
- Quoting and word-splitting rules cause subtle bugs, especially with spaces in file names.
- Long scripts become hard to test and maintain; use Python or another language beyond a few dozen lines.

## 8. Common errors and troubleshooting

| Message | Cause | Fix |
|---|---|---|
| `command not found` | The program is not installed, or its folder is not in `PATH` | Install it, or check `echo $PATH` |
| `Permission denied` | The file is not executable | `chmod +x script.sh` |
| `No such file or directory` | Wrong path, or a space in an unquoted path | Use `pwd`, `ls`, and quote paths: `"$file"` |
| `bad interpreter: /bin/bash^M` | The script has Windows line endings (CRLF) | Convert to LF in the editor or with `dos2unix` |
| A command "did nothing" | It failed silently; the next command ran anyway | `echo $?`, and use `set -e` in scripts |

## 9. Learning path

1. Navigation: `pwd`, `ls`, `cd`, `cat`, `less`.
2. Searching: `grep`, `find`, `history`.
3. Pipes, redirection and exit codes: `|`, `>`, `>>`, `2>`, `&&`, `||`.
4. Variables and `PATH`; `export` and `~/.bashrc`.
5. Scripts with `set -euo pipefail`, arguments (`$1`) and `if`/`for`.
6. Read one real CI or deploy script and explain each line.

## 10. References

- GNU Bash Reference Manual — gnu.org/software/bash/manual
- `man bash` and `help <builtin>` inside the shell
- ShellCheck — shellcheck.net, a linter that explains common script mistakes
