---
title: "API"
description: "How application programming interfaces define contracts between software, with REST design, examples, and failure handling."
category: "Web Technologies"
slug: "api"
status: "published"
---

## 1. Definition

An API (Application Programming Interface) is a defined contract through which one piece of software uses the capabilities of another. It specifies which operations are available, what inputs they take, what they return, and how they fail, while hiding how the work is performed.

The term covers more than web services:

| Kind | Example |
|---|---|
| Library API | `Array.prototype.map` in [JavaScript](/encyclopedia/javascript/) |
| Operating system API | POSIX `open()` and `read()` |
| Browser API | `fetch`, Geolocation |
| Web API | `GET https://api.example.com/users/42` |

The rest of this page focuses on web APIs.

## 2. Purpose and background

Interfaces allow teams and systems to change independently. A mobile app, a website, and a partner's system can use the same backend, and the backend can be rewritten as long as the contract holds.

Early web services often used SOAP with XML. In his 2000 dissertation, Roy Fielding described **REST**, an architectural style derived from the design of the Web itself. Over time, HTTP APIs that use [JSON](/encyclopedia/json/) became the mainstream approach.

## 3. How it works

A typical request cycle:

1. A client sends an [HTTP](/encyclopedia/http/) request to an endpoint.
2. The server authenticates and authorizes the caller.
3. Input is validated.
4. Business logic runs, usually reading or writing a [database](/encyclopedia/database/).
5. The server returns a status code and a representation.

```http
POST /v1/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Content-Type: application/json
Idempotency-Key: 3f2a9c1e-77b1-4a42-9f0e-2c6a0d1e8b55

{"productId": 7, "quantity": 2}
```

```http
HTTP/1.1 201 Created
Location: /v1/orders/981
Content-Type: application/json

{"id": 981, "productId": 7, "quantity": 2, "status": "pending"}
```

## 4. Internal structure: API styles

| Style | Model | Strengths | Trade-offs |
|---|---|---|---|
| REST | Resources over HTTP | Simple, cacheable, ubiquitous | Can over-fetch or under-fetch |
| GraphQL | Client-specified queries | Flexible field selection | Harder caching and cost control |
| gRPC | Remote procedures with Protobuf | Efficient, strongly typed | Limited direct browser support |
| WebSocket | Long-lived two-way messages | Real-time updates | Connection state to manage |
| Webhook | Provider calls your URL on an event | No polling | Needs signature checks and retries |

### 4.1 REST conventions

| Operation | Request | Success |
|---|---|---|
| List | `GET /users?limit=20` | 200 |
| Read | `GET /users/42` | 200 |
| Create | `POST /users` | 201 |
| Replace | `PUT /users/42` | 200 or 204 |
| Partly update | `PATCH /users/42` | 200 |
| Delete | `DELETE /users/42` | 204 |

Use nouns for resources and let the HTTP method express the action: prefer `POST /users` over `POST /createUser`.

## 5. Practical usage

A minimal endpoint in Express with input validation and proper status codes:

```javascript
import express from 'express';

const app = express();
app.use(express.json());

const books = new Map([[1, { id: 1, title: 'Compilers' }]]);
let nextId = 2;

app.get('/v1/books/:id', (req, res) => {
  const book = books.get(Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'book_not_found' });
  res.json(book);
});

app.post('/v1/books', (req, res) => {
  const { title } = req.body ?? {};
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title_required' });
  }
  const book = { id: nextId++, title: title.trim() };
  books.set(book.id, book);
  res.status(201).location(`/v1/books/${book.id}`).json(book);
});

app.listen(3000);
```

Good production APIs also provide:

- **Documentation** through a machine-readable OpenAPI description.
- **Versioning**, so breaking changes do not break existing clients.
- **Pagination** with a `limit` and cursor on collections.
- **Consistent errors**, for example the Problem Details format in RFC 9457.
- **Idempotency keys** for retried payments or orders.
- **Rate limits**, returning `429` with `Retry-After`.

## 6. Relationships with other concepts

- [HTTP](/encyclopedia/http/) provides the transport and semantics.
- [JSON](/encyclopedia/json/) is the most common data format.
- [OAuth 2.0](/encyclopedia/oauth2/) delegates access to APIs.
- [JavaScript](/encyclopedia/javascript/) clients typically call APIs using `fetch`.

## 7. Advantages and limitations

**Advantages**

- Decouples clients from implementations.
- One backend can serve many types of clients.
- Enables integration with external services.

**Limitations**

- A published contract is difficult to change.
- Network calls can be slow or fail partway through, unlike local function calls.
- Every endpoint expands the attack surface.

The most frequent serious API vulnerability is **broken object level authorization**: an endpoint verifies who the caller is but fails to verify that they may access the specific object requested. Always check ownership. See [Authorization](/encyclopedia/authorization/).

## 8. Common errors and troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| 400 from a seemingly correct body | Missing `Content-Type: application/json` | Add the header and validate the JSON |
| 401 | Absent, expired, or wrong token | Decode and check the token's lifetime and audience |
| 403 | Insufficient scopes or role | Compare granted and required permissions |
| CORS error in browser only | Missing response headers on the API | Configure allowed origins on the server |
| Duplicate records after a retry | Non-idempotent POST | Add idempotency keys |
| Slow list endpoint | N+1 queries or no pagination | Batch queries; add limits and indexes |
| 429 | Exceeded rate limit | Back off exponentially with jitter |

Clients should always set timeouts and retry only safe or idempotent operations.

## 9. Learning path

1. Learn [HTTP](/encyclopedia/http/) and [JSON](/encyclopedia/json/).
2. Call a public API using curl and `fetch`.
3. Build a CRUD API backed by a [Database](/encyclopedia/database/).
4. Add [Authentication](/encyclopedia/authentication/) and [Authorization](/encyclopedia/authorization/).
5. Study versioning, rate limiting, and OpenAPI.

## 10. References

- [Roy Fielding's dissertation: REST](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
