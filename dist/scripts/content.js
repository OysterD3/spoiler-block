// Credits: https://github.com/lucasrowe/spoiled/blob/master/spoiled-chrome-extension/content_script.js
let cachedTerms = [];
const EL_CONTAINER = "span, div, li, th, td, dt, dd";
const EL_TEXT = "a, p, h1, h2, h3, h4, h5, h6";

chrome.storage.sync.get(null, (result) => {
  enableMutationObserver();
  let opts = [];
  if (result.options) {
    opts = JSON.parse(result.options).map((v) => v.term);
  }

  cachedTerms = opts;
  blockSpoilerContents(document, opts);
});

/**
 * @param {Node} node
 * @param {string[]} terms
 */
const blockSpoilerContents = (node, terms) => {
  // Search innerHTML elements first
  let nodes = node.querySelectorAll(EL_TEXT);
  replaceNodesWithMatchingText(nodes, terms);

  // Now find any container elements that have just text inside them
  nodes = findContainersWithTextInside(node);
  if (nodes && nodes.length !== 0) {
    replaceNodesWithMatchingText(nodes, terms);
  }
};

/**
 *
 * @param {Node[]} nodes
 * @param {string[]} terms
 */
const replaceNodesWithMatchingText = (nodes, terms) => {
  nodes = Array.from(nodes);
  nodes.reverse();
  nodes.forEach((n) => {
    terms.forEach((t) => {
      if (!n.classList.contains("spoiler-block__spoiler") && matchTerm(n, t)) {
        console.log(n);
        if (!n.parentNode || n.parentNode.nodeName === "BODY") {
          return;
        }
        n.className += " spoiler-block__spoiler";
      }
    });
  });
};

/**
 * @param {Node} node
 * @param {string} term
 * @returns {boolean}
 */
const matchTerm = (node, term) => {
  const regex = new RegExp(term, "i");
  return regex.test(node.textContent);
};

/**
 *
 * @param {Node} targetNode
 * @returns {Node[]}
 */
const findContainersWithTextInside = (targetNode) => {
  const containerNodes = targetNode.querySelectorAll(EL_CONTAINER);
  const emptyNodes = [];
  for (const containerNode of containerNodes) {
    const containerChildren = containerNode.childNodes;
    for (const containerChild of containerChildren) {
      if (containerChild.textContent) {
        emptyNodes.push(containerChild.parentNode);
      }
    }
  }
  return emptyNodes;
};

const enableMutationObserver = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((v) => {
      blockSpoilerContents(v.target, cachedTerms);
    });
  });

  observer.observe(document, { attributes: true, subtree: true });
};
