---
title: "Browser"
description: "What happens between entering a URL and seeing a page: networking, parsing, rendering, and the browser's security model."
category: "Web Technologies"
slug: "browser"
status: "published"
---

## 1. Definition

A web browser is an application that retrieves resources from the [Web](/encyclopedia/web-concept/), interprets them, renders them for the user, and runs web applications inside a security sandbox. Chrome, Firefox, Safari, and Edge are the most prominent examples.

Browsers are built around a small number of **rendering engines**: Blink (Chrome and Edge), Gecko (Firefox), and WebKit (Safari). Separately, each has a **JavaScript engine**: V8, SpiderMonkey, and JavaScriptCore respectively.

## 2. Purpose and background

Tim Berners-Lee wrote the first browser, called WorldWideWeb, in 1990. Mosaic (1993) made images appear inline with text and helped popularize the Web. Competition during the browser wars led to incompatibilities, which in turn drove the standards work that makes modern pages behave consistently.

Today, a browser is effectively an application platform with its own networking, storage, graphics, and security model.

## 3. How it works: from URL to pixels

### 3.1 Networking

1. Parse the URL and check whether a cached response can be used.
2. Resolve the host name through DNS.
3. Open a connection: TCP plus TLS, or QUIC for HTTP/3.
4. Send the [HTTP](/encyclopedia/http/) request.
5. Receive and decode the response.

### 3.2 The critical rendering path

```text
HTML → DOM ┐
           ├→ Render tree → Layout → Paint → Composite
CSS → CSSOM┘
```

| Stage | What it does |
|---|---|
| DOM | Builds a tree of elements from [HTML](/encyclopedia/html/) |
| CSSOM | Builds a tree of styles from [CSS](/encyclopedia/css/) |
| Render tree | Combines the two, excluding items such as `display: none` |
| Layout | Calculates the size and position of each box |
| Paint | Records the drawing operations for pixels |
| Composite | Combines layers, usually on the GPU |

Stylesheets are **render-blocking**, because the browser avoids painting unstyled content. A classic script without `defer` or `async` is **parser-blocking**.

Changing layout properties such as `width` reruns layout and paint. Changing `transform` or `opacity` can often be handled at the composite stage alone, and is therefore smoother for animation.

## 4. Internal structure

Modern browsers run as a set of cooperating processes:

| Process | Responsibility |
|---|---|
| Browser | Window, tabs, navigation, and permissions |
| Renderer | HTML, CSS, and [JavaScript](/encyclopedia/javascript/) for a site, in a sandbox |
| GPU | Drawing and compositing |
| Network | HTTP, caching, and sockets |

If one renderer crashes, the other tabs keep working. Site isolation places different sites in different processes, which limits what a compromised renderer can read.

### 4.1 Security model

The **same-origin policy** is the foundation. An origin is the combination of scheme, host, and port. A script generally cannot read data from a different origin.

| URL compared with `https://example.com` | Same origin? |
|---|---|
| `https://example.com/page` | Yes |
| `http://example.com` | No: different scheme |
| `https://api.example.com` | No: different host |
| `https://example.com:8443` | No: different port |

**CORS** lets a server explicitly grant cross-origin read access through response headers. **Content Security Policy** restricts which scripts may run.

### 4.2 Client-side storage

| Mechanism | Sent with requests automatically? | Accessible to JavaScript? | Typical use |
|---|---|---|---|
| Cookie | Yes, within its scope | Not with `HttpOnly` | Session identifiers |
| `localStorage` | No | Yes | Small preferences |
| `sessionStorage` | No | Yes | Per-tab state |
| IndexedDB | No | Yes | Large structured data |

Storing authentication [tokens](/encyclopedia/token/) in `localStorage` exposes them to any script that manages to run on the page through XSS. An `HttpOnly`, `Secure`, `SameSite` cookie prevents script access, but it requires CSRF to be considered.

## 5. Practical usage: DevTools

Press F12 to open the developer tools.

| Panel | Use it to |
|---|---|
| Elements | Inspect the DOM and computed styles |
| Console | View errors and run JavaScript |
| Network | Inspect requests, headers, timing, and status codes |
| Application | View cookies and storage |
| Performance | Record and analyze slow interactions |
| Lighthouse | Audit performance and accessibility |

Device emulation helps with responsive work, but remains an approximation. Testing on a real phone is more reliable.

Measure real page timing from the Console:

```javascript
const [nav] = performance.getEntriesByType('navigation');
console.table({
  ttfb: nav.responseStart,
  domInteractive: nav.domInteractive,
  loaded: nav.loadEventEnd,
});
```

Tell the browser about important resources in advance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<img src="hero.webp" width="1200" height="630" alt="Diagram" fetchpriority="high">
<img src="chart.webp" width="800" height="400" alt="Chart" loading="lazy">
```

Declaring `width` and `height` lets the browser reserve the space, so the layout does not jump as images load.

## 6. Relationships with other concepts

- The browser is the most common client of a web [server](/encyclopedia/server/).
- It consumes [HTML](/encyclopedia/html/), [CSS](/encyclopedia/css/), and [JavaScript](/encyclopedia/javascript/).
- It speaks [HTTP](/encyclopedia/http/) and enforces its caching rules.
- It is the user-facing agent in the [OAuth 2.0](/encyclopedia/oauth2/) redirect flow.

## 7. Advantages and limitations

**Advantages**

- Software delivery with no installation.
- Strong sandboxing for untrusted code.
- Rich built-in debugging tools.

**Limitations**

- Restricted access to the device, compared with native apps.
- Heavy memory use, particularly with many tabs.
- Feature differences remain across engines.
- Page performance varies widely across devices and networks.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| Console reports a CORS error | Server did not permit the origin | Fix server headers; a browser-side change will not help |
| Changes do not appear | Cached asset | Hard refresh, or disable the cache in DevTools |
| Page jumps while loading | Media without reserved dimensions | Set `width` and `height` |
| Page freezes | Long task on the main thread | Find it in the Performance panel |
| Only one user has the problem | Extension interference or stale cookies | Test in a private window |
| `ERR_CERT_DATE_INVALID` | Expired certificate, or wrong device clock | Check the certificate and the system time |

## 9. Learning path

1. Learn [HTTP](/encyclopedia/http/) and the structure of URLs.
2. Understand [HTML](/encyclopedia/html/), [CSS](/encyclopedia/css/), and [JavaScript](/encyclopedia/javascript/).
3. Follow a page load in the Network and Performance panels.
4. Study web security: same-origin, CORS, XSS, and CSRF.

## 10. References

- [web.dev: How browsers work](https://web.dev/articles/howbrowserswork)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [Chrome DevTools documentation](https://developer.chrome.com/docs/devtools)
