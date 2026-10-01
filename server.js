const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Meu Chat</title>
    </head>
    <body>
      <h1>Meu Chat 💬</h1>
      <div id="mensagens"></div>
      <form id="formulario">
        <input id="mensagem" placeholder="Digite sua mensagem..." required>
        <button>Enviar</button>
      </form>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const formulario = document.getElementById("formulario");
        const campo = document.getElementById("mensagem");
        const mensagens = document.getElementById("mensagens");

        formulario.addEventListener("submit", (e) => {
          e.preventDefault();
          const texto = campo.value.trim();
          if (texto) {
            socket.emit("mensagem", texto);
            campo.value = "";
          }
        });

        socket.on("mensagem", (texto) => {
          const linha = document.createElement("p");
          linha.textContent = texto;
          mensagens.appendChild(linha);
        });
      </script>
    </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  socket.on("mensagem", (texto) => {
    if (typeof texto === "string" && texto.trim()) {
      io.emit("mensagem", texto.trim().slice(0, 1000));
    }
  });
});

const PORT = process.env.PORT || 3000;

servidor.listen(PORT, "0.0.0.0", () => {
  console.log("Site funcionando na porta " + PORT);
});