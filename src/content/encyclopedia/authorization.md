---
title: "Authorization"
description: "How systems decide what an authenticated identity may do, using RBAC, ABAC, relationship-based access, and enforcement points."
category: "Web Security"
slug: "authorization"
status: "published"
---

## 1. Definition

Authorization is the process of determining whether an identity is permitted to perform a specific action on a specific resource.

It answers the question:

**What are you allowed to do?**

It follows [authentication](/encyclopedia/authentication/), which answers *who are you?* Every authorization decision can be stated as a sentence with a subject, an action, a resource, and sometimes context:

```text
Can user:42 (subject) edit (action) document:981 (resource) from this network (context)?
```

## 2. Purpose and background

Multi-user computers needed a way of keeping users' files separate, and access control lists and Unix file permissions emerged as early solutions. Business systems later adopted role-based access control, formalized by Ferraiolo and Kuhn in the 1990s.

Authorization is a persistent source of serious vulnerabilities. Broken Access Control is the top category in the OWASP Top 10 of 2021. Two principles should guide all designs:

- **Least privilege:** grant only the access that is needed.
- **Deny by default:** when no rule grants access, refuse.

## 3. How it works

A request typically passes through these components:

| Component | Role |
|---|---|
| Policy Enforcement Point (PEP) | Intercepts the request and applies the decision |
| Policy Decision Point (PDP) | Evaluates the rules and returns allow or deny |
| Policy Information Point (PIP) | Supplies attributes, such as a user's department |
| Policy Administration Point (PAP) | Where rules are authored and managed |

In a small application, these may all be a few functions. In a large organization, they may be distinct services.

```text
Request → Authenticate → Build subject → Evaluate policy → Allow: run the handler
                                                         → Deny: 403
```

## 4. Internal structure: access control models

| Model | Decision based on | Example | Trade-off |
|---|---|---|---|
| ACL | A list on each resource | File permissions | Difficult to audit at scale |
| RBAC | Assigned roles | `editor` may publish | Simple, but roles can multiply |
| ABAC | Attributes and environment | Same department, working hours | Flexible, but harder to reason about |
| ReBAC | Relationships in a graph | Members of a folder's parent team | Ideal for sharing, needs dedicated infrastructure |

### 4.1 Scopes, roles, and permissions

- A **permission** is an allowed action, such as `invoice:read`.
- A **role** is a named set of permissions.
- An **OAuth scope** limits what a client application may do on the user's behalf.

Scopes do not replace user permissions. An effective decision is normally the intersection: the token must carry the scope, **and** the user must have the right to the object. See [OAuth 2.0](/encyclopedia/oauth2/).

## 5. Practical usage

Function-level and object-level checks are both required:

```javascript
const roles = {
  viewer: new Set(['document:read']),
  editor: new Set(['document:read', 'document:update']),
};

function can(user, permission) {
  return user.roles.some((role) => roles[role]?.has(permission));
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
    if (!can(req.user, permission)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

app.patch('/documents/:id', requirePermission('document:update'), async (req, res) => {
  // Object-level check: the row must belong to this user's organization.
  const document = await db.findDocument({
    id: req.params.id,
    organizationId: req.user.organizationId,
  });
  if (!document) return res.status(404).json({ error: 'not_found' });

  await db.updateDocument(document.id, req.body.content);
  res.status(204).end();
});
```

Returning `404` rather than `403` for another tenant's object avoids confirming that it exists.

Without the object-level check, this is an **Insecure Direct Object Reference (IDOR)**: changing `/documents/10` to `/documents/11` would reveal another customer's data.

Database-level defenses, such as PostgreSQL row-level security, can add another layer:

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON documents
  USING (organization_id = current_setting('app.organization_id')::bigint);
```

## 6. Relationships with other concepts

| Concept | Relationship |
|---|---|
| [Authentication](/encyclopedia/authentication/) | Establishes the identity that authorization evaluates |
| [OAuth 2.0](/encyclopedia/oauth2/) | Delegates limited access to a client application |
| [JWT](/encyclopedia/jwt/) | Can carry roles or scopes as claims |
| [Token](/encyclopedia/token/) | Presents the granted access with a request |
| [API](/encyclopedia/api/) | Must enforce authorization on the server for each endpoint |

## 7. Advantages and limitations

**Advantages of a central model**

- Consistent rules that can be audited.
- Reduced damage from compromised accounts.
- Easier compliance reporting.

**Limitations and risks**

- Permissions tend to accumulate over time.
- Roles or claims embedded in a long-lived token can be outdated until the token expires.
- Complex policies are difficult to test thoroughly.
- Every new endpoint is a new opportunity to forget a check.

## 8. Common errors and troubleshooting

| Problem | Why it happens | Solution |
|---|---|---|
| 401 returned where 403 belongs | Conflated identity and permission failures | 401: not authenticated. 403: not permitted |
| User loses a role but retains access | Stale claims in a token | Short lifetimes, or check roles server-side |
| Hiding a button is the only protection | Client-side checks can be bypassed | Enforce on the server |
| Object accessed by changing an ID | No object-level check | Scope queries by owner or tenant |
| User can set their own role | Mass assignment | Allowlist writable fields |
| Sensitive route without a check | Authorization added route by route | Secure by default, and exempt explicitly |

Write negative tests. For every protected action, test that a user with a different role and a user in another tenant are refused.

## 9. Learning path

1. Learn [Authentication](/encyclopedia/authentication/) and the difference from authorization.
2. Implement RBAC in an [API](/encyclopedia/api/).
3. Add object-level checks and negative tests.
4. Study [Token](/encyclopedia/token/) claims and [OAuth 2.0](/encyclopedia/oauth2/) scopes.
5. Explore ABAC and ReBAC for complex sharing needs.

## 10. References

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Top 10: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [NIST Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
- [Zanzibar: Google's Authorization System](https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/)
