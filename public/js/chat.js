let socket_admin_id = null;
let user_email = null;
let socket = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  socket = io();

  const chat_help = document.getElementById("chat_help");
  chat_help.style.display = "none";

  const chat_in_support = document.getElementById("chat_in_support");
  chat_in_support.style.display = "block";

  const email = document.getElementById("email").value;
  const text = document.getElementById("txt_help").value;

  user_email = email;

  socket.on("connect", () => {
    const params = {
      email,
      text,
    };
    socket.emit("client_first_access", params, (call, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(call);
      }
    });
  });

  socket.on("client_list_all_messages", (messages) => {
    var template_client = document.getElementById(
      "message-user-template"
    ).innerHTML;
    var template_admin = document.getElementById("admin-template").innerHTML;

    messages.forEach((message) => {
      if (message.admin_id == null) {
        const rendered = Mustache.render(template_client, {
          message: message.text,
          email,
        });

        document.getElementById("messages").innerHTML += rendered;
      } else {
        const rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        });

        document.getElementById("messages").innerHTML += rendered;
      }
    });
    scrollToBottom();
  });

  socket.on("admin_send_to_client", (message) => {
    socket_admin_id = message.socket_id;

    const template_admin = document.getElementById("admin-template").innerHTML;
    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });

    document.getElementById("messages").innerHTML += rendered;
    scrollToBottom();
  });
});

document
  .querySelector("#send_message_button")
  .addEventListener("click", sendMessage);

document
  .getElementById("message_user")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

function sendMessage(event) {
  const text = document.getElementById("message_user").value;

  if (text === "") {
    return;
  }

  const params = {
    text,
    socket_admin_id,
  };

  socket.emit("client_send_to_admin", params);

  const template_client = document.getElementById(
    "message-user-template"
  ).innerHTML;

  const rendered = Mustache.render(template_client, {
    message: text,
    email: user_email,
  });

  document.getElementById("messages").innerHTML += rendered;
  document.getElementById("message_user").value = "";

  scrollToBottom();
}

function scrollToBottom() {
  var element = document.getElementById("text_support");
  element.scrollTop = element.scrollHeight;
}
