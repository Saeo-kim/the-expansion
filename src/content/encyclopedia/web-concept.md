---
title: "The Web"
description: "How the World Wide Web combines URLs, HTTP, and HTML into a global system of linked documents and applications."
category: "Web Technologies"
slug: "web-concept"
status: "published"
---

## 1. Definition

The World Wide Web is a global information system of resources that are identified by URLs, transferred with [HTTP](/encyclopedia/http/), and connected by hyperlinks. Those resources include documents, images, video, and full applications.

The Web is **not** the same thing as the Internet.

| | Internet | Web |
|---|---|---|
| What it is | A global network of networks | A service that runs on top of that network |
| Core technology | TCP/IP | URLs, HTTP, HTML |
| Other services on the same layer | Email, DNS, SSH, online games | Not applicable |

## 2. Purpose and background

In 1989, Tim Berners-Lee, working at CERN, proposed a linked information system so that researchers could find and share documents across incompatible computers. By the end of 1990 he had built the first browser and web server, and the first website went online.

CERN released the Web technology royalty-free in 1993, a decision that allowed anyone to build on it. The W3C was founded in 1994 to develop open standards. The Web has since moved from static documents to applications that rival native software, while keeping its original openness and links.

## 3. How it works

The Web rests on three inventions.

- **URL:** a global address for a resource.
- **[HTTP](/encyclopedia/http/):** the protocol for requesting and delivering it.
- **[HTML](/encyclopedia/html/):** a document format with links to other resources.

A URL has a defined structure:

```text
https://www.example.com:443/articles/web?lang=en#history
└─┬─┘   └──────┬──────┘ └┬┘ └────┬─────┘ └──┬──┘ └──┬──┘
scheme       host      port    path       query  fragment
```

The fragment is handled by the browser and is not sent to the server.

Loading a page follows these steps:

1. The [browser](/encyclopedia/browser/) parses the URL.
2. DNS resolves the host name to an IP address.
3. The browser opens a connection and, for `https`, negotiates TLS.
4. It sends an HTTP request.
5. A [server](/encyclopedia/server/) returns a response.
6. The browser renders the HTML, requesting any CSS, scripts, and images it references.

You can watch the exchange from a terminal:

```bash
curl -v https://example.com/ -o /dev/null
```

## 4. Internal structure: the web platform

| Concern | Technology |
|---|---|
| Structure and content | [HTML](/encyclopedia/html/) |
| Presentation | [CSS](/encyclopedia/css/) |
| Behavior | [JavaScript](/encyclopedia/javascript/) |
| Transfer | [HTTP](/encyclopedia/http/) over TLS |
| Data exchange | [JSON](/encyclopedia/json/) via an [API](/encyclopedia/api/) |
| Identity and access | Cookies, [tokens](/encyclopedia/token/), [OAuth 2.0](/encyclopedia/oauth2/) |

### 4.1 Rendering strategies

| Strategy | Where HTML is produced | Well suited to |
|---|---|---|
| Static site generation | At build time | Documentation, blogs |
| Server-side rendering | On each request | Personalized or frequently changing pages |
| Client-side rendering | In the browser | Highly interactive applications |
| Islands | Static HTML with small interactive parts | Mostly static content with some interactivity |

This site uses the islands approach: Encyclopedia pages are static HTML built by Astro, while the Knowledge Map is an interactive React island.

## 5. Practical usage

The following complete document is a valid website when served by any web server:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, Web</h1>
    <a href="https://www.w3.org/">Read about web standards</a>
  </body>
</html>
```

To preview a local folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

## 6. Relationships with other concepts

- A [browser](/encyclopedia/browser/) is the client most people use to access the Web.
- A [server](/encyclopedia/server/) hosts resources.
- An [API](/encyclopedia/api/) exposes data and operations over web protocols.
- [JWT](/encyclopedia/jwt/) is a common token format used by web applications.

## 7. Advantages and limitations

**Advantages**

- Open standards with no central gatekeeper.
- Works across devices without installation.
- Links make information discoverable and composable.
- Strong backward compatibility: pages from the 1990s generally still render.

**Limitations**

- HTTP is stateless, so applications must add their own session mechanisms.
- Links break when resources move, a problem known as link rot.
- Page weight and JavaScript can hurt performance on slower devices.
- Open access exposes users to phishing, tracking, and cross-site attacks.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Check |
|---|---|---|
| `DNS_PROBE_FINISHED_NXDOMAIN` | The host name does not resolve | `nslookup example.com` |
| `ERR_CONNECTION_REFUSED` | Nothing is listening on that port | Whether the server is running, and the port |
| 404 Not Found | Wrong path or missing page | URL spelling; many hosts are case-sensitive |
| Mixed-content warning | HTTPS page loading HTTP resources | Serve all resources over HTTPS |
| Old version keeps appearing | Browser or CDN cache | Hard refresh, inspect `Cache-Control` |
| Certificate warning | Expired certificate or name mismatch | Inspect the certificate in the browser |

## 9. Learning path

1. Understand [HTTP](/encyclopedia/http/) and URLs.
2. Build pages with [HTML](/encyclopedia/html/) and [CSS](/encyclopedia/css/).
3. Add behavior with [JavaScript](/encyclopedia/javascript/).
4. Learn how the [Browser](/encyclopedia/browser/) renders your work.
5. Connect a backend through an [API](/encyclopedia/api/).

## 10. References

- [The first website, preserved by CERN](https://info.cern.ch/hypertext/WWW/TheProject.html)
- [W3C: Architecture of the World Wide Web](https://www.w3.org/TR/webarch/)
- [MDN: How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
