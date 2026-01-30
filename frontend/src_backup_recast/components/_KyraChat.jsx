import { useState } from "react";

export default function KyraChat() {
  const [messages, setMessages] = useState([
    { sender: "kyra", text: "Olá! Sou a Kyra. Como posso ajudar você hoje?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await get("/home/chat"),
      });

      const data = await response.json();
      const kyraResponse = { sender: "kyra", text: data.response };
      setMessages((prev) => [...prev, kyraResponse]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-indigo-600 text-white p-3 font-semibold text-center">
        Kyra 🤖
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm ${
                msg.sender === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Campo de entrada */}
      <div className="flex p-2 border-t border-gray-200">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-indigo-300"
          placeholder="Digite algo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-indigo-600 text-white px-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
