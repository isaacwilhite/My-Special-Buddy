// ChatContext.js

import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext(null);


export const ChatProvider = ({ children }) => {
    const [chatUser, setChatUserState] = useState(() => {
        // Get stored chat user from local storage
        const storedChatUser = localStorage.getItem('chatUser');
        // Parse and return it if available, or return null
        return storedChatUser ? JSON.parse(storedChatUser) : null;
    });

    // Function to set the chat user in context and local storage
    const setChatUser = (user) => {
        setChatUserState(user);
        localStorage.setItem('chatUser', JSON.stringify(user));
    };

    // Function to clear the chat user from context and local storage
    const clearChatUser = () => {
        setChatUserState(null);
        localStorage.removeItem('chatUser');
    };

    return (
        <ChatContext.Provider value={{ chatUser, setChatUser, clearChatUser }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);

