---
title: "Operating System"
description: "How an operating system shares hardware among programs through processes, memory management, file systems, and system calls."
category: "Computer Science"
slug: "os"
status: "published"
---

## 1. Definition

An operating system (OS) is the software that manages a computer's [hardware](/encyclopedia/hardware/) and provides common services to programs. Windows, macOS, [Linux](/encyclopedia/linux/), Android, and iOS are all operating systems.

An OS has two jobs. It is a **resource manager**, deciding which program receives the CPU, memory, and devices. It is also an **abstraction provider**, offering files, processes, and sockets so that programs do not need to control disks or network cards directly.

## 2. Purpose and background

Early machines ran one job at a time, loaded by an operator. Batch systems automated the queue, and time-sharing systems in the 1960s let many users share a single machine interactively. Unix, developed at Bell Labs starting in 1969, introduced ideas that remain central: a hierarchical file system, small composable tools, and a portable implementation written largely in C.

Without an OS, every application would need its own disk driver and would be able to overwrite the memory of every other application.

## 3. How it works

### 3.1 Kernel and user mode

The **kernel** is the privileged core of the OS. The processor enforces at least two modes:

- **User mode:** applications run with restricted access.
- **Kernel mode:** the kernel may execute privileged instructions and access all memory.

A program requests a privileged action with a **system call**, which transfers control to the kernel at a controlled entry point. Tracing a command shows how often this occurs:

```bash
$ strace -e trace=openat,read,write,close cat hello.txt
openat(AT_FDCWD, "hello.txt", O_RDONLY) = 3
read(3, "hello\n", 131072)              = 6
write(1, "hello\n", 6)                  = 6
close(3)                                = 0
```

The value `3` is a **file descriptor**, a small integer that identifies the open file for that process. Descriptors 0, 1, and 2 are standard input, output, and error.

### 3.2 Processes and threads

| | Process | Thread |
|---|---|---|
| Memory | Has its own address space | Shares the address space of its process |
| Creation cost | Higher | Lower |
| Isolation | Strong | None within the process |
| Communication | Pipes, sockets, shared memory | Shared variables, with synchronization |

On Unix-like systems a new process is typically created with `fork()` and given a new program with `exec()`:

```c
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        execlp("ls", "ls", "-l", (char *)NULL);
        perror("exec failed");
        return 1;
    }
    waitpid(pid, NULL, 0);   /* the parent waits for the child */
    return 0;
}
```

### 3.3 Scheduling

The scheduler decides which runnable thread uses each core. **Preemptive** multitasking interrupts a thread after a time slice, so one busy program cannot hold up the entire machine. Each switch saves one thread's registers and restores another's, known as a **context switch**. Schedulers balance throughput, responsiveness, and fairness.

### 3.4 Memory management

Each process sees its own **virtual address space**. The memory management unit translates virtual pages, commonly 4 KB, into physical frames using page tables maintained by the kernel.

This provides isolation, because one process cannot name another's memory. It also allows the OS to back rarely used pages with disk. Accessing a page that is not currently in RAM raises a **page fault**, which the kernel services.

### 3.5 File systems and devices

A file system such as ext4, NTFS, or APFS maps names to data blocks on storage and records metadata. **Device drivers** are kernel components that translate generic requests into commands for specific hardware.

## 4. Internal structure

| Design | Idea | Examples |
|---|---|---|
| Monolithic kernel | Most services run in kernel space | Linux |
| Microkernel | Minimal kernel, with services in user space | seL4, QNX |
| Hybrid | Combination of both approaches | Windows NT, XNU |

## 5. Practical usage

```bash
ps aux --sort=-%mem | head    # processes using the most memory
top                           # live CPU and memory usage
kill -TERM 1234               # ask process 1234 to exit cleanly
lsof -p 1234                  # files and sockets it has open
ulimit -n                     # maximum open files for this shell
```

Prefer `SIGTERM` before `SIGKILL`: only the former gives a process the chance to flush data and shut down cleanly.

## 6. Relationships with other concepts

- The OS is a key layer of any [computer](/encyclopedia/computer/).
- A [server](/encyclopedia/server/) depends on the OS for sockets, processes, and files.
- [Linux](/encyclopedia/linux/) is the most widely deployed server OS kernel.
- [Docker](/encyclopedia/docker/) containers are isolated processes that share the host kernel.

## 7. Advantages and limitations

**Advantages**

- Applications are isolated, so one failure need not bring down the whole system.
- Portable programming interfaces work across different hardware.
- Permissions protect users and resources from each other.

**Limitations**

- System calls and context switches add overhead.
- General-purpose schedulers do not guarantee timing; hard real-time work needs a real-time OS.
- A kernel bug can compromise everything, because the kernel is fully privileged.

## 8. Common errors and troubleshooting

| Error or symptom | Meaning | What to do |
|---|---|---|
| `ENOSPC` / "No space left on device" | Disk or inodes are full | `df -h`, `df -i`, then `du -sh *` |
| `EMFILE` / "Too many open files" | File descriptor limit reached | Find leaked descriptors with `lsof`; raise `ulimit -n` if truly needed |
| `EACCES` / "Permission denied" | Ownership or mode prevents access | `ls -l`, adjust ownership carefully |
| Process disappears; `dmesg` shows "Out of memory" | Killed by the kernel's OOM killer | Reduce usage or add memory |
| Process shows state `Z` (zombie) | Exited, but its parent has not called `wait()` | Fix or restart the parent |
| High load with idle CPU | Processes waiting on I/O | `iostat -x 1` |

## 9. Learning path

1. Review [Computer](/encyclopedia/computer/) and [Hardware](/encyclopedia/hardware/).
2. Practice processes, files, and permissions on [Linux](/encyclopedia/linux/).
3. Learn concurrency: threads, locks, and deadlocks.
4. Apply it with [Server](/encyclopedia/server/) and [Docker](/encyclopedia/docker/).

## 10. References

- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [The Linux man-pages project](https://man7.org/linux/man-pages/)
