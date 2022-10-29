const url = window.location.hostname.includes("localhost")
    ? "http://localhost:8005/api/auth"
    : "https://restserver-msanta-cafe.herokuapp.com/api/auth";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {};

    for (const element of form.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch(`${url}/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    })
        .then((resp) => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }

            localStorage.setItem("token", token);

            window.location = "chat.html";
        })
        .catch((err) => console.log(err));

    console.log(formData);
});

function handleCredentialResponse(response) {
    // Google Token: ID_TOKEN

    //console.log('id_token', response.credential);

    // Prod: https://restserver-msanta-cafe.herokuapp.com/api/auth
    // Dev:  http://localhost:8005/api/auth

    const body = { id_token: response.credential };

    fetch(`${url}/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.user.email);

            window.location = "chat.html";
        })
        .catch((err) => console.log(err));
}

document.querySelector("#google_sign_out").onclick = () => {
    console.log(google.accounts.id);

    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
};
