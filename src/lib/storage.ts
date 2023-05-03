const version = "1";

export function getDailyKey() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  return [y, m, d].join("");
}

export function save(key: string, state: unknown) {
  localStorage.setItem(key, JSON.stringify(state));
  localStorage.setItem("version", version);
}

export function load<T>(key: string) {
  if (localStorage.getItem("version") !== version) {
    return undefined;
  }
  const value = localStorage.getItem(key);
  if (!value) {
    return undefined;
  }
  return JSON.parse(value) as T;
}
