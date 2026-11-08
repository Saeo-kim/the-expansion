---
title: "HTTP (Hypertext Transfer Protocol)"
description: "Understand HTTP, its request-response model, methods, status codes, headers, and role in web communication."
category: "Web Technologies"
slug: "http"
status: "published"
---

## 1. Definition

HTTP (Hypertext Transfer Protocol) is an application-layer protocol used for communication between clients and servers. It is the protocol that makes communication on the [Web](/encyclopedia/web-concept/) possible.

It defines how messages are formatted and exchanged over a network.

HTTP is commonly used when a web browser requests resources from a web server.

## 2. Why HTTP exists

A browser needs a standardized way to request resources from a server. HTTP defines how those requests and responses are structured and exchanged, so any compliant client can communicate with any compliant server.

Tim Berners-Lee created the first version around 1990. The semantics, including methods, status codes, and headers, are now defined separately from wire formats in RFC 9110.

## 3. Client-Server Model

HTTP follows a [client-server](/encyclopedia/client-server/) communication model.

- Client: Sends a request.
- [Server](/encyclopedia/server/): Processes the request and returns a response.

For example:

1. A user enters a website address in a browser.
2. The browser sends an HTTP request.
3. The web server receives and processes the request.
4. The server sends an HTTP response.
5. The browser displays the returned content.

## 4. HTTP Request

An HTTP request is a message sent by a client to a server.

A request generally contains:

- Request method
- Request target
- HTTP version
- Headers
- Optional message body

### Example

```http
GET /products HTTP/1.1
Host: example.com
Accept: application/json
```

## 5. HTTP Response

A response contains a status code, headers, and potentially a message body.

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60
Content-Length: 26

{"id":1,"name":"Notebook"}
```

## 6. Methods

| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| GET | Retrieve a representation | Yes | Yes |
| HEAD | Like GET, without the body | Yes | Yes |
| POST | Process data, often creating a resource | No | No |
| PUT | Replace the target's state | No | Yes |
| PATCH | Partially modify a resource | No | Not necessarily |
| DELETE | Remove the target | No | Yes |
| OPTIONS | Ask which options are available | Yes | Yes |

- **Safe** methods are read-only in intent.
- **Idempotent** means that repeating the request has the same intended effect as sending it once. This determines whether a client can safely retry after a timeout.

## 7. Status codes

| Class | Meaning | Common examples |
|---|---|---|
| 1xx | Informational | 101 Switching Protocols |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client error | 400, 401, 403, 404, 409, 429 |
| 5xx | Server error | 500, 502, 503, 504 |

A frequent point of confusion:

- **401 Unauthorized** means valid [authentication](/encyclopedia/authentication/) is missing, despite the name.
- **403 Forbidden** means the identity is known, but [authorization](/encyclopedia/authorization/) was denied.

## 8. Headers

| Header | Direction | Purpose |
|---|---|---|
| `Host` | Request | Selects the site on a shared server |
| `Accept` | Request | Preferred response formats |
| `Authorization` | Request | Credentials, such as a [token](/encyclopedia/token/) |
| `Cookie` / `Set-Cookie` | Request / Response | Client-held state |
| `Content-Type` | Both | Format of the body |
| `Cache-Control` | Both | Caching rules |
| `ETag` | Response | Version identifier for conditional requests |
| `Location` | Response | Redirect target or new resource |

## 9. Internal structure: protocol versions and layers

| Version | Transport | Key feature |
|---|---|---|
| HTTP/1.1 | TCP | Text messages, persistent connections |
| HTTP/2 | TCP | Binary framing and multiplexed streams |
| HTTP/3 | QUIC over UDP | Streams that do not block one another on packet loss |

HTTPS is HTTP protected by TLS, which provides encryption, integrity, and server authentication.

**Statelessness:** the protocol does not require a server to remember earlier requests. Applications add continuity through cookies, sessions, and tokens such as [JWT](/encyclopedia/jwt/).

**Caching:** with `Cache-Control` and validators such as `ETag`, a client can avoid downloading unchanged content and receive a body-less `304 Not Modified`.

## 10. Practical usage

Inspect an exchange with curl:

```bash
curl -i https://example.com/                  # include response headers
curl -v https://example.com/ -o /dev/null     # show the full conversation

curl -X POST https://api.example.com/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId": 7, "quantity": 2}'
```

## 11. Relationships with other concepts

| Concept | Relationship to HTTP |
|---|---|
| [Browser](/encyclopedia/browser/) | The most common HTTP client |
| [Server](/encyclopedia/server/) | Receives requests and sends responses |
| [API](/encyclopedia/api/) | Web APIs are typically built on HTTP |
| [JSON](/encyclopedia/json/) | The most common API body format |
| [JWT](/encyclopedia/jwt/) | Often carried in the `Authorization` header |

## 12. Advantages and limitations

**Advantages**

- Simple, widely supported, and easy to inspect.
- Extensible through headers.
- Statelessness allows requests to be spread across many servers.
- Built-in support for caching and content negotiation.

**Limitations**

- Primarily request-response; a server cannot push freely without WebSockets, Server-Sent Events, or similar.
- Plain HTTP is readable and modifiable in transit, so production sites need HTTPS.
- Header overhead can be significant for very small messages.

## 13. Common errors and troubleshooting

| Status or symptom | Likely cause | First step |
|---|---|---|
| 400 Bad Request | Malformed syntax or invalid body | Validate the payload and `Content-Type` |
| 401 | Missing or expired credentials | Check the `Authorization` header and token expiry |
| 403 | Authenticated, not permitted | Check roles and scopes |
| 404 | Wrong URL or resource absent | Check the path, including letter case |
| 405 | Method not supported on this route | Compare the method with the API documentation |
| 429 | Rate limit exceeded | Honor `Retry-After` and back off |
| 500 | Unhandled application error | Read server logs |
| 502 / 504 | Proxy received a bad response, or timed out upstream | Check the upstream application |
| Redirect loop | Conflicting HTTP and HTTPS rules | `curl -IL` to follow each hop |

## 14. Learning path

1. Understand the [Client & Server](/encyclopedia/client-server/) roles.
2. Practice with curl and the browser's Network panel.
3. Learn caching and HTTPS.
4. Design an [API](/encyclopedia/api/).
5. Secure it with [Authentication](/encyclopedia/authentication/) and [OAuth 2.0](/encyclopedia/oauth2/).

## 15. References

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)
- [RFC 9114 — HTTP/3](https://www.rfc-editor.org/rfc/rfc9114)
- [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
