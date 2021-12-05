export function isArrayEmpty(array) {
  return !Array.isArray(array) || !array.length;
}

export function isObjectEmpty(object) {
  return Object.entries(object).length === 0 && object.constructor === Object;
}

export function documentWithId(document) {
  return { id: document.id, ...document.data() };
}

// Transform this:
// [{ ...properties }, { ...properties }]
// to this
// { id: { ...properties }, id2: { ...properties } }
export function dictionaryFromDocumentArray(docArray) {
  if (isArrayEmpty(docArray)) return {};

  return docArray.reduce((acc, document) => {
    acc[document.id] = documentWithId(document);
    return acc;
  }, {});
}