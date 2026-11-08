---
title: "Hardware"
description: "The physical components of a computer, how they cooperate, and how they represent information in binary."
category: "Computer Science"
slug: "hardware"
status: "published"
---

## 1. Definition

Hardware is the physical part of a computer system: processors, memory, storage, circuit boards, power supplies, and input/output devices. If you can touch it, it is hardware; the instructions that run on it are [software](/encyclopedia/software/).

Between the two sits **firmware**, software stored on a chip that initializes a device and controls it at a low level. UEFI on a motherboard and the controller code inside an SSD are common examples.

## 2. Purpose and background

Hardware turns abstract logic into physical behavior. Transistors act as very small electrically controlled switches. Combined into logic gates, they perform Boolean operations; combined further, they form adders, registers, memory cells, and complete processors.

Each generation has put more transistors in less space. A modern high-end processor contains tens of billions of them.

## 3. Main components

| Component | Role | Retains data without power? |
|---|---|---|
| CPU | Executes general-purpose instructions | No |
| GPU | Performs many parallel calculations | No |
| RAM | Holds running programs and working data | No |
| SSD / HDD | Long-term storage | Yes |
| Motherboard | Connects components with buses and slots | Not applicable |
| Network interface | Sends and receives data over a network | Not applicable |
| Power supply | Converts and delivers power | Not applicable |

### 3.1 Inside the CPU

- **Control unit:** decodes instructions and directs the other parts.
- **Arithmetic logic unit (ALU):** performs integer arithmetic and logic.
- **Registers:** a small set of extremely fast storage locations inside the core.
- **Caches (L1, L2, L3):** small, fast copies of recently used memory.
- **Cores and threads:** a core is an independent execution engine; simultaneous multithreading lets one core present itself as two logical processors.

Modern cores also use **pipelining**, **branch prediction**, and **out-of-order execution** to work on many instructions at once while preserving the result that sequential execution would produce.

## 4. How it works: the memory hierarchy

Fast memory is expensive and small, so systems layer several kinds. The processor looks in the closest layer first. The numbers below are typical orders of magnitude and vary by machine.

| Layer | Typical latency | Typical size |
|---|---|---|
| Register | Under 1 ns | Bytes |
| L1 cache | About 1 ns | Tens of KB |
| L2 / L3 cache | About 4–40 ns | MB |
| RAM | About 100 ns | GB |
| NVMe SSD | About 100 µs | TB |
| Hard disk | About 10 ms | TB |

The hierarchy works because of **locality**. A program that recently used an address is likely to use it again soon (temporal locality) and to use nearby addresses (spatial locality). Code that walks memory sequentially therefore runs far faster than code that jumps around, even with the same number of operations.

```c
/* Row-by-row traversal matches C's memory layout and is cache friendly. */
for (int row = 0; row < N; row++)
    for (int col = 0; col < N; col++)
        sum += matrix[row][col];

/* Swapping the two loops touches distant addresses and can be much slower. */
```

## 5. Binary and data representation

Digital hardware distinguishes two voltage ranges, so it stores everything in **bits** with the value 0 or 1. Eight bits form a **byte**, with 256 possible values.

### 5.1 Number systems

| Decimal | Binary | Hexadecimal |
|---|---|---|
| 5 | 0101 | 0x5 |
| 10 | 1010 | 0xA |
| 15 | 1111 | 0xF |
| 255 | 1111 1111 | 0xFF |

Each binary position is a power of two, so `1010` is 8 + 2 = 10. One hexadecimal digit represents exactly four bits, which makes hex a compact way to read binary.

### 5.2 Interpreting bits

The same bits mean different things depending on the agreed format:

- **Unsigned integers:** direct binary values.
- **Signed integers:** normally **two's complement**, where an 8-bit value ranges from −128 to 127.
- **Floating point:** IEEE 754 stores a sign, an exponent, and a fraction.
- **Text:** a character encoding such as UTF-8 maps characters to one to four bytes.

```python
print(bin(10))                 # 0b1010
print(hex(255))                # 0xff
print("é".encode("utf-8"))     # b'\xc3\xa9', two bytes
print((200).to_bytes(1, "big")[0] - 256)  # -56: byte 200 read as signed 8-bit
```

## 6. Practical usage

Inspecting hardware on Linux:

```bash
lscpu          # processor model, cores, and caches
free -h        # memory use
lsblk          # disks and partitions
df -h          # free space on mounted file systems
lspci          # devices on the PCI bus
sensors        # temperatures, from the lm-sensors package
```

Understanding hardware pays off when diagnosing performance. Before upgrading, identify the actual limit: a process waiting on disk does not get faster with a better CPU.

## 7. Relationships with other concepts

- A [computer](/encyclopedia/computer/) is hardware and software working together.
- The [operating system](/encyclopedia/os/) schedules CPU time and manages memory and devices through drivers.
- [Algorithms](/encyclopedia/algorithm/) perform differently depending on cache behavior and memory size.
- A [database](/encyclopedia/database/) is designed around the speed gap between memory and storage.

## 8. Advantages and limitations

**Advantages**

- Hardware specialized for a task, such as a GPU for matrix math, can vastly outperform general software on a CPU.
- Hardware-enforced protections isolate programs from one another.

**Limitations**

- Components have physical limits on heat, power, and the speed of signals.
- Hardware wears out: SSD cells endure limited writes and hard disks have moving parts.
- Fixing a hardware design flaw often requires replacement, or a microcode update that can cost performance. Spectre and Meltdown are well-known examples.

## 9. Common errors and troubleshooting

| Symptom | Likely cause | Check |
|---|---|---|
| Sudden shutdowns under load | Overheating or insufficient power | Temperatures, dust, power supply capacity |
| Random crashes or corrupted files | Faulty memory | Run MemTest86 |
| System slows after sustained load | Thermal throttling | CPU frequency over time |
| Slow disk or read errors | Failing drive | `smartctl -a /dev/sda` from smartmontools |
| Installed RAM shows less than expected | Module not seated, or memory reserved by the integrated GPU | BIOS memory report |

Always back up data first if a drive shows errors; further testing stresses a failing disk.

## 10. Learning path

1. Read [Computer](/encyclopedia/computer/) for the overall model.
2. Learn binary and the memory hierarchy from this page.
3. Continue to [Operating System](/encyclopedia/os/) to see how hardware is shared.
4. Study [Algorithms](/encyclopedia/algorithm/) with memory cost in mind.

## 11. References

- [What Every Programmer Should Know About Memory, Ulrich Drepper](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)
- [The Unicode Standard](https://www.unicode.org/standard/standard.html)
