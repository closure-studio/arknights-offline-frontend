import { axios } from '../boot/axios';
import {
  GeneralResponse,
  UserLoginData,
  UserRegisterData,
  VerifyTokenData
} from './models';

const api = {
  userLogin: async function(username: string, password: string) {
    const result = await axios.post('/auth/userlogin', {
      username: username,
      password: password
    });
    return result.data as GeneralResponse<UserLoginData>;
  },
  verifyToken: async function(username: string, password: string) {
    const result = await axios.post('/auth/verifyToken', {
      username,
      password
    });
    return result.data as GeneralResponse<VerifyTokenData>;
  },
  userRegister: async function(username: string, password: string) {
    const result = await axios.post('/auth/userregister', {
      username,
      password
    });
    return result.data as GeneralResponse<UserRegisterData>;
  }
};

export default api;
