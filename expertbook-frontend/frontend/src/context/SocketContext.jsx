import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

/**
 * SocketContext
 * Provides a single Socket.io connection to the entire app via React Context.
 * Any component can call useSocket() to access the socket instance.
 *
 * Key concept: Context prevents "prop drilling" — no need to pass socket
 * as a prop through every component layer.
 */

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    const socketInstance = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],  // skip long-polling for performance
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount – prevents memory leaks
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for consuming context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside a <SocketProvider>");
  }
  return context;
};
