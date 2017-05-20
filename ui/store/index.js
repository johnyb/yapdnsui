
let servers = [];
fetch('/servers', { 'Content-Type': 'json' }).then((response) => response.json()).then((data) => {
    servers.push.apply(servers, data);
});

module.exports = {
    servers
};
