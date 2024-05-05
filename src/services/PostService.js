import http from "../http-database";

class PostService {
  //register
  reg(regData) {
    return http.post("/reg", regData);
  }

  database(url,postData){
    return http.post(url,postData);
  }
}


export default new PostService();
