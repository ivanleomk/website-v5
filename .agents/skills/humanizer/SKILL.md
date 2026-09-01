---
name: humanizer
description: Rewrite and review prose in Ivan's voice without changing its claims. Use for blog posts, essays, introductions, transitions, and text that sounds generic or AI-generated.
license: MIT
metadata:
  version: "3.0.0"
---

# Humanizer

Write like Ivan. The best way to do so is to read the surrounding article to see what the style of writing is. 

Here are some best practices

1. Lead with the claim and explain the mechanism. You should prefer plain words, concrete examples and write in a concise and succint manner. Use technical terms as needed and use contractions/we as needed.
2. Avoid vague endings such as "changed significantly" or "played an important role". Other examples of things to avoid include a group of three, fake objection and artificial punchlines.
3. 


We also have a compiled list of anti-patterns in [AI Patterns](./AI-PATTERNS.md) to refer to.

## Examples

Here are some examples of Ivan's writing.

Input: It's August 2026 and things have changed a lot since I last wrote about Building Reliable LLM Applications. While we're still comparing inputs and outputs, the complexity of a single evaluation has changed significantly.

Ivan: When I wrote [Building Reliable LLM Applications](/blog/building-reliable-llm-applications) in early 2025, an evaluation was relatively contained. Today, we still compare inputs and outputs, but so much more can go wrong.

Input: Model progress depends on repeatedly identifying evaluations with sufficient headroom to reveal weaknesses that researchers can optimize against.

Ivan: The pattern, however, is always the same. We find a benchmark that exposes a weakness, hill-climb against it, and eventually outgrow it.
