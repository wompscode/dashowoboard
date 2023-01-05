/* Please avoid modifying this. */

this.socket = io({
    reconnectionAttempts: 3
});
this.first_conn = true;
// connection handling
this.socket.io.on("reconnect_attempt", (attempt) => {
    document.querySelector("#infotable").style.display = "block";
    document.querySelector("#info").innerText = `trying to reconnect. (attempt ${attempt})`;
    document.querySelector("#info").style.color = "red";
});

this.socket.on("disconnect", () => {
    document.querySelector("#infotable").style.display = "block";
    document.querySelector("#info").innerText = `disconnected.`;
    document.querySelector("#info").style.color = "red";
});

this.socket.io.on("reconnect_failed", () => {
    document.querySelector("#infotable").style.display = "block";
    document.querySelector("#info").innerText = `failed to reconnect, refreshing in 15 seconds..`;
    document.querySelector("#info").style.color = "red";
    setTimeout(function() {
        window.location.reload();
    }, 15000);
});

this.socket.io.on("reconnect", (attempt) => {
    document.querySelector("#infotable").style.display = "block";
    document.querySelector("#info").innerText = `successfully reconnected.`;
    document.querySelector("#info").style.color = "lime";
    setTimeout(() => {
        document.querySelector("#info").innerText = ``;
        document.querySelector("#infotable").style.display = "none";
    }, 2000)
});

this.socket.on("connect", () => {
    if(this.first_conn == false) return;
    this.socket.emit('request_init');
    document.querySelector("#infotable").style.display = "block";
    document.querySelector("#info").innerText = `connected. some modules may take a moment to init.`;
    document.querySelector("#info").style.color = "lime";
    setTimeout(() => {
        document.querySelector("#info").innerText = ``;
        document.querySelector("#infotable").style.display = "none";
    }, 2000)
});


