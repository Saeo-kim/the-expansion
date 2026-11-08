---
title: "Computer"
description: "How a machine that follows stored instructions works, where it came from, and how its layers fit together."
category: "Computer Science"
slug: "computer"
status: "published"
---

## 1. Definition

A computer is a programmable machine that accepts input, processes it by following a stored sequence of instructions, retains data, and produces output.

Two ideas in that sentence separate a computer from a calculator or a fixed-function circuit:

- **Programmable:** its behavior is determined by instructions that can be replaced, not by its wiring alone.
- **Stored program:** instructions are held in memory just like data, so a machine can load, modify, and run new programs without being rebuilt.

A phone, a laptop, a car's engine controller, and a rack in a data center are all computers. They differ in size and purpose, not in the basic model.

## 2. Purpose and background

Computers exist because many useful problems can be reduced to long sequences of simple, exact operations. Humans are slow and error-prone at those sequences; electronics perform billions of them each second.

The theoretical foundation came in 1936, when Alan Turing described an abstract machine able to carry out any procedure that can be stated precisely. That result established what is computable at all, long before fast hardware existed.

## 3. History of computing

| Period | Milestone | Why it mattered |
|---|---|---|
| 1837 | Charles Babbage designs the Analytical Engine | First general-purpose mechanical design, with separate storage and arithmetic units |
| 1843 | Ada Lovelace publishes her notes on the Engine | Includes a procedure for computing Bernoulli numbers, often called the first published program |
| 1936 | Alan Turing's paper on computable numbers | Defines the limits of mechanical computation |
| 1945 | ENIAC is completed; John von Neumann writes the EDVAC report | Electronic speed, and a written description of the stored-program design |
| 1947 | The transistor is invented at Bell Labs | Replaces fragile vacuum tubes |
| 1958–59 | Integrated circuits by Jack Kilby and Robert Noyce | Many transistors on one piece of semiconductor |
| 1971 | Intel 4004 | A complete processor on a single chip |
| 1980s | Personal computers spread | Computing reaches homes and offices |
| 2007 onward | Smartphones and cloud platforms | Computing becomes mobile and rented on demand |

Gordon Moore observed in 1965 that the number of components on a chip was doubling at a regular pace. The trend drove decades of cheaper and faster machines. Single-core speed gains have slowed since the mid-2000s, which is why modern processors add more cores and specialized units such as GPUs instead.

## 4. How a computer works

Almost every processor repeats one loop, the **instruction cycle**:

1. **Fetch** the next instruction from memory, at the address held in the program counter.
2. **Decode** it to determine the operation and operands.
3. **Execute** the operation, such as an addition or a comparison.
4. **Write back** the result to a register or to memory, then continue with the next instruction.

A short, high-level statement becomes many of these steps. The C line `total = price + tax;` compiles to something like the following simplified machine-level sequence:

```text
LOAD  R1, [price]     ; copy price from memory into register R1
LOAD  R2, [tax]       ; copy tax into register R2
ADD   R3, R1, R2      ; add the registers
STORE [total], R3     ; write the result back to memory
```

## 5. Internal structure: layers of abstraction

Computers are understandable because each layer hides the details of the layer beneath it.

| Layer | Example | Offers to the layer above |
|---|---|---|
| Applications | Browser, editor | Tasks for people |
| Runtimes and libraries | V8, libc | Reusable behavior |
| [Operating system](/encyclopedia/os/) | Linux, Windows | Processes, files, and devices |
| Instruction set architecture | x86-64, ARM64 | A defined list of machine instructions |
| [Hardware](/encyclopedia/hardware/) | CPU, RAM, storage | Physical computation |

The **von Neumann architecture** places a processor, a memory shared by code and data, and input/output on common pathways. Because instructions and data compete for that path, memory speed limits how quickly the processor can work; this is the *von Neumann bottleneck*. Modern CPUs reduce it with caches and, at the cache level, separate instruction and data stores.

## 6. Practical usage

You can inspect the layers of the machine in front of you. On Linux:

```bash
uname -m          # instruction set architecture, such as x86_64 or aarch64
uname -sr         # kernel name and version
lscpu | head -20  # cores, threads, and cache sizes
free -h           # installed and available memory
```

When you choose a computer for a workload, match the resource that limits it:

| Workload | Usually limited by |
|---|---|
| Compiling code | CPU cores and fast storage |
| Large spreadsheets and data analysis | Memory |
| Video editing and machine learning | GPU and memory |
| Web browsing | Memory and network |

## 7. Relationships with other concepts

- [Hardware](/encyclopedia/hardware/) is the physical part of the system.
- [Software](/encyclopedia/software/) supplies the instructions the hardware runs.
- The [operating system](/encyclopedia/os/) allocates hardware among running programs.
- [Algorithms](/encyclopedia/algorithm/) are the procedures that software expresses.
- A [server](/encyclopedia/server/) is a computer, or a program on one, that answers requests from others.

## 8. Advantages and limitations

**Advantages**

- General purpose: new behavior requires new software, not new machinery.
- Exact repetition at very high speed.
- Copying and transmitting digital results is close to free.

**Limitations**

- A computer does exactly what it was told, including mistakes in the instructions.
- Some problems are provably undecidable: no program can determine in every case whether an arbitrary program halts.
- Other problems are solvable in theory but too expensive in practice as their size grows.
- Numbers have finite precision, which produces rounding and overflow.

## 9. Common errors and troubleshooting

| Symptom | Likely cause | First step |
|---|---|---|
| Machine is slow while the CPU is idle | Memory exhausted and swapping, or storage bottleneck | Check memory pressure and disk activity |
| Program will not start: wrong architecture | An x86-64 binary on ARM64, or the reverse | Compare `uname -m` with the build you downloaded |
| `0.1 + 0.2` is not exactly `0.3` | Binary floating point cannot represent these values exactly | Use decimal types for money |
| Random crashes under heavy load | Overheating or failing memory | Check temperatures and run a memory test |

## 10. Learning path

1. Start with this page, then [Hardware](/encyclopedia/hardware/) to see the physical components.
2. Read [Software](/encyclopedia/software/) to see how instructions are written and packaged.
3. Continue to [Operating System](/encyclopedia/os/) and [Algorithms](/encyclopedia/algorithm/).
4. Move outward to networks with [Server](/encyclopedia/server/) and [Web](/encyclopedia/web-concept/).

## 11. References

- [Alan Turing, "On Computable Numbers" (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [The Computer History Museum timeline](https://www.computerhistory.org/timeline/computers/)
