import { distance } from "fastest-levenshtein";

/**
 * Normalizer.
 */
export function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

/**
 * Tokenizer.
 */
export function tokenize(value: string) {
  return value.split(" ").filter(Boolean);
}

/**
 * Text matcher.
 */
export function match(target: string, subject: string) {
  const normalizedTarget = normalize(target);
  const normalizedSubject = normalize(subject);

  if (normalizedSubject.includes(normalizedTarget)) {
    return true;
  }

  const tokenizedTarget = tokenize(normalizedTarget);
  const tokenizedSubject = tokenize(normalizedSubject);

  if (tokenizedSubject.length === 0 || tokenizedTarget.length === 0) {
    return false;
  }

  return tokenizedTarget.every((targetToken) => {
    for (const subjectToken of tokenizedSubject) {
      if (subjectToken === targetToken) {
        return true;
      }

      if (subjectToken.includes(targetToken)) {
        return true;
      }

      if (distance(targetToken, subjectToken) / subjectToken.length <= 0.3) {
        return true;
      }
    }

    return false;
  });
}
