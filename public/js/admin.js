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
        messageDiv.innerHTML = `<span>${connection.user.email}</span>`;
        messageDiv.innerHTML += `<span>${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        messageDiv.className = "admin_message_admin";
        messageDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      }
      divMessages.appendChild(messageDiv);
    });
  });
}