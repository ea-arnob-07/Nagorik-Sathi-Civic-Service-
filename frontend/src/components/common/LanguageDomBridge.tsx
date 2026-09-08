import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translateBanglaText } from '../../i18n/bnToEn';

type TextState = { original: string; translated: string | null };
type AttributeState = { original: string; translated: string | null };

const textStates = new WeakMap<Text, TextState>();
const attributeStates = new WeakMap<Element, Map<string, AttributeState>>();
const translatedAttributes = ['placeholder', 'title', 'aria-label', 'alt'];

function shouldSkipText(node: Text): boolean {
  return Boolean(node.parentElement?.closest(
    'script, style, noscript, textarea, input, [contenteditable="true"], [data-no-translate]'
  ));
}

function translateTextNode(node: Text, language: string) {
  const current = node.nodeValue || '';
  let state = textStates.get(node);

  if (!state) {
    state = { original: current, translated: null };
  } else if (state.translated !== null && current !== state.translated) {
    state.original = current;
    state.translated = null;
  }

  if (language === 'en') {
    const translated = translateBanglaText(state.original);
    state.translated = translated;
    if (translated !== current) node.nodeValue = translated;
  } else {
    if (state.translated !== null && current === state.translated) {
      node.nodeValue = state.original;
    }
    state.translated = null;
  }

  textStates.set(node, state);
}

function translateAttributes(element: Element, language: string) {
  if (element.closest('[data-no-translate]')) return;
  let states = attributeStates.get(element);
  if (!states) {
    states = new Map<string, AttributeState>();
    attributeStates.set(element, states);
  }

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (current === null) continue;
    let state = states.get(attribute);

    if (!state) {
      state = { original: current, translated: null };
    } else if (state.translated !== null && current !== state.translated) {
      state.original = current;
      state.translated = null;
    }

    if (language === 'en') {
      const translated = translateBanglaText(state.original);
      state.translated = translated;
      if (translated !== current) element.setAttribute(attribute, translated);
    } else {
      if (state.translated !== null && current === state.translated) {
        element.setAttribute(attribute, state.original);
      }
      state.translated = null;
    }

    states.set(attribute, state);
  }
}

function translateSubtree(root: Node, language: string) {
  if (root.nodeType === Node.TEXT_NODE) {
    const textNode = root as Text;
    if (!shouldSkipText(textNode)) translateTextNode(textNode, language);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let element = root.nodeType === Node.ELEMENT_NODE ? root as Element : null;
  while (element) {
    translateAttributes(element, language);
    element = elementWalker.nextNode() as Element | null;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    if (!shouldSkipText(textNode)) translateTextNode(textNode, language);
    current = walker.nextNode();
  }
}

export const LanguageDomBridge = () => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === 'en'
      ? 'Nagorik Sathi | Civic Services & Issue Resolution'
      : 'Nagorik Sathi | নাগরিক সাথী - Civic Services & Issue Resolution';

    const appRoot = document.body;
    translateSubtree(appRoot, language);
    if (language !== 'en') return;

    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData' && record.target.nodeType === Node.TEXT_NODE) {
          const textNode = record.target as Text;
          if (!shouldSkipText(textNode)) translateTextNode(textNode, language);
        } else if (record.type === 'attributes' && record.target.nodeType === Node.ELEMENT_NODE) {
          translateAttributes(record.target as Element, language);
        } else {
          record.addedNodes.forEach(node => translateSubtree(node, language));
        }
      }
    });

    observer.observe(appRoot, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: translatedAttributes
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
};
