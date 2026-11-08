---
title: "Authentication"
description: "An introduction to authentication, identity verification, credentials, and authentication methods."
category: "Web Security"
slug: "authentication"
status: "published"
---



## 1. Definition

Authentication is the process of verifying the identity of a user, device, or system.

It answers the question:

**Who are you?**

## 2. Authentication vs. Authorization

Authentication and authorization are different security processes.

| Concept | Question | Purpose |
|---|---|---|
| Authentication | Who are you? | Verifies identity |
| Authorization | What can you access? | Determines permissions |

## 3. Authentication Factors

Authentication commonly uses three categories of factors.

### 3.1 Something You Know

- Password
- PIN
- Security answer

### 3.2 Something You Have

- Smartphone
- Hardware security key
- Authentication token

### 3.3 Something You Are

- Fingerprint
- Facial recognition
- Iris recognition

## 4. Multi-Factor Authentication

Multi-Factor Authentication (MFA) requires multiple authentication factors.

For example, a user may enter a password and confirm their identity using an authentication application.

Using different factor categories provides stronger protection than relying on a password alone.

## 5. Common Authentication Methods

### 5.1 Password-Based Authentication

The user provides a username and password. The server verifies the credentials against the stored account information.

Passwords should be stored using secure password-hashing algorithms, not as plain text.

### 5.2 One-Time Password

A One-Time Password (OTP) is a temporary code used for authentication.

### 5.3 Biometric Authentication

Biometric authentication uses physical or behavioral characteristics, such as fingerprints or facial recognition.

### 5.4 Certificate-Based Authentication

Digital certificates can be used to establish the identity of users, devices, or servers.

### 5.5 Token-Based Authentication

A system may issue a token after successful authentication. The token can be used in subsequent requests according to the application's security design.

Examples include JSON Web Tokens (JWT) and opaque tokens.

## 6. Authentication Flow

A typical web application login process works as follows:

1. The user submits a username and password.
2. The server receives the credentials over HTTPS.
3. The server retrieves the corresponding account.
4. The server verifies the submitted password.
5. If verification succeeds, the application establishes an authenticated session or issues a token.
6. The user can make authenticated requests.

## 7. Authentication in Spring Security

Spring Security provides authentication functionality for Java applications.

Important components include:

| Component | Responsibility |
|---|---|
| Authentication | Represents authentication information |
| AuthenticationManager | Coordinates authentication |
| AuthenticationProvider | Performs authentication |
| UserDetailsService | Loads user information |
| UserDetails | Represents user details |
| PasswordEncoder | Handles password encoding and verification |
| SecurityContext | Holds the current security context |

## 8. Session-Based Authentication

HTTP is stateless by default. A web application therefore needs a mechanism to maintain authentication between requests.

A common session-based process:

1. The user logs in.
2. The server creates a session.
3. The server sends a session identifier through a cookie.
4. The browser sends the cookie with subsequent requests.
5. The server identifies the session and its authenticated user.

## 9. Token-Based Authentication

A common token-based process:

1. The user authenticates.
2. The system issues a token.
3. The client stores the token.
4. The client sends the token with subsequent requests.
5. The server validates the token.

## 10. Security Considerations

- Use HTTPS.
- Store passwords using secure password-hashing algorithms.
- Apply rate limiting to login attempts.
- Protect session identifiers and tokens.
- Implement secure account recovery.
- Expire or revoke credentials when necessary.
- Avoid exposing sensitive authentication information in logs.

## 11. Advantages and Limitations of Common Approaches

| Approach | Advantages | Limitations |
|---|---|---|
| Passwords | Universally understood, inexpensive | Phishing, reuse, and credential stuffing |
| OTP apps | Adds a possession factor | Codes can still be phished in real time |
| Passkeys / WebAuthn | Bound to the site, resistant to phishing | Account recovery needs planning |
| Biometrics | Convenient, usually verified on-device | Cannot be changed if compromised |
| Server-side sessions | Easy to revoke immediately | Requires shared session storage |
| Stateless [tokens](/encyclopedia/token/) | Can be validated without a lookup | Hard to revoke before expiry |

## 12. Common Errors and Troubleshooting

| Symptom or Mistake | Likely Cause | Solution |
|---|---|---|
| Valid users cannot log in after a migration | Password hash format or parameters changed | Support the old format and rehash on next login |
| "User not found" versus "Wrong password" | Messages reveal which accounts exist | Return one generic failure message |
| Login succeeds but the next request is anonymous | Session cookie was not stored or sent | Check `Secure`, `SameSite`, and domain attributes |
| Repeated 401 responses | Expired token or session | Refresh, or send the user to log in |
| Same session ID before and after login | Session fixation risk | Issue a new session ID on login |
| Thousands of failed logins | Credential stuffing | Rate-limit, add MFA, and monitor |

Password storage should use a dedicated slow hash. A minimal example with Argon2 in Python:

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

hasher = PasswordHasher()
stored = hasher.hash("correct horse battery staple")

try:
    hasher.verify(stored, submitted_password)
except VerifyMismatchError:
    reject_login()
```

## 13. Recommended Learning Path

1. Learn how [HTTP](/encyclopedia/http/) requests carry cookies and headers.
2. Implement password login with secure hashing.
3. Compare sessions with [Token](/encyclopedia/token/)-based designs and [JWT](/encyclopedia/jwt/).
4. Add MFA, and explore passkeys.
5. Continue with [Authorization](/encyclopedia/authorization/) and [OAuth 2.0](/encyclopedia/oauth2/).

## 14. Related Technologies

- [Authorization](/encyclopedia/authorization/)
- [OAuth 2.0](/encyclopedia/oauth2/)
- [JSON Web Token (JWT)](/encyclopedia/jwt/)
- [HTTP](/encyclopedia/http/)

## 15. References

- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-4/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)