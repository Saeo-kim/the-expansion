---
title: "OAuth 2.0"
description: "Understand the authorization framework, roles, grant types, and authorization flows of OAuth 2.0."
category: "Web Security"
slug: "oauth2"
status: "published"
---

## 1. Definition

OAuth 2.0 is an authorization framework that lets an application obtain limited access to a resource on behalf of its owner, without receiving the owner's password. It is defined in RFC 6749.

A familiar example is a calendar application asking for permission to read your Google Calendar. You approve the request at Google, and the application receives a limited credential that it can use only for what you approved.

OAuth is about **delegated [authorization](/encyclopedia/authorization/)**, not login. Using it directly as proof of who a user is has led to security flaws. **OpenID Connect** is a layer on top of OAuth 2.0 that adds standardized [authentication](/encyclopedia/authentication/).

## 2. Purpose and background

Before OAuth, a third-party app that needed your data commonly asked for your password. That gave the app complete access, forced it to store the password, and left no way to revoke one app's access except by changing the password for all of them.

OAuth 1.0 addressed this in 2010, but required complex signatures on each request. OAuth 2.0, published in 2012, simplified client implementation by relying on TLS and introduced separate flows for different kinds of client.

## 3. Roles

| Role | Description | Example |
|---|---|---|
| Resource Owner | The entity able to grant access | The user |
| Client | The application requesting access | A calendar app |
| Authorization Server | Authenticates the owner and issues tokens | Google's accounts service |
| Resource Server | Hosts protected data and accepts tokens | The Calendar [API](/encyclopedia/api/) |

Important terms:

- **Scope:** the extent of the requested access, such as `calendar.read`.
- **Access [token](/encyclopedia/token/):** the credential used to call the resource server.
- **Refresh token:** a credential used to obtain new access tokens.
- **Redirect URI:** where the authorization server sends the user back.

Clients are either **confidential**, able to keep a secret on a server, or **public**, such as mobile apps and single-page applications, which cannot.

## 4. How it works: Authorization Code flow with PKCE

This is the recommended flow for applications acting on behalf of users. PKCE (Proof Key for Code Exchange, RFC 7636) ensures that a stolen authorization code cannot be redeemed by an attacker.

```text
User-Agent        Client                 Authorization Server     Resource Server
   │  1. Click login  │                          │                      │
   │─────────────────>│ create verifier/challenge│                      │
   │<─ 2. redirect ───│                          │                      │
   │── 3. authorize + challenge ────────────────>│                      │
   │<─ 4. login & consent ──────────────────────>│                      │
   │<─ 5. redirect with code + state ────────────│                      │
   │── 6. code ──────>│                          │                      │
   │                  │── 7. code + verifier ───>│                      │
   │                  │<─ 8. access token ───────│                      │
   │                  │── 9. API request with access token ────────────>│
```

### 4.1 Step 1: request authorization

```http
GET /authorize?response_type=code
    &client_id=calendar-app
    &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
    &scope=calendar.read
    &state=af0ifjsldkj
    &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
    &code_challenge_method=S256 HTTP/1.1
Host: auth.example.com
```

The line breaks are shown only for readability. `state` must be an unguessable value tied to the user's session; the client checks that the same value comes back, which defends against CSRF.

### 4.2 Step 2: exchange the code

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
&client_id=calendar-app
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

```json
{
  "access_token": "mF_9.B5f-4.1JqM",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
  "scope": "calendar.read"
}
```

### 4.3 Step 3: call the API

```http
GET /v1/events HTTP/1.1
Host: api.example.com
Authorization: Bearer mF_9.B5f-4.1JqM
```

## 5. Internal structure: grant types

| Grant | Use for | Status |
|---|---|---|
| Authorization Code with PKCE | Web, mobile, and single-page apps | Recommended |
| Client Credentials | Machine-to-machine, no user involved | Recommended |
| Device Authorization (RFC 8628) | TVs and consoles with limited input | Recommended for that case |
| Refresh Token | Renewing access without user interaction | Use with care |
| Implicit | Formerly for browser apps | Not recommended |
| Resource Owner Password | Formerly for first-party apps | Must not be used |

The current security guidance is RFC 9700. The in-progress OAuth 2.1 work consolidates these best practices and removes the Implicit and Password grants.

## 6. Practical usage: generating PKCE values

```javascript
import { createHash, randomBytes } from 'node:crypto';

const base64url = (buffer) => buffer.toString('base64url');

const verifier = base64url(randomBytes(32));
const challenge = base64url(createHash('sha256').update(verifier).digest());
```

In production, prefer a well-maintained library or a hosted identity provider over hand-written protocol code.

## 7. Relationships with other concepts

| Concept | Relationship to OAuth 2.0 |
|---|---|
| [Authorization](/encyclopedia/authorization/) | OAuth delegates a limited form of it |
| [Authentication](/encyclopedia/authentication/) | Performed by the authorization server; standardized through OpenID Connect |
| [Token](/encyclopedia/token/) | The credential OAuth issues |
| [JWT](/encyclopedia/jwt/) | One possible access-token format, and the ID token format |
| [API](/encyclopedia/api/) | The resource being protected |
| [Browser](/encyclopedia/browser/) | Carries the user through the redirects |

## 8. Advantages and limitations

**Advantages**

- Applications never see the user's password.
- Scoped access that can be revoked per application.
- Widely supported, with a mature ecosystem.

**Limitations**

- It is a framework with optional parts, so implementations vary.
- Redirect flows have many security-sensitive details.
- Access tokens are usually bearer tokens, which remain usable if stolen.
- It does not by itself define user identity.

## 9. Common errors and troubleshooting

| Error | Meaning | Solution |
|---|---|---|
| `redirect_uri_mismatch` | URI differs from the registered value | Match it exactly, including scheme and trailing slash |
| `invalid_client` | Client authentication failed | Check the client ID, secret, and auth method |
| `invalid_grant` | Code or refresh token is invalid, expired, or used | Restart the flow; codes are single-use |
| `invalid_scope` | Unknown or disallowed scope | Check the provider's documentation |
| `access_denied` | User or policy refused | Handle gracefully in the UI |
| State mismatch | Possible CSRF, or lost session | Abort; check session cookie settings |
| PKCE verification failed | Verifier does not match challenge | Confirm the same verifier and S256 base64url encoding |

Security checklist:

- Use exact redirect URI matching.
- Always use PKCE and validate `state`.
- Keep access tokens short-lived and rotate refresh tokens.
- Request the minimum scope.
- Validate token issuer and audience at the resource server.

## 10. Learning path

1. Learn [HTTP](/encyclopedia/http/) redirects and [Authentication](/encyclopedia/authentication/).
2. Understand [Authorization](/encyclopedia/authorization/) and [Token](/encyclopedia/token/) types.
3. Walk through the Authorization Code flow with PKCE.
4. Study [JWT](/encyclopedia/jwt/) validation and OpenID Connect.

## 11. References

- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
- [RFC 7636 — PKCE](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
