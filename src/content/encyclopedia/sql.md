---
title: "SQL"
description: "How to query and change relational data with SQL, including joins, transactions, indexes, and safe parameterized queries."
category: "Data & Databases"
slug: "sql"
status: "published"
---

## 1. Definition

SQL (Structured Query Language) is the standard language for defining, querying, and modifying data in relational [databases](/encyclopedia/database/).

SQL is **declarative**. You state what result you want, and the database's query planner decides how to obtain it.

## 2. Purpose and background

In 1970, Edgar F. Codd proposed the relational model, in which data is organized as relations and manipulated with mathematical operations. Donald Chamberlin and Raymond Boyce designed SEQUEL at IBM in the 1970s to make that model practical. ANSI and ISO standardized SQL in the 1980s.

Vendors implement the standard with their own extensions, so syntax differs slightly across PostgreSQL, MySQL, SQL Server, Oracle, and SQLite.

## 3. Parts of the language

| Group | Purpose | Statements |
|---|---|---|
| DDL | Define structure | `CREATE`, `ALTER`, `DROP` |
| DML | Read and change data | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| DCL | Control access | `GRANT`, `REVOKE` |
| TCL | Manage transactions | `BEGIN`, `COMMIT`, `ROLLBACK` |

## 4. How it works

### 4.1 Logical query order

A query is written in one order but logically evaluated in another.

```text
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

This explains why `WHERE` generally cannot use an alias defined in `SELECT`, and why `HAVING` is the correct place to filter on aggregates.

### 4.2 Query execution

The database parses a statement, then generates candidate plans, estimates their cost using table statistics, and runs the cheapest. The planner decides whether to scan or use an index, and which [join algorithm](/encyclopedia/algorithm/) to use.

## 5. Practical usage

The following examples use PostgreSQL syntax.

```sql
CREATE TABLE customers (
  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers (id),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5.1 Joins

| Join | Returns |
|---|---|
| `INNER JOIN` | Only rows that match on both sides |
| `LEFT JOIN` | All left rows, with `NULL` where no right row matches |
| `RIGHT JOIN` | All right rows, with `NULL` where no left row matches |
| `FULL JOIN` | All rows from both sides |
| `CROSS JOIN` | Every combination of rows |

```sql
-- Customers with their lifetime spend, including those with no orders.
SELECT c.email,
       COUNT(o.id)                    AS order_count,
       COALESCE(SUM(o.total_cents), 0) AS total_cents
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.email
HAVING COUNT(o.id) < 5
ORDER BY total_cents DESC
LIMIT 20;
```

### 5.2 Transactions

A transaction makes several statements succeed or fail as one unit.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- use ROLLBACK to discard the changes
```

### 5.3 Indexes

An index trades extra storage and slower writes for much faster reads, usually using a B-tree.

```sql
CREATE INDEX orders_customer_created_idx
  ON orders (customer_id, created_at DESC);

EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 7
ORDER BY created_at DESC
LIMIT 10;
```

Column order matters: this index helps queries filtering on `customer_id` alone, but it generally does not help queries filtering only on `created_at`.

### 5.4 Parameterized queries

Never build SQL by concatenating input. Doing so creates **SQL injection**, in which an attacker's input changes the statement itself.

```javascript
// Vulnerable: the input becomes part of the SQL text.
await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Safe: the value is sent separately from the statement.
await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

Identifiers such as column names cannot be parameterized. If they must vary, check them against a fixed allowlist.

## 6. Internal structure: relationships with other concepts

- A [database](/encyclopedia/database/) stores data and executes SQL.
- A [data model](/encyclopedia/model/) defines the tables and keys that SQL queries use.
- [Algorithms](/encyclopedia/algorithm/) such as hash join and B-tree search determine query cost.
- An [API](/encyclopedia/api/) commonly translates requests into SQL statements.

## 7. Advantages and limitations

**Advantages**

- Concise and expressive for complex data questions.
- A durable skill, transferable across products.
- Transactions and constraints keep data correct at the database level.
- The planner can improve performance without any query changes.

**Limitations**

- Dialects differ, so portability is imperfect.
- Query performance can be difficult to predict without reading plans.
- Mapping nested application objects to rows requires additional work.
- Relational schemas need planned migrations when they change.

## 8. Common errors and troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `= NULL` returns nothing | `NULL` comparisons are unknown | Use `IS NULL` |
| `NOT IN` returns no rows | Subquery contains `NULL` | Use `NOT EXISTS` |
| Row counts are multiplied | Join on a non-unique key | Check cardinality before aggregating |
| `column must appear in the GROUP BY clause` | Non-aggregated selected column | Group by it or aggregate it |
| Every row was updated | `UPDATE` without a `WHERE` clause | Test with a `SELECT` inside a transaction first |
| Query is slow | Missing index, or function on an indexed column | Read `EXPLAIN ANALYZE` |
| Hundreds of small queries per page | N+1 pattern | Use a join or batch with `WHERE id = ANY($1)` |
| Deadlock detected | Transactions lock rows in different orders | Lock consistently and retry |

## 9. Learning path

1. Understand tables and keys through [Data Model](/encyclopedia/model/).
2. Practice `SELECT`, filtering, and sorting.
3. Master joins and aggregation.
4. Learn transactions and indexes, using [Database](/encyclopedia/database/).
5. Read query plans on realistic volumes of data.

## 10. References

- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
