---
title: "HTML"
description: "How HyperText Markup Language gives web documents structure and meaning, and how browsers turn it into the DOM."
category: "Web Technologies"
slug: "html"
status: "published"
---

## 1. Definition

HTML (HyperText Markup Language) is the standard markup language for web documents. It uses **elements** to describe the structure and meaning of content: headings, paragraphs, links, forms, tables, and media.

HTML is not a programming language. It has no variables or loops. It declares what content *is*, while [CSS](/encyclopedia/css/) controls how it looks and [JavaScript](/encyclopedia/javascript/) adds behavior.

## 2. Purpose and background

Tim Berners-Lee created HTML in the early 1990s as part of the original [Web](/encyclopedia/web-concept/), so that documents could link to one another. Its defining feature, the hyperlink, is still central.

Today, HTML is maintained by the WHATWG as a **Living Standard**, which is updated continuously rather than released in numbered versions. "HTML5" remains a common informal name for modern HTML and its related APIs.

## 3. How it works

An element usually consists of a start tag, content, and an end tag. Attributes supply additional information.

```html
<a href="/encyclopedia/http/" title="Read about HTTP">HTTP</a>
```

Some elements, such as `img`, `br`, and `input`, are **void elements** and have no content or end tag.

The [browser](/encyclopedia/browser/) reads HTML in a fixed sequence:

1. Bytes are decoded into characters.
2. A tokenizer produces start tags, end tags, and text.
3. A tree builder creates the **DOM** (Document Object Model).
4. The DOM is combined with styles for rendering.

HTML parsing is deliberately forgiving. The specification defines how to handle invalid markup, so a page with an unclosed tag still renders, although perhaps not as you intended.

## 4. Internal structure of a document

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Knowledge Base</title>
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <header><nav aria-label="Main">…</nav></header>
    <main>
      <article>
        <h1>What is HTML?</h1>
        <p>A language that gives content structure.</p>
      </article>
    </main>
    <footer>© 2026</footer>
  </body>
</html>
```

- `<!doctype html>` selects standards mode.
- `<head>` holds metadata that is not displayed in the page.
- The `viewport` meta tag is what makes responsive layouts work correctly on phones.
- `defer` runs a script after parsing completes, without blocking it.

### 4.1 Semantic elements

| Element | Meaning |
|---|---|
| `main` | The primary content, used once per page |
| `nav` | A group of navigation links |
| `article` | Self-contained content |
| `section` | A thematic group, normally with a heading |
| `aside` | Related but secondary content |
| `button` | An action on the current page |
| `a` | Navigation to a resource |

Semantic markup gives assistive technology and search engines useful information, and provides built-in behavior at no cost. A real `button` is focusable and responds to the keyboard; a clickable `div` does neither unless you rebuild those features.

## 5. Practical usage: an accessible form

```html
<form action="/login" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="password">Password</label>
  <input id="password" name="password" type="password"
         autocomplete="current-password" required minlength="8">

  <button type="submit">Sign in</button>
</form>
```

Key points:

- `label for` links a label to its control and enlarges the tap target.
- Input types such as `email` provide validation and suitable mobile keyboards.
- `name` determines the key used when the form is submitted.
- Browser validation helps users, but the [server](/encyclopedia/server/) must always validate again. It cannot trust the client.

## 6. Relationships with other concepts

- [CSS](/encyclopedia/css/) selects HTML elements and styles them.
- [JavaScript](/encyclopedia/javascript/) reads and changes the DOM.
- [HTTP](/encyclopedia/http/) delivers HTML with the `Content-Type: text/html` header.
- The [browser](/encyclopedia/browser/) parses HTML and displays it.

## 7. Advantages and limitations

**Advantages**

- Universal support and strong backward compatibility.
- Accessible by default when used semantically.
- Content remains readable even if CSS and JavaScript fail.

**Limitations**

- Static on its own: reusable components and data binding need other tools.
- Forgiving parsing can hide mistakes.
- Inserting untrusted text as HTML creates cross-site scripting (XSS) vulnerabilities.

```javascript
const comment = '<img src=x onerror=alert(1)>';

element.textContent = comment;  // safe: displayed as plain text
element.innerHTML = comment;    // dangerous: parsed and executed
```

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| Characters appear garbled | Missing or incorrect encoding | Add `<meta charset="utf-8">` and save as UTF-8 |
| Layout is tiny on phones | Missing viewport tag | Add the viewport meta tag |
| Image does not appear | Wrong path or case | Check the Network tab in DevTools |
| Clicking a button reloads the page | A `button` in a form defaults to `submit` | Add `type="button"` |
| Script cannot find an element | Script ran before the element existed | Use `defer` |
| Multiple elements share an `id` | Duplicate IDs are invalid | Use unique IDs, classes for groups |

The [W3C Nu HTML Checker](https://validator.w3.org/nu/) detects markup errors, and the browser's Accessibility panel shows how assistive technology interprets a page.

## 9. Learning path

1. Understand the [Web](/encyclopedia/web-concept/) and how a page is requested.
2. Write semantic documents, including forms and tables.
3. Style them with [CSS](/encyclopedia/css/).
4. Manipulate the DOM with [JavaScript](/encyclopedia/javascript/).
5. Learn the rendering path in [Browser](/encyclopedia/browser/).

## 10. References

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [MDN: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
