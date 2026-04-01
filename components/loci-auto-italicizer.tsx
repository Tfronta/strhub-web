"use client";

import { useEffect } from "react";

const LOCI_REGEX = /\b([Ll])oci\b/g;
const EXCLUDED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
]);

function italicizeInTextNode(node: Text) {
  const raw = node.nodeValue;
  if (!raw || !LOCI_REGEX.test(raw)) return;
  LOCI_REGEX.lastIndex = 0;

  const parent = node.parentElement;
  if (!parent) return;
  if (EXCLUDED_TAGS.has(parent.tagName)) return;
  if (parent.closest(".loci-italic")) return;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LOCI_REGEX.exec(raw)) !== null) {
    const [full] = match;
    const index = match.index;

    if (index > lastIndex) {
      fragment.appendChild(document.createTextNode(raw.slice(lastIndex, index)));
    }

    const italic = document.createElement("span");
    italic.className = "loci-italic";
    italic.textContent = full;
    fragment.appendChild(italic);
    lastIndex = index + full.length;
  }

  if (lastIndex < raw.length) {
    fragment.appendChild(document.createTextNode(raw.slice(lastIndex)));
  }

  node.replaceWith(fragment);
}

function processRoot(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of nodes) {
    italicizeInTextNode(textNode);
  }
}

export function LociAutoItalicizer() {
  useEffect(() => {
    processRoot(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
          italicizeInTextNode(mutation.target as Text);
          continue;
        }

        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.TEXT_NODE) {
            italicizeInTextNode(addedNode as Text);
          } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
            processRoot(addedNode as ParentNode);
          }
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
