export const userStorage = {
  setUserInfo: (token: string, userId: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  },
  clearUserInfo: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
};


export const themeStorage = {
  setTheme: (theme: string) => {
    localStorage.setItem('theme', theme);
  },
  clearTheme: () => {
    localStorage.removeItem('theme');
  },
};
