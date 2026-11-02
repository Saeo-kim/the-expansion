---
title: "HTTP (Hypertext Transfer Protocol)"
description: "Understand HTTP, its request-response model, methods, status codes, headers, and role in web communication."
category: "Web Technologies"
slug: "http"
status: "published"
---

# HTTP (Hypertext Transfer Protocol)

## 1. Definition

HTTP (Hypertext Transfer Protocol) is an application-layer protocol used for communication between clients and servers.

It defines how messages are formatted and exchanged over a network.

HTTP is commonly used when a web browser requests resources from a web server.

## 2. Client-Server Model

HTTP follows a client-server communication model.

- Client: Sends a request.
- Server: Processes the request and returns a response.

For example:

1. A user enters a website address in a browser.
2. The browser sends an HTTP request.
3. The web server receives and processes the request.
4. The server sends an HTTP response.
5. The browser displays the returned content.

## 3. HTTP Request

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