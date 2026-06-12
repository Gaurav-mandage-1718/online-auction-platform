export function saveAuthData(data) {
  sessionStorage.setItem('token', data.token);

  sessionStorage.setItem(
    'user',
    JSON.stringify({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    })
  );
}

export function getToken() {
  return sessionStorage.getItem('token');
}

export function getCurrentUser() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}