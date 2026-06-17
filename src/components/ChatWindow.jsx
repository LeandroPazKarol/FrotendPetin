import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ChatWindow = ({ match, myPetId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);


  const roomId = [myPetId, match.toPet._id].sort().join('-');

  useEffect(() => {
    // historial de chay
    const fetchHistory = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3005/api/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Error al obtener historial", error);
      }
    };
    fetchHistory();

    // socket.io
    socketRef.current = io('http://localhost:3005');
    
    socketRef.current.emit('join_chat', roomId);

    socketRef.current.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = sessionStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const myUserId = payload.id;

    socketRef.current.emit('send_message', {
      roomId,
      senderId: myUserId,
      text: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl animate-fade-in-up">
        
        {/* Cabecera del Chat */}
        <div className="bg-gradient-brand p-4 flex items-center gap-4 text-white">
          <button onClick={onClose} className="text-2xl hover:opacity-80 transition-opacity">⬅️</button>
          <img 
            src={match.toPet.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'} 
            alt={match.toPet.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold leading-tight">{match.toPet.name}</h2>
            <p className="text-xs opacity-80">En línea ahora 🟢</p>
          </div>
        </div>

        {/* Zona de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-4 text-sm bg-white p-3 rounded-xl shadow-sm border border-gray-100 mx-auto">
              ¡Has hecho Match con {match.toPet.name}! <br/> Envíale un saludo 🐾
            </p>
          )}
          
          {messages.map((msg, i) => {
            const token = sessionStorage.getItem('token');
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isMe = msg.sender === payload.id;

            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 max-w-[75%] rounded-2xl ${isMe ? 'bg-brand-purple text-white rounded-br-none shadow-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Caja de Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un guau-mensaje..."
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-full outline-none focus:ring-2 focus:ring-brand-purple transition-all"
          />
          <button type="submit" className="w-12 h-12 bg-gradient-brand text-white rounded-full flex items-center justify-center text-xl hover:opacity-90 shadow-md transform hover:scale-105 transition-all focus:outline-none">
            ✈️
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatWindow;
