// HTML References
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnExit = document.querySelector("#btnExit");

const url = window.location.hostname.includes("localhost")
    ? "http://localhost:8005/api/auth"
    : "https://restserver-msanta-cafe.herokuapp.com/api/auth";

let user = null;
let socket = null;

const validateJWT = async () => {
    const token = localStorage.getItem("token") || "";

    if (token.length <= 10) {
        window.location = "index.html";

        throw new Error("No token found");
    }

    try {
        const resp = await fetch(url, {
            headers: { "x-api-key": token },
        });

        const { authenticatedUser: userDB, token: tokenDB } = await resp.json();

        localStorage.setItem("token", tokenDB);

        user = userDB;

        document.title = user.name;

        await connectSocket();
    } catch (err) {
        console.error(err);
        window.location = "index.html";
    }
};

const connectSocket = async () => {
    socket = io({
        extraHeaders: {
            "x-token": localStorage.getItem("token"),
        },
    });

    socket.on("connect", () => {
        console.log("Sockets online");
    });

    socket.on("disconnect", () => {
        console.log("Sockets offline");
    });

    socket.on("receive-message", renderMessages);
    socket.on("active-users", renderUsers);
    socket.on("private-message", (payload) => {
        console.log("Private", payload);
    });
};

const renderUsers = (users = []) => {
    let usersHtml = "";

    users.forEach(({ name, uid }) => {
        usersHtml += `<li>
            <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>`;
    });

    ulUsers.innerHTML = usersHtml;
};

const renderMessages = (messages = []) => {
    let messagesHtml = "";

    messages.forEach(({ message, name }) => {
        messagesHtml += `<li>
            <p>
                <span class="text-primary">${name}: </span>
                <span>${message}</span>
            </p>
        </li>`;
    });

    ulMessages.innerHTML = messagesHtml;
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if (keyCode !== 13 || message.length === 0) {
        return;
    }

    socket.emit("send-message", { message, uid });

    txtMessage.value = "";
});

btnExit.addEventListener("click", () => {
    localStorage.clear();

    window.location = "index.html";
});

const main = async () => {
    await validateJWT();
};

main();
