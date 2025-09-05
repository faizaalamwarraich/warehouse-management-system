// Simple credential store using localStorage (mock only; not secure for production)
// Users are stored as an array under key 'wms.auth.users'

export type StoredUser = {
  username: string;
  password: string; // plaintext for demo purposes only
};

const USERS_KEY = 'wms.auth.users';

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authStore = {
  getAll(): StoredUser[] { return readUsers(); },
  exists(username: string): boolean {
    return readUsers().some(u => u.username.toLowerCase() === username.toLowerCase());
  },
  add(user: StoredUser) {
    const users = readUsers();
    users.push(user);
    writeUsers(users);
  },
  validate(username: string, password: string): boolean {
    return readUsers().some(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  }
};
