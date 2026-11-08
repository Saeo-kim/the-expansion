---
title: "Token"
description: "How security tokens represent identity and access, the difference between opaque and structured tokens, and how to handle them safely."
category: "Web Security"
slug: "token"
status: "published"
---

## 1. Definition

In security, a token is a piece of data that represents identity, authorization, or a verified fact, and which a system accepts in place of repeatedly presenting the original credentials.

After a user logs in once, the application can issue a token. Later requests present that token rather than the password.

The word has other technical meanings. A compiler's **lexer** splits code into tokens, and a language model divides text into tokens. This page concerns security tokens.

## 2. Purpose and background

[HTTP](/encyclopedia/http/) is stateless, so each request needs its own proof of identity. Sending a password each time would multiply exposure of the most valuable secret.

Tokens offer a better alternative. They can be limited in lifetime, limited in what they allow, and revoked without changing the password. The growth of [APIs](/encyclopedia/api/), mobile applications, and third-party integrations made these properties essential, and standards such as [OAuth 2.0](/encyclopedia/oauth2/) and [JWT](/encyclopedia/jwt/) formalized them.

## 3. How it works

```text
1. Client  → Authorization Server : proves identity
2. Client  ← Authorization Server : issues a token
3. Client  → Resource Server      : Authorization: Bearer <token>
4. Resource Server                : validates the token, then authorizes
5. Client  ← Resource Server      : protected data or an error
```

The server must validate each token, then separately determine what the holder may do. A valid token proves very little on its own. See [Authorization](/encyclopedia/authorization/).

## 4. Internal structure: token types

### 4.1 Opaque versus structured

| | Opaque token | Structured token, e.g. JWT |
|---|---|---|
| Content | A random string with no readable meaning | Encoded claims and a signature |
| Validation | Look up in a store, or call an introspection endpoint | Verify the signature locally |
| Revocation | Immediate: delete the record | Needs short lifetimes or a denylist |
| Payload visibility | Hidden from the client | Readable by anybody who holds it |
| Network dependency | One lookup per validation | None for basic validation |

### 4.2 Purpose

| Token | Audience | Purpose | Typical lifetime |
|---|---|---|---|
| Access token | Resource server | Calls a protected API | Minutes |
| Refresh token | Authorization server | Obtains new access tokens | Days to months |
| ID token | Client application | Describes a login in OpenID Connect | Minutes |
| Session ID | The issuing application | Refers to server-side session state | Hours |
| API key | An API | Identifies a calling project | Long-lived, rotated |
| CSRF token | The issuing application | Confirms a request came from your form | Per session or request |

### 4.3 Bearer and sender-constrained tokens

A **bearer token** can be used by whoever holds it, like cash. That is why transport security and careful storage are mandatory.

A **sender-constrained token** is bound to a key that the client must prove it holds. DPoP (RFC 9449) and mutual-TLS-bound tokens (RFC 8705) use this approach, so a stolen token alone is not enough.

## 5. Practical usage

### 5.1 Generating an opaque token

Use a cryptographically secure random generator, never `Math.random()`. Store only a hash, so a database leak does not reveal usable tokens.

```python
import hashlib
import hmac
import secrets

def issue_token():
    token = secrets.token_urlsafe(32)   # 256 bits of randomness
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    return token, token_hash            # return token to the client; store the hash

def matches(presented, stored_hash):
    digest = hashlib.sha256(presented.encode()).hexdigest()
    return hmac.compare_digest(digest, stored_hash)
```

Fast hashing like SHA-256 is acceptable here because the token is already high-entropy. Human-chosen passwords need a slow password hash such as Argon2id instead.

### 5.2 Validating a token

A resource server should, at a minimum:

1. Reject a missing or malformed token.
2. Verify its signature, or look it up.
3. Check the expiry and not-before times.
4. Check the issuer and the audience.
5. Check scopes and permissions for this particular operation.

### 5.3 Where a web client should store tokens

| Location | Risk | Notes |
|---|---|---|
| `HttpOnly`, `Secure`, `SameSite` cookie | CSRF, if misconfigured | Script cannot read the value |
| In-memory variable | Lost on reload; XSS can still use it | Combine with a refresh mechanism |
| `localStorage` | Any XSS can read it | Generally avoid for sensitive tokens |

### 5.4 Refresh rotation

With **rotation**, each refresh returns a new refresh token and invalidates the previous one. If a retired token is presented again, it may indicate theft. The server should revoke that entire token family.

## 6. Relationships with other concepts

- [JWT](/encyclopedia/jwt/) is one common format for a token.
- [OAuth 2.0](/encyclopedia/oauth2/) defines how tokens are requested and issued.
- [Authentication](/encyclopedia/authentication/) precedes token issuance.
- [HTTP](/encyclopedia/http/) carries tokens in headers or cookies.

## 7. Advantages and limitations

**Advantages**

- Passwords are not sent on every request.
- Access can be limited in scope and time.
- Individual access can be revoked without changing credentials.

**Limitations**

- A stolen bearer token grants access until it expires or is revoked.
- Stateless tokens are difficult to revoke immediately.
- Tokens that are too long-lived replicate the risks of passwords.
- Lifecycle management adds implementation complexity.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| Sudden 401 after working | Token expired | Refresh and retry once |
| 401 only on one server | Clock skew or differing keys | Sync time; allow small leeway |
| `invalid_grant` on refresh | Refresh token expired, used, or revoked | Require login again |
| 401 with a correct token | Header format or wrong audience | Must be `Authorization: Bearer <token>` |
| Tokens appear in logs | Logging full headers or URLs | Redact, and never place tokens in query strings |
| Parallel requests log the user out | Simultaneous rotation | Serialize refreshes in the client |

If a token is exposed, revoke it right away, find how it leaked, and review access logs for the period it was exposed.

## 9. Learning path

1. Learn [Authentication](/encyclopedia/authentication/) and [HTTP](/encyclopedia/http/) statelessness.
2. Compare sessions and tokens.
3. Decode a [JWT](/encyclopedia/jwt/) and verify its signature.
4. Follow the [OAuth 2.0](/encyclopedia/oauth2/) authorization code flow.
5. Practice token rotation, revocation, and storage strategy.

## 10. References

- [RFC 6750 — OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750)
- [RFC 7009 — OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009)
- [RFC 7662 — OAuth 2.0 Token Introspection](https://www.rfc-editor.org/rfc/rfc7662)
- [RFC 9449 — DPoP](https://www.rfc-editor.org/rfc/rfc9449)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
