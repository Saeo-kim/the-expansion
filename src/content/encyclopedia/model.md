---
title: "Data Model"
description: "How to represent entities and relationships through conceptual, logical, and physical models, normalization, and document design."
category: "Data & Databases"
slug: "model"
status: "published"
---

## 1. Definition

A data model is a structured description of what information a system holds, how that information is organized, how the pieces relate, and which rules must always be true.

It answers questions like these: What is a customer? Can an order exist without one? Can a product belong to several categories?

## 2. Purpose and background

Code is relatively easy to change, but stored data lives far longer than any one version of an application. A careful model prevents contradictory records, makes queries simpler, and gives a team shared vocabulary.

Peter Chen introduced the **entity-relationship model** in 1976, and Edgar Codd's relational work defined **normalization**. Those ideas still underpin data design today.

## 3. Levels of modeling

| Level | Question | Audience | Output |
|---|---|---|---|
| Conceptual | What things matter? | Business and developers | Entities and relationships |
| Logical | What attributes and keys exist? | Developers and analysts | Tables or documents, independent of product |
| Physical | How is it stored? | Developers and DBAs | Types, indexes, partitions |

## 4. How it works: core building blocks

- **Entity:** a thing being tracked, such as `Customer`.
- **Attribute:** a property of an entity, such as `email`.
- **Primary key:** a value that uniquely identifies a row.
- **Foreign key:** a reference to a key in another table.
- **Constraint:** a rule enforced by the [database](/encyclopedia/database/).

### 4.1 Cardinality

| Relationship | Example | Relational implementation |
|---|---|---|
| One-to-one | User and profile | Unique foreign key |
| One-to-many | Customer and orders | Foreign key on the "many" side |
| Many-to-many | Students and courses | Junction table with two foreign keys |

```text
customers 1 ─────< orders 1 ─────< order_items >───── 1 products
```

### 4.2 Key selection

| Key type | Pros | Cons |
|---|---|---|
| Natural key, e.g. an email | Has real-world meaning | Values can change |
| Sequential ID | Compact and fast | Reveals volume, and is easily guessed |
| UUID | Generated anywhere | Larger; random variants can fragment indexes |

UUIDv7 places a timestamp first, which reduces the index fragmentation of fully random IDs.

## 5. Internal structure: normalization

Normalization organizes data so that each fact is stored in exactly one place. Consider this unnormalized table:

| order_id | customer_email | customer_city | products |
|---|---|---|---|
| 1 | ada@example.com | London | pen, ink |
| 2 | ada@example.com | Paris | paper |

Here the products field holds a list, and Ada's city contradicts itself.

| Form | Rule | Fix for the table above |
|---|---|---|
| 1NF | Atomic values, no repeating groups | Move products to their own rows |
| 2NF | No dependency on just part of a composite key | Separate product details from order lines |
| 3NF | No dependency between non-key columns | Move the city to a `customers` table |

The result in [SQL](/encyclopedia/sql/):

```sql
CREATE TABLE customers (
  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  city  TEXT NOT NULL
);

CREATE TABLE products (
  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0)
);

CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers (id)
);

CREATE TABLE order_items (
  order_id   BIGINT  NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id BIGINT  NOT NULL REFERENCES products (id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
```

`unit_price_cents` looks like duplicated data, but it isn't: it records the historic price at the moment of purchase, which is a different fact from today's price.

**Denormalization** deliberately stores redundant data to speed up reads. Use it only after measuring a real need, and make sure there is a reliable way of keeping the copies in sync.

## 6. Practical usage: relational and document models

In a document database, the same order could be represented as a single [JSON](/encyclopedia/json/) document.

```json
{
  "_id": 981,
  "customer": { "id": 7, "email": "ada@example.com" },
  "items": [
    { "productId": 3, "name": "Pen", "quantity": 2, "unitPriceCents": 150 }
  ]
}
```

| Choose embedding when… | Choose references when… |
|---|---|
| Data is read together | Data is shared by many parents |
| The child belongs to one parent | The child set can grow without limit |
| The child list is bounded | The child is updated independently |

Analytical warehouses often use a **star schema**, with a central fact table surrounded by descriptive dimension tables, to support aggregations across large histories.

**Begin by listing the questions the application must answer.** A model that is theoretically clean but cannot serve its main access patterns efficiently is not finished.

## 7. Relationships with other concepts

- A [database](/encyclopedia/database/) enforces and stores the physical model.
- [SQL](/encyclopedia/sql/) expresses and queries relational models.
- [JSON](/encyclopedia/json/) represents nested document models.
- An [API](/encyclopedia/api/) exposes a representation that need not match the storage model.

## 8. Advantages and limitations

**Advantages**

- Prevents contradictory and duplicated data.
- Makes system behavior easier to reason about.
- Lets the database reject invalid states.

**Limitations**

- Heavy normalization can make common reads require many joins.
- Requirements change, and migrations on live data are costly.
- A model represents assumptions. Names, addresses, and time zones are more varied than most schemas allow.

## 9. Common errors and troubleshooting

| Mistake | Consequence | Better approach |
|---|---|---|
| Comma-separated IDs in one column | No foreign keys, slow searching | Junction table |
| Money stored as a float | Rounding errors | Integer minor units or `NUMERIC` |
| Local timestamps with no zone | Ambiguous times | Store UTC, such as `TIMESTAMPTZ` |
| Assuming an email is an immutable identity | Painful changes | Use an internal surrogate key |
| `NULL` with several meanings | Unclear logic | Add explicit status columns |
| Physical deletion of audited data | Lost history and broken references | Archive or use soft deletes deliberately |
| Generic attribute-value tables | Weak typing, and complex queries | Model real columns, or use a JSON column |

When adding a required column to a live table, migrate in stages: add it as nullable, backfill, deploy code that writes it, and then add the `NOT NULL` constraint.

## 10. Learning path

1. Identify entities and relationships for a small application.
2. Normalize the design to 3NF.
3. Implement it in [SQL](/encyclopedia/sql/).
4. Add indexes based on [Database](/encyclopedia/database/) query plans.
5. Redesign it as [JSON](/encyclopedia/json/) documents and compare the trade-offs.

## 11. References

- Peter Chen, "The Entity-Relationship Model" (1976)
- E. F. Codd, "A Relational Model of Data for Large Shared Data Banks" (1970)
- [PostgreSQL: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [MongoDB: Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
