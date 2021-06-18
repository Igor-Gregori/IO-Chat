const socket = io();

let openConnections = [];

socket.on("admin_list_all_users", (connections) => {
  openConnections = connections;
  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

socket.on("admin_receive_message", (data) => {
  const connection = openConnections.find(
    (connection) => (connection.socket_id = data.socket_id)
  );

  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`
  );

  const messageDiv = document.createElement("div");

  messageDiv.className = "admin_message_client";
  messageDiv.innerHTML = `<span class="admin_user_email">${connection.user.email}</span>`;
  messageDiv.innerHTML += `<span>${data.message.text}</span>`;
  messageDiv.innerHTML += `<span class="admin_date">${dayjs(
    data.message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(messageDiv);

  scrollToBottom(connection.user_id);
});

function call(id) {
  const connection = openConnections.find(
    (connection) => connection.socket_id === id
  );

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  //-- Pensar em uma solução para fechar o evento do chat
  //socket.emit("admin_in_call_to_user", params);

  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      //Criando o html na mão pra treinar
      //Porém é possivel usar algum template e usá-lo com o Mustache - https://mustache.github.io/

      if (message.admin_id === null) {
        messageDiv.className = "admin_message_client";
        messageDiv.innerHTML = `<span class="admin_user_email">${connection.user.email}</span>`;
        messageDiv.innerHTML += `<span>${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        messageDiv.className = "admin_message_admin";
        messageDiv.innerHTML = `Você: <span>${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      }
      divMessages.appendChild(messageDiv);
    });

    scrollToBottom(connection.user_id);
    addEventToInput(connection.user_id);
  });
}

function sendMessage(user_id) {
  const text = document.getElementById(`send_message_${user_id}`).value;
  const params = {
    text,
    user_id,
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${user_id}`);
  const messageDiv = document.createElement("div");

  messageDiv.className = "admin_message_admin";
  messageDiv.innerHTML = `Atendente: <span>${text}</span>`;
  messageDiv.innerHTML += `<span class="admin_date">${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )}</span>`;

  divMessages.appendChild(messageDiv);

  scrollToBottom(user_id);

  document.getElementById(`send_message_${user_id}`).value = "";
}

function scrollToBottom(id) {
  var element = document.getElementById("allMessages" + id);
  element.scrollTop = element.scrollHeight;
}

function addEventToInput(id) {
  document
    .getElementById("send_message_" + id)
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendMessage(id);
      }
    });
}
