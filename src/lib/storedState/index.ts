export function getStorageKeyOfTheDay() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return [year, month, date].join("");
}

export function saveState<T>(key: string, state: T) {
  localStorage.setItem(key, JSON.stringify(state));
}

export function loadState<T>(key: string) {
  const storedState = localStorage.getItem(key);
  if (!storedState) {
    return undefined;
  }
  return JSON.parse(storedState) as T;
}
