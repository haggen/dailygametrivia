const version = "1";

export function getSessionKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return [year, month, date].join("");
}

export function setSession<T>(key: string, state: T) {
  localStorage.setItem(key, JSON.stringify(state));
  localStorage.setItem("version", version);
}

export function getSession<T>(key: string) {
  if (localStorage.getItem("version") !== version) {
    return undefined;
  }
  const value = localStorage.getItem(key);
  if (!value) {
    return undefined;
  }
  return JSON.parse(value) as T;
}
