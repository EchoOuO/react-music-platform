import http from "../http-common";

class PostService {
  //register
  reg(regData) {
    return http.post("/reg", regData);
  }
}


export default new PostService();
