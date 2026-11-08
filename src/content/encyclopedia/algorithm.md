---
title: "Algorithms"
description: "How step-by-step procedures are designed, analyzed with Big O notation, and chosen for real problems."
category: "Computer Science"
slug: "algorithm"
status: "published"
---

## 1. Definition

An algorithm is a finite, unambiguous sequence of steps that transforms input into a desired output. Donald Knuth's widely cited characterization names five properties:

- **Finiteness:** it ends after a finite number of steps.
- **Definiteness:** every step is precisely specified.
- **Input:** it takes zero or more inputs.
- **Output:** it produces at least one output.
- **Effectiveness:** every step is basic enough to actually perform.

An algorithm is independent of a programming language. The same method can be written in Python, C, or on paper.

## 2. Purpose and background

The word comes from the name of Muhammad ibn Musa al-Khwarizmi, a ninth-century Persian mathematician. Euclid's method for finding a greatest common divisor is far older and is still used.

Algorithms matter because efficiency dominates at scale. On a sorted list of one billion items, a linear search may need one billion comparisons. Binary search needs about 30.

## 3. How to measure an algorithm

**Big O notation** describes how an algorithm's cost grows with input size `n`, ignoring constant factors. It is most often used for an upper bound.

| Notation | Name | Example | Operations for n = 1,000,000 |
|---|---|---|---|
| O(1) | Constant | Array index access | 1 |
| O(log n) | Logarithmic | Binary search | About 20 |
| O(n) | Linear | Scan a list | 1,000,000 |
| O(n log n) | Linearithmic | Merge sort | About 20,000,000 |
| O(n²) | Quadratic | Comparing all pairs | 1,000,000,000,000 |
| O(2ⁿ) | Exponential | Trying all subsets | Infeasible |

Analysis should consider **time** and **memory**, and the difference between **best, average, and worst cases**. Quicksort averages O(n log n), but its simplest form degrades to O(n²) on unlucky pivot choices.

## 4. How it works: binary search

Binary search finds a value in a sorted sequence by halving the remaining range at every step.

```python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

The reasoning relies on an **invariant**: if the target exists, it is always between `low` and `high`. Stating the invariant is the best way to confirm a loop is correct.

In languages with fixed-width integers, `(low + high) / 2` can overflow. Write `low + (high - low) / 2` instead. Python integers do not overflow.

## 5. Internal structure: common design techniques

| Technique | Idea | Examples |
|---|---|---|
| Brute force | Try every possibility | Small search spaces |
| Divide and conquer | Split, solve the parts, combine | Merge sort, binary search |
| Greedy | Take the best local choice | Dijkstra's algorithm |
| Dynamic programming | Store answers to overlapping subproblems | Edit distance, knapsack |
| Backtracking | Build candidates and abandon dead ends | Sudoku, N-queens |
| Graph traversal | Visit connected states | BFS, DFS |

Algorithms depend on **data structures**. A hash table offers average O(1) lookup, a balanced tree offers ordered O(log n) lookup, and a heap gives quick access to the smallest item.

### 5.1 Dynamic programming example

A naive recursive Fibonacci recomputes the same values exponentially many times. Remembering each result reduces the work to O(n).

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))  # 23416728348467685
```

## 6. Practical usage

In everyday work, the most useful decision is usually selecting the right built-in structure.

```python
# O(n * m): list membership is a linear scan.
common = [u for u in users if u in banned_list]

# O(n + m): a set offers average constant-time membership.
banned = set(banned_list)
common = [u for u in users if u in banned]
```

Real systems use algorithms everywhere: [databases](/encyclopedia/database/) search with B-trees, routers compute shortest paths, compression finds repeated patterns, and cryptography relies on problems believed to be computationally hard.

## 7. Relationships with other concepts

- [Software](/encyclopedia/software/) is the executable form of algorithms.
- [Hardware](/encyclopedia/hardware/) determines constant factors through caches and parallelism.
- [SQL](/encyclopedia/sql/) query planners select join algorithms based on estimated cost.
- [JWT](/encyclopedia/jwt/) signatures rely on cryptographic algorithms such as HMAC-SHA-256.

## 8. Advantages and limitations

**Advantages**

- Better algorithms can outperform any feasible hardware upgrade.
- Complexity analysis allows behavior to be predicted before it is built.

**Limitations**

- Big O hides constants. For small inputs, a simple O(n²) insertion sort can beat more sophisticated methods, which is why hybrid sorts use it on small runs.
- Average-case results assume typical inputs. Adversarial inputs can trigger worst cases, as in hash-flooding attacks.
- Some problems have no known efficient exact solution, such as NP-hard scheduling. These are commonly addressed with heuristics or approximation.

## 9. Common errors and troubleshooting

| Mistake | Consequence | Prevention |
|---|---|---|
| Off-by-one boundaries | Missed items or out-of-range errors | Test empty, single, and boundary inputs |
| Binary search on unsorted data | Silently wrong answers | Confirm or enforce the sort order |
| Recursion without a reachable base case | Stack overflow | Prove that progress is made on each call |
| Nested loops over large inputs | Timeouts in production | Replace one with a hash lookup or an index |
| Mutating a collection during iteration | Skipped items or exceptions | Iterate over a copy or build a new result |
| Optimizing before measuring | Complexity with no gain | Profile first |

## 10. Learning path

1. Learn arrays, hash tables, stacks, and queues.
2. Master Big O, searching, and sorting.
3. Practice recursion, trees, and graphs.
4. Study dynamic programming and greedy methods.
5. See applications in [Database](/encyclopedia/database/) indexes and [SQL](/encyclopedia/sql/) query plans.

## 11. References

- Cormen, Leiserson, Rivest, and Stein, *Introduction to Algorithms*
- Donald Knuth, *The Art of Computer Programming*
- [VisuAlgo: algorithm visualizations](https://visualgo.net/)
