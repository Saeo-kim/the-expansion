
---
title: "JSON Web Token (JWT)"
description: "Understand the structure, claims, authentication flow, and security considerations of JSON Web Tokens."
category: "Web Security"
slug: "jwt"
status: "published"
---

# JSON Web Token (JWT)

## 1. Definition

JSON Web Token (JWT) is an open standard for representing information as a JSON object that can be securely transferred between two parties.

JWT is commonly used in web applications for authentication and information exchange.

It is defined in RFC 7519.

## 2. Why JWT Is Used

Web applications need a way to identify users and verify their access to protected resources.

After a user logs in, a server can issue a JWT that the client sends with subsequent requests.

The server validates the token before deciding whether to process the request.

JWT is a token format, not an authentication system by itself. The application must implement the appropriate validation and authorization logic.

## 3. JWT Structure

A signed JWT commonly consists of three Base64URL-encoded parts separated by periods.

```text
Header.Payload.Signature
```

### 3.1 Header

The Header contains metadata about the token, including its type and signing algorithm.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: The algorithm used to sign the token.
- `typ`: The media type of the token.

### 3.2 Payload

The Payload contains claims, which represent statements about an entity or additional information.

Example:

```json
{
  "sub": "user123",
  "iss": "saeo-labs",
  "aud": "expansion-app",
  "iat": 1793500000,
  "exp": 1793503600
}
```

The Payload is not encrypted in a typical signed JWT.

Anyone who obtains the token can decode and read its contents.

Never store passwords, secret keys, or other sensitive information in a regular JWT payload.

### 3.3 Signature

The Signature is used to verify the integrity and authenticity of the token.

For example, an HS256 signature is generated using an HMAC with SHA-256 and a shared secret key.

The server uses the appropriate key and algorithm to verify the signature.

If the token has been modified, signature verification should fail.

## 4. Claims

A Claim is a piece of information represented in the JWT Payload.

JWT defines several Registered Claims.

| Claim | Full Name | Description |
|---|---|---|
| iss | Issuer | Identifies who issued the token |
| sub | Subject | Identifies the subject of the token |
| aud | Audience | Identifies the intended recipient |
| exp | Expiration Time | Defines when the token expires |
| iat | Issued At | Indicates when the token was issued |
| nbf | Not Before | Defines when the token becomes valid |
| jti | JWT ID | Provides a unique identifier for the token |

### 4.1 NumericDate

NumericDate is the numeric date representation used by JWT.

It represents the number of seconds since the Unix epoch, excluding leap seconds.

For example, the `exp` claim represents the expiration time as a NumericDate value.

## 5. Authentication Flow

A typical JWT-based authentication flow works as follows.

1. The user submits login credentials.
2. The server verifies the credentials.
3. The server generates and signs a JWT.
4. The server sends the token to the client.
5. The client stores the token according to the application's security design.
6. The client includes the token in subsequent requests.
7. The server validates the token.
8. The server determines whether the request should be allowed.

### 5.1 Example HTTP Request

A client commonly sends an access token using the Authorization header.

```http
GET /api/profile HTTP/1.1
Host: example.com
Authorization: Bearer <access_token>
```

The `Bearer` authentication scheme indicates that the request includes a bearer token.

## 6. Access Token and Refresh Token

Access Tokens and Refresh Tokens serve different purposes.

### 6.1 Access Token

An Access Token is used to access protected resources.

It generally has a relatively short lifetime to reduce the impact of token theft.

### 6.2 Refresh Token

A Refresh Token is used to obtain a new Access Token without requiring the user to authenticate again.

Refresh Tokens require careful storage, expiration, rotation, and revocation policies.

## 7. Security Considerations

JWT implementation requires careful security decisions.

Important considerations include:

- Always verify the token signature.
- Explicitly allow only trusted signing algorithms.
- Validate claims such as `exp`, `iss`, and `aud` when applicable.
- Never store passwords or secret keys in the Payload.
- Use HTTPS to protect tokens during transmission.
- Protect tokens against theft and unauthorized access.
- Consider XSS and CSRF risks depending on the token storage mechanism.
- Avoid exposing complete tokens in application logs.
- Define appropriate expiration and revocation strategies.

## 8. JWT and Related Technologies

JWT is connected to several important web technologies.

| Concept | Relationship to JWT |
|---|---|
| HTTP | Transports requests containing tokens |
| Authentication | Establishes the identity of a user |
| Authorization | Determines what an authenticated user can access |
| Cookie | Can be used as a mechanism to store and send tokens |
| Session | An alternative approach to maintaining authentication state |
| OAuth 2.0 | An authorization framework that can use JWT-formatted tokens |
| OpenID Connect | An identity layer built on top of OAuth 2.0 |
| Access Token | A credential used to access protected resources |
| Refresh Token | A credential used to obtain new access tokens |

## 9. Standards and References

- RFC 7519 — JSON Web Token (JWT)
- RFC 7515 — JSON Web Signature (JWS)
- RFC 7516 — JSON Web Encryption (JWE)
- RFC 8725 — JSON Web Token Best Current Practices

Official references:

- https://www.rfc-editor.org/rfc/rfc7519
- https://www.rfc-editor.org/rfc/rfc7515
- https://www.rfc-editor.org/rfc/rfc7516
- https://www.rfc-editor.org/rfc/rfc8725
