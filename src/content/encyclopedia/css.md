---
title: "CSS"
description: "How Cascading Style Sheets control presentation through selectors, the cascade, the box model, and modern layout."
category: "Web Technologies"
slug: "css"
status: "published"
---

## 1. Definition

CSS (Cascading Style Sheets) is the language used to describe how documents are presented: color, typography, spacing, layout, and animation. It is most often applied to [HTML](/encyclopedia/html/), and it also works with SVG and XML.

A CSS **rule** pairs a selector with one or more declarations:

```css
.card h2 {          /* selector */
  color: #a78bfa;   /* property: value */
  font-size: 1.5rem;
}
```

## 2. Purpose and background

Early web pages mixed content with presentation by using tags and attributes such as `font` and `bgcolor`. Håkon Wium Lie proposed CSS in 1994, and the W3C published CSS Level 1 in 1996.

Separating content from presentation means one stylesheet can restyle an entire site, and the same content can adapt to different screens and to print. Modern CSS is developed as independent modules, with features like Flexbox, Grid, custom properties, and container queries arriving separately.

## 3. How it works: the cascade

Multiple rules can target one element and set the same property. The **cascade** determines which declaration wins. It compares, in order:

1. **Origin and importance:** for example, author styles over browser defaults, with `!important` altering the order.
2. **Cascade layers** declared with `@layer`.
3. **Specificity** of the selector.
4. **Order of appearance:** the later declaration wins.

**Specificity** is compared as three columns, left to right:

| Selector | IDs | Classes, attributes, pseudo-classes | Types |
|---|---|---|---|
| `p` | 0 | 0 | 1 |
| `.note` | 0 | 1 | 0 |
| `p.note:hover` | 0 | 2 | 1 |
| `#intro` | 1 | 0 | 0 |

**Inheritance** is a separate mechanism: some properties, such as `color` and `font-family`, pass from parent to child when no value is set.

## 4. Internal structure: the box model and layout

Every rendered element generates a box.

```text
┌─────────────── margin ───────────────┐
│  ┌─────────── border ────────────┐   │
│  │  ┌──────── padding ───────┐   │   │
│  │  │        content         │   │   │
│  │  └────────────────────────┘   │   │
│  └───────────────────────────────┘   │
└──────────────────────────────────────┘
```

By default, `width` applies only to the content box, so padding and border add to the rendered size. Most projects opt for a more intuitive model:

```css
* { box-sizing: border-box; }
```

### 4.1 Layout systems

| System | Best for | Key properties |
|---|---|---|
| Normal flow | Text and documents | `display: block`, `inline` |
| Flexbox | One-dimensional alignment | `display: flex`, `gap`, `justify-content` |
| Grid | Two-dimensional layouts | `display: grid`, `grid-template-columns` |
| Positioning | Overlays and sticky elements | `position: absolute`, `sticky` |

## 5. Practical usage

A responsive card grid that needs no media queries:

```css
:root {
  --space: 1rem;
  --accent: #a78bfa;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: var(--space);
}

.card {
  padding: var(--space);
  border: 1px solid var(--accent);
  border-radius: 12px;
}

@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform 0.2s ease; }
  .card:hover { transform: translateY(-4px); }
}
```

`min(280px, 100%)` prevents overflow on screens narrower than the minimum column. Custom properties defined at `:root` provide a single source for design values. Animating `transform` is efficient because it generally avoids layout recalculation.

Wide content is a frequent cause of horizontal scrolling on phones. Make tables and code blocks scroll inside their own containers:

```css
pre, .table-wrap { overflow-x: auto; }
```

## 6. Relationships with other concepts

- [HTML](/encyclopedia/html/) provides the elements CSS styles.
- [JavaScript](/encyclopedia/javascript/) can toggle classes to change appearance.
- The [browser](/encyclopedia/browser/) builds the CSSOM and computes layout from it.
- [HTTP](/encyclopedia/http/) caching keeps stylesheets from being downloaded repeatedly.

## 7. Advantages and limitations

**Advantages**

- Separates presentation from content.
- Declarative: you describe the result and the browser performs the calculations.
- Handles different screens, color schemes, and user preferences.

**Limitations**

- Global scope by default, so large stylesheets can conflict. Scoped component styles, cascade layers, and naming conventions all address this.
- Cascade interactions can be difficult to trace.
- Unused rules accumulate, and removing them safely is difficult.
- Newer features require checking browser support.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| A rule has no effect | Higher specificity elsewhere | Inspect the crossed-out rule in DevTools |
| `height: 100%` does nothing | Parent has no defined height | Define the parent's height, or use `dvh` units |
| Horizontal scrolling on mobile | Fixed-width or unbreakable content | Find the widest element; use `overflow-wrap` and `max-width: 100%` |
| `z-index` is ignored | Element is in a different stacking context | Check ancestors for `position`, `transform`, or `opacity` |
| Vertical margins disappear | Margin collapsing | Use `gap` or padding |
| Flex child refuses to shrink | Default `min-width: auto` | Set `min-width: 0` |
| Styles differ between dev and production | Scoped or purged styles, or changed build order | Compare the generated CSS |

This quick debugging rule reveals every box and is especially useful for overflow problems:

```css
* { outline: 1px solid red; }
```

## 9. Learning path

1. Learn [HTML](/encyclopedia/html/) structure first.
2. Understand selectors, the cascade, and the box model.
3. Practice Flexbox, then Grid.
4. Build responsive layouts and honor user preferences.
5. Learn how the [Browser](/encyclopedia/browser/) renders, in order to write efficient styles.

## 10. References

- [MDN: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [W3C: CSS current work](https://www.w3.org/Style/CSS/current-work)
- [Can I use: browser support tables](https://caniuse.com/)
