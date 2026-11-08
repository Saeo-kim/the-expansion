---
title: "Database"
description: "How database systems store, protect, and retrieve data, including ACID transactions, indexes, replication, and NoSQL trade-offs."
category: "Data & Databases"
slug: "database"
status: "published"
---

## 1. Definition

A database is an organized collection of data that can be stored, retrieved, and updated efficiently. A **Database Management System (DBMS)** is the software that provides those functions, such as PostgreSQL, MySQL, SQLite, or MongoDB.

In everyday use, "database" refers to both the data and the software managing it.

## 2. Purpose and background

Applications could keep data in plain files, but files alone become inadequate when many users change data simultaneously, when a crash occurs mid-write, or when one record must be located among billions. A DBMS addresses concurrency, durability, integrity, access control, and fast retrieval in one system.

Hierarchical and network databases of the 1960s required programs to follow fixed navigation paths. Edgar Codd's relational model (1970) separated logical data from physical storage. NoSQL systems rose in the 2000s to address the scale and flexibility needs of large web services.

## 3. How it works

### 3.1 Life of a query

```text
Client → Connection → Parser → Planner/Optimizer → Executor → Storage engine → Disk
                                                       ↕
                                                  Buffer pool (RAM)
```

Data is stored in fixed-size **pages**, commonly 8 KB in PostgreSQL. Frequently used pages stay in memory, because reading RAM is orders of magnitude faster than reading storage. See [Hardware](/encyclopedia/hardware/) for the numbers.

### 3.2 ACID transactions

| Property | Guarantee |
|---|---|
| **Atomicity** | All operations in a transaction apply, or none of them do |
| **Consistency** | A transaction moves the database between valid states |
| **Isolation** | Concurrent transactions are protected from each other, to the configured level |
| **Durability** | Committed data survives a crash |

**Durability** is usually achieved with a **write-ahead log (WAL)**. A change is recorded in an append-only log and flushed before commit, and the data pages are updated later. After a crash, the log is replayed.

### 3.3 Indexes

Without an index, a query scans every row. A **B-tree** index keeps keys in sorted order, finding a row in O(log n) time while also supporting range queries. Because each index must be updated on writes, indexes speed up reads at the cost of writes and storage.

### 3.4 Concurrency control

Many systems use **Multi-Version Concurrency Control (MVCC)**: a write creates a new version of a row, and readers see a consistent snapshot, so reads do not block writes.

| Isolation level | Prevents |
|---|---|
| Read Committed | Dirty reads |
| Repeatable Read | Also non-repeatable reads |
| Serializable | Results equivalent to some serial order |

Exact behavior differs between products. PostgreSQL's Repeatable Read, for instance, also prevents phantom reads.

## 4. Internal structure: database categories

| Type | Data shape | Examples | Good for |
|---|---|---|---|
| Relational | Tables with schemas | PostgreSQL, MySQL | Business data, transactions |
| Document | JSON-like documents | MongoDB | Records with varied structure |
| Key-value | Key to opaque value | Redis, DynamoDB | Caches, sessions |
| Wide-column | Column families | Cassandra | High write volume |
| Graph | Nodes and edges | Neo4j | Highly connected data |
| Search | Inverted index | Elasticsearch | Full-text search |
| Time-series | Timestamped points | TimescaleDB | Metrics, sensor data |

### 4.1 Scaling

- **Vertical scaling** uses a bigger machine.
- **Read replicas** copy data from a primary and serve reads. Asynchronous replicas can lag behind, so a user may not immediately see their own write.
- **Sharding** divides data between nodes by a key. It raises capacity but complicates cross-shard joins and transactions.

The **CAP theorem** states that, during a network partition, a distributed data store must choose between consistency and availability. In the absence of partitions, the practical trade-off is often between latency and consistency.

## 5. Practical usage

A web application should normally reuse connections through a pool, because establishing a database connection is expensive:

```javascript
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

export async function transfer(from, to, cents) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2', [cents, from]);
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2', [cents, to]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

Backups are only trustworthy after you have restored from them:

```bash
pg_dump -Fc mydb > mydb.dump
createdb mydb_restore_test
pg_restore -d mydb_restore_test mydb.dump
```

## 6. Relationships with other concepts

- [SQL](/encyclopedia/sql/) is the standard language of relational databases.
- A [data model](/encyclopedia/model/) defines how data is organized.
- [JSON](/encyclopedia/json/) documents can be stored in document stores or relational JSON columns.
- A database usually runs on a [server](/encyclopedia/server/) that an application connects to.

## 7. Advantages and limitations

**Advantages**

- Reliable, concurrent access to shared data.
- Integrity enforced with constraints and transactions.
- Efficient retrieval across very large volumes of data.

**Limitations**

- Operational overhead: upgrades, backups, monitoring, and capacity.
- Distributed configurations introduce consistency trade-offs.
- Schema migrations can be risky on large tables.
- Choosing a model that does not suit your access patterns is expensive to reverse.

## 8. Common errors and troubleshooting

| Symptom | Cause | Action |
|---|---|---|
| `too many connections` | Pool too large, or connections leak | Add pooling; always release connections |
| `deadlock detected` | Transactions acquire locks in opposite orders | Standardize order; retry the transaction |
| Queries slowly degrade as data grows | Missing indexes or outdated statistics | `EXPLAIN ANALYZE`, then `ANALYZE` |
| Reads return stale data after a write | Replica lag | Read from the primary for read-your-writes flows |
| Connection refused | Service is down, wrong host, or firewall | Test with `psql` and check the listen address |
| Disk full | Growth, log retention, or bloat | Check WAL and table sizes |
| Inconsistent values after an error | Missing transaction | Wrap related writes together |

## 9. Learning path

1. Design tables with [Data Model](/encyclopedia/model/).
2. Learn queries with [SQL](/encyclopedia/sql/).
3. Practice transactions, isolation, and indexes.
4. Practice backup and restore.
5. Compare relational designs to document and key-value alternatives.

## 10. References

- [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)
- Martin Kleppmann, *Designing Data-Intensive Applications*
- [CMU Intro to Database Systems](https://15445.courses.cs.cmu.edu/)
