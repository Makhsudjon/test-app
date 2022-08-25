const socket = io();

console.log("Local Storage Main ", localStorage);
const registerForm = document.forms["register"];
const loginForm = document.forms["login"];
const messageForm = document.forms["message"];

if (registerForm) {
  const registerFormButton = registerForm.elements["button"];
  registerFormButton.addEventListener("click", sendRegisterForm);
  async function sendRegisterForm(event) {
    event.preventDefault();

    const form = registerForm.elements;

    const formData = {
      name: form["name"].value,
      email: form["email"].value,
      age: form["age"].value,
      password: form["password"].value,
    };
    await makeRequest("/user/register", "post", formData);
    location.assign("/user/login");
    console.log("Local Storage Register ", localStorage);
  }
}

if (loginForm) {
  const loginFormButton = loginForm.elements["button"];
  loginFormButton.addEventListener("click", sendLoginForm);
  async function sendLoginForm(event) {
    event.preventDefault();
    const form = loginForm.elements;
    const formData = {
      name: form["name"].value,
      password: form["password"].value,
    };
    const res = await makeRequest("/user/login", "post", formData);

    if (res.status === 200) {
      const user = res.data.data;
      localStorage.setItem("token", res.data.token);
      socket.emit('login', { user: user._id });
      location.assign('/user/send-message');
    } else {
      location.reload(false);
    }
  }
}
if (messageForm) {
  const messageFormButton = messageForm.elements["button"];
  messageFormButton.addEventListener("click", sendMessageForm);
  async function sendMessageForm(event) {
    event.preventDefault();

    const form = messageForm.elements;

    const formData = new FormData();

    formData.append("title", form["title"].value);
    formData.append("description", form["description"].value);
    formData.append("to", form["to"].value);
    formData.append("uploaded_file", form["uploaded_file"].files[0]);

    const res = await makeRequest("/user/send-message", "post", formData);
    if (res.status === 200) {
      const data = {
        to:form["to"].value, 
        message:{
          title: form["title"].value, 
          description: form["description"].value
        }
      }
      socket.emit('message', data);
      location.assign(location.origin);
    } else {
      location.reload(false);
    }
  }
}

async function makeRequest(url, method, data) {
  url = "http://localhost:5000"+url;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  };
  console.log("Config ", config);

  switch (method) {
    case "get":
      return await axios.get(url, config);
    case "post":
      return await axios.post(url, data, config);
  }
}
