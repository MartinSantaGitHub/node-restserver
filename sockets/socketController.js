import { Socket } from "socket.io";
import { checkJWT } from "../helpers/generate-jwt.js";
import ChatInfo from "../models/chat-info.js";

const chatInfo = new ChatInfo();

const socketController = async (socket = new Socket(), io) => {
    const user = await checkJWT(socket.handshake.headers["x-token"]);

    if (!user) {
        return socket.disconnect();
    }

    chatInfo.connectUser(user);

    io.emit("active-users", chatInfo.usersArr);
    socket.emit("receive-message", chatInfo.lastTen);

    socket.join(user.id);

    socket.on("disconnect", () => {
        chatInfo.disconnectUser(user.id);
        io.emit("active-users", chatInfo.usersArr);
    });

    socket.on("send-message", ({ uid, message }) => {
        if (uid) {
            socket
                .to(uid)
                .emit("private-message", { from: user.name, message });
        } else {
            chatInfo.sendMessage(user.id, user.name, message);
            io.emit("receive-message", chatInfo.lastTen);
        }
    });
};

export { socketController };
