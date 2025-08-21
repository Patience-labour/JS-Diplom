class User {
  static URL = "/user";

  static setCurrent(user) {
    localStorage.user = JSON.stringify(user);
    console.log(localStorage.user);
  }

  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  static current() {
      let data;
      if(localStorage.user){
        data = JSON.parse(localStorage.user);
      } else {
        data = undefined;
      }
      return data;
  }

  static fetch(callback) {
    createRequest({
      url: this.URL + "/current",
      method: "GET",
      responseType: "json",
      data: User.current(),
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  static login(data, callback) {
    createRequest({
      url: this.URL + "/login",
      method: "POST",
      responseType: "json",
      data: User.current(),
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    })
  }

  static register(data, callback) {
    createRequest({
      url: this.URL + "/register",
      method: "POST",
      responseType: "json",
      data: User.current(),
      callback: (err, response) => {
        if (response.success) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    })
  }

  static logout(callback) {
    createRequest({
      url: this.URL + "/logout",
      method: "POST",
      responseType: "json",
      data: User.current(),
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    })
    this.unsetCurrent();
  }
}
 