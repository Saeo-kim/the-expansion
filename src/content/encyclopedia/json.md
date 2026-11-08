---
title: "JSON"
description: "The syntax, data types, parsing rules, validation, and common pitfalls of JavaScript Object Notation."
category: "Data & Databases"
slug: "json"
status: "published"
---

## 1. Definition

JSON (JavaScript Object Notation) is a lightweight, text-based format for representing structured data. Although its syntax comes from [JavaScript](/encyclopedia/javascript/), JSON is language-independent, and nearly every language has a parser for it.

It is standardized by RFC 8259 and ECMA-404.

## 2. Purpose and background

Web applications in the early 2000s needed a simple way to exchange data between browsers and servers. XML was the established option, but it was verbose and required more elaborate parsing. Douglas Crockford specified and popularized JSON as a minimal alternative that maps directly onto the objects and arrays programmers already use.

It became the default body format for web [APIs](/encyclopedia/api/) and is also widely used for configuration and log events.

## 3. How it works: syntax and data types

JSON has exactly six kinds of value.

| Type | Example | Notes |
|---|---|---|
| Object | `{"id": 1}` | Unordered name-value pairs; names must be strings |
| Array | `[1, 2, 3]` | Ordered list |
| String | `"hello"` | Double quotes only, with backslash escapes |
| Number | `-3.14e2` | No `NaN`, `Infinity`, or leading zeros |
| Boolean | `true` | Lowercase |
| Null | `null` | Lowercase |

A complete document:

```json
{
  "id": 42,
  "name": "Ada Lovelace",
  "active": true,
  "manager": null,
  "roles": ["admin", "editor"],
  "address": {
    "city": "London",
    "postalCode": "W1"
  }
}
```

What JSON does **not** allow is equally important:

- No comments.
- No trailing commas.
- No single-quoted strings.
- No unquoted keys.
- No dates, binary data, or `undefined` as native types.

Dates are normally sent as ISO 8601 strings such as `"2026-11-09T07:30:00Z"`, and binary data as Base64 strings.

## 4. Internal structure: parsing and serialization

- **Serialization** converts an in-memory value to JSON text.
- **Parsing** (deserialization) converts JSON text to an in-memory value.

Parsing is a straightforward process: a tokenizer identifies strings, numbers, and punctuation, and a parser verifies the grammar and builds nested values.

RFC 8259 requires UTF-8 when JSON is exchanged between systems that are not part of a closed ecosystem. Duplicate object names produce unpredictable behavior across implementations and should be avoided.

## 5. Practical usage

### 5.1 In JavaScript

```javascript
const text = JSON.stringify({ name: 'Ada', joined: new Date(0) }, null, 2);
// Date is converted using toJSON():
// { "name": "Ada", "joined": "1970-01-01T00:00:00.000Z" }

const value = JSON.parse(text);
console.log(typeof value.joined); // "string": it does not become a Date again
```

`JSON.stringify` silently omits object properties whose values are `undefined` or functions, and it throws an error on circular references. `Map` and `Set` become `{}`.

### 5.2 In Python

```python
import json

with open("config.json", encoding="utf-8") as file:
    config = json.load(file)

print(json.dumps(config, indent=2, ensure_ascii=False))
```

### 5.3 On the command line

```bash
curl -s https://api.example.com/users | jq '.[] | select(.active) | .name'
python -m json.tool config.json    # validates and pretty-prints
```

### 5.4 Validating shape with JSON Schema

Valid JSON may still be the wrong data. JSON Schema describes the expected structure:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": { "type": "integer", "minimum": 1 },
    "name": { "type": "string", "minLength": 1 }
  },
  "additionalProperties": false
}
```

Always validate JSON received from outside your system, even when it parses successfully.

## 6. Relationships with other concepts

- An [API](/encyclopedia/api/) commonly exchanges JSON, labeled `Content-Type: application/json`.
- A [JWT](/encyclopedia/jwt/) header and payload are JSON objects.
- [Databases](/encyclopedia/database/) such as PostgreSQL offer `jsonb` columns, and document stores are built around JSON-like records.
- A [data model](/encyclopedia/model/) decides how such nested documents are shaped.

## 7. Advantages and limitations

**Advantages**

- Human-readable, simple, and universally supported.
- Maps naturally onto common programming structures.
- Easy to inspect and debug.

**Limitations**

- Repeated key names make it larger than binary formats.
- No comments, so it is awkward for hand-edited configuration. JSON5, JSONC, and YAML are common alternatives.
- No native date, decimal, or binary types.
- Large documents must usually be parsed in full, unless a streaming parser or newline-delimited JSON is used.
- Number precision depends on the parser.

JavaScript numbers lose integer accuracy above 2⁵³ − 1:

```javascript
JSON.parse('{"id": 9007199254740993}').id; // 9007199254740992
```

For this reason, large identifiers, such as 64-bit IDs, should be sent as strings. Money is safer as an integer count of minor units, or a decimal string.

## 8. Common errors and troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `Unexpected token '<'` | HTML was received instead of JSON, often an error page | Log the status and raw body |
| `Unexpected token ','` or `}` | Trailing comma | Remove it |
| `Expected property name` | Unquoted or single-quoted key | Use double quotes |
| `Unexpected end of JSON input` | Empty or cut-off response | Check for a `204` or a truncated body |
| `Converting circular structure to JSON` | Object references itself | Remove the cycle or select fields |
| Replaced characters such as `�` | Wrong encoding | Read and write as UTF-8 |
| `[object Object]` is sent | The body was not stringified | Use `JSON.stringify` |

## 9. Security considerations

- Never evaluate JSON as code. Use `JSON.parse`, not `eval`.
- Merging untrusted objects can cause **prototype pollution** through keys like `__proto__` in JavaScript.
- Limit request body size to reduce denial-of-service risk.
- JSON in a JWT is only encoded, so anyone holding the token can read it.

## 10. Learning path

1. Learn the six types and the syntax rules.
2. Parse and generate JSON in your language.
3. Consume an [API](/encyclopedia/api/) and validate its responses.
4. Compare JSON documents with relational [data models](/encyclopedia/model/).

## 11. References

- [RFC 8259 — The JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259)
- [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/)
- [JSON Schema](https://json-schema.org/)
- [jq manual](https://jqlang.org/manual/)
