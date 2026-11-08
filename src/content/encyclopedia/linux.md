---
title: "Linux"
description: "The Linux kernel and its distributions, the file system layout, permissions, processes, and essential command-line skills."
category: "Infrastructure"
slug: "linux"
status: "published"
---

## 1. Definition

Strictly, Linux is an open-source, Unix-like **kernel**. In common usage, the term also describes the complete [operating systems](/encyclopedia/os/), known as **distributions**, built around that kernel.

A distribution combines the kernel with GNU tools, a package manager, an init system, and other [software](/encyclopedia/software/). Examples include Ubuntu, Debian, Fedora, Alpine, and Red Hat Enterprise Linux.

## 2. Purpose and background

Linus Torvalds announced the kernel in 1991 as a hobby project. Releasing it under the GNU General Public License invited contributions from around the world, and it combined naturally with the existing tools of the GNU Project.

Today, Linux powers most public [cloud](/encyclopedia/cloud/) workloads, all of the world's top 500 supercomputers, and Android devices.

Its design inherits Unix conventions: small programs that each do one thing, text as a common interface, and files as a general abstraction.

## 3. How it works

The kernel manages processes, memory, file systems, networking, and devices. Everything else runs in user space and asks the kernel for services through system calls.

```text
Applications and shell
GNU C library (glibc) and other libraries
────────────── system calls ──────────────
Linux kernel: scheduler, memory, VFS, network, drivers
Hardware
```

### 3.1 Everything is a file

Many resources are exposed through the same file interface:

```bash
cat /proc/cpuinfo        # kernel information presented as a file
cat /sys/class/net/eth0/address   # MAC address of a network device
echo hello > /dev/null   # a special file that discards input
```

### 3.2 Boot and services

The firmware loads a bootloader, the bootloader starts the kernel, and the kernel starts the first user process, PID 1. On most modern distributions, that is **systemd**, which then starts and supervises services.

## 4. Internal structure

### 4.1 File system layout

| Path | Contains |
|---|---|
| `/etc` | System configuration |
| `/home` | User home directories |
| `/var` | Variable data, including logs |
| `/usr` | Installed programs and libraries |
| `/tmp` | Temporary files |
| `/proc`, `/sys` | Virtual files exposing kernel state |
| `/dev` | Device files |

### 4.2 Permissions

Every file has an owner, a group, and three sets of permissions.

```text
-rwxr-x--- 1 deploy www-data 4096 Nov  9 07:30 deploy.sh
 │  │  │
 │  │  └── others: no access
 │  └───── group: read and execute
 └──────── owner: read, write, and execute
```

Numeric notation adds read (4), write (2), and execute (1), so the file above is mode `750`.

For directories, execute means permission to enter, and read means permission to list.

## 5. Practical usage

### 5.1 Essential commands

| Task | Command |
|---|---|
| Navigate and list | `cd`, `pwd`, `ls -la` |
| View files | `less`, `head`, `tail -f` |
| Search | `grep -rn "error" /var/log` |
| Find files | `find . -name "*.log" -mtime +7` |
| Change permissions | `chmod 640 file`, `chown user:group file` |
| Inspect processes | `ps aux`, `top` |
| Inspect disk | `df -h`, `du -sh *` |
| Inspect network | `ss -ltnp`, `ip addr` |
| Manage services | `systemctl status nginx`, `journalctl -u nginx` |
| Install on Debian or Ubuntu | `sudo apt update && sudo apt install nginx` |

### 5.2 Composing tools with pipes

Each program does one small job, and the output of one becomes the input of the next. This finds the most frequent client addresses in an access log:

```bash
awk '{print $1}' /var/log/nginx/access.log \
  | sort \
  | uniq -c \
  | sort -rn \
  | head -10
```

### 5.3 A safe shell script

```bash
#!/usr/bin/env bash
set -euo pipefail

backup_dir="/var/backups/app"
stamp="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$backup_dir"
tar -czf "$backup_dir/app-$stamp.tar.gz" /srv/app
find "$backup_dir" -name '*.tar.gz' -mtime +14 -delete
```

`set -euo pipefail` stops on errors and on unset variables instead of carrying on after a failure. Always quote variables, so that spaces in values do not split into several arguments.

### 5.4 Basic server hardening

- Use SSH keys and disable password login.
- Use a regular user with `sudo`; do not work as root.
- Open only required ports in the firewall.
- Apply security updates regularly.
- Run each service under its own unprivileged account.

## 6. Relationships with other concepts

- Linux is an implementation of the [operating system](/encyclopedia/os/) concept.
- Most [servers](/encyclopedia/server/) run it.
- [Docker](/encyclopedia/docker/) depends on Linux kernel features such as namespaces and cgroups.
- [Cloud](/encyclopedia/cloud/) virtual machines commonly boot Linux images.

## 7. Advantages and limitations

**Advantages**

- Open source, with no license fee for the kernel.
- Stable, efficient, and highly automatable.
- Runs on hardware from small devices to supercomputers.
- Very large community and documentation base.

**Limitations**

- Learning the command line takes time.
- Differences across distributions affect packages and paths.
- Some commercial desktop applications are unavailable.
- Powerful commands can do damage quickly, and with no confirmation.

## 8. Common errors and troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `command not found` | Not installed, or not in `PATH` | `which name`, `echo "$PATH"` |
| `Permission denied` | File mode or ownership | `ls -l`; avoid `chmod 777` |
| `No such file or directory` on an existing script | Windows CRLF line endings in the `#!` line | Convert with `dos2unix` |
| `No space left on device` | Full disk or no free inodes | `df -h`, `df -i` |
| `Address already in use` | Port is occupied | `ss -ltnp` |
| `sudo: unable to resolve host` | Host name is missing from `/etc/hosts` | Add it |
| Service fails to start | Configuration or dependency error | `journalctl -u name -e` |
| Deleted a large file, but space is not freed | A process still has it open | `lsof +L1`, then restart that process |

Treat `rm -rf` with care. Print a variable with `echo` first if it forms part of a destructive path.

## 9. Learning path

1. Learn navigation, files, and permissions.
2. Practice pipes, `grep`, and basic scripting.
3. Understand processes and services from [Operating System](/encyclopedia/os/).
4. Configure a web [Server](/encyclopedia/server/) over SSH.
5. Run applications in [Docker](/encyclopedia/docker/).

## 10. References

- [The Linux Kernel documentation](https://docs.kernel.org/)
- [The Linux man-pages project](https://man7.org/linux/man-pages/)
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/fhs.shtml)
- [The Linux Command Line, William Shotts](https://linuxcommand.org/tlcl.php)
