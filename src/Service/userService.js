import axios from "axios";
const USER_API__URL = "http://localhost:8081/loan";

class userService {
  saveUser(user) {
    return axios.post(USER_API__URL, user);
  }
  getUserById(id) {
    return axios.get(USER_API__URL + "/" + id);
  }
}

export default new userService();
