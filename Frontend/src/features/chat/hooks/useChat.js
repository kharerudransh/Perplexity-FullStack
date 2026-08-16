import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, deleteChat, getMessages, getChat } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setCurrentChatId, setIsLoading, setError } from "../chat.slice.js";

export const useChat = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    async function handleLoadChats() {
        dispatch(setIsLoading(true));
        try {
            const data = await getMessages();
            const chatsMap = {};
            data.chats.forEach((c) => {
                chatsMap[c._id] = { ...c, messages: [] };
            });
            dispatch(setChats(chatsMap));
        }
        catch (err) {
            dispatch(setError(err.response ? err.response.data : err.message));
        }
        finally {
            dispatch(setIsLoading(false));
        }
    }

    async function handleLoadChat(chatId) {
        dispatch(setIsLoading(true));
        try {
            const data = await getChat(chatId);
            dispatch(setChats({
                ...chats,
                [chatId]: { ...data.chat, messages: data.messages }
            }));
        }
        catch (err) {
            dispatch(setError(err.response ? err.response.data : err.message));
        }
        finally {
            dispatch(setIsLoading(false));
        }
    }

    async function handleSendMessage({ message, chatId }) {
        dispatch(setIsLoading(true));
        try {
            const data = await sendMessage({ message, chatId });
            const { chat, aiMessage } = data;

            dispatch(setChats({
                ...chats,
                [chat._id]: {
                    ...chat,
                    messages: [
                        ...(chats[chat._id]?.messages || []),
                        { content: message, role: "user" },
                        aiMessage
                    ]
                }
            }));
            dispatch(setCurrentChatId(chat._id));

            return { chatId: chat._id, aiMessage };
        }
        catch (err) {
            dispatch(setError(err.response ? err.response.data : err.message));
            throw err;
        }
        finally {
            dispatch(setIsLoading(false));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId);
            const updated = { ...chats };
            delete updated[chatId];
            dispatch(setChats(updated));
        }
        catch (err) {
            dispatch(setError(err.response ? err.response.data : err.message));
            throw err;
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleLoadChats,
        handleLoadChat,
        handleDeleteChat,
    }
}