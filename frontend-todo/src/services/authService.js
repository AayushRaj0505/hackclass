import api from './api';

class AuthService {
  static async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }

  static async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  static async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
}

export default AuthService;
