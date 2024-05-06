import http from "../http-database";

class PostService {
  //register
  reg(postData) {
    return http.post("/reg", postData);
  }

  database(url,postData){
    return http.post(url,postData);
  }
}


export default new PostService();
