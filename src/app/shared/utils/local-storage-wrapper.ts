const USER_DATA_STORAGE_KEY = 'userData';

class LocalStorageWrapper<T> {
  constructor(private key: string) {}

  set set(value: string) {
    localStorage.setItem(this.key, value);
  }

  get get(): string {
    if (this.has) {
      return localStorage.getItem(this.key);
    }
    return null;
  }

  get has(): boolean {
    return Boolean(localStorage.getItem(this.key));
  }

  set parsed(value: T) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  get parsed(): T {
    if (!this.has) {
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch (e) {
      console.error(e);
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

export const userLocalStorage = new LocalStorageWrapper<{
  name: string;
  birthdate: string;
  address: string;
}>(USER_DATA_STORAGE_KEY);
