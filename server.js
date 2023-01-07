const express = require("express"),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	socketio = require("socket.io"),
	io = new socketio.Server(server),
	fs = require('fs'),
	config = require("./config.json"),
	taglines = config.taglines;
app.set('view engine', 'ejs');
const emitters = {};
const modules = {};
const helpers = {
	io_emit: function(key, value) {
		return io.emit(key, value);
	}
}
for (const file of fs.readdirSync("./modules").filter(file => file.endsWith(".js"))) {
	console.log(`Loading module ${file.split(".")[0]}..`);
	try {
		const module = require(`./modules/${file}`);
        module.onLoad(helpers).then(()=>{
            modules[module.name] = module;
            emitters[module.name] = setInterval(() => {
                module.main(module.pollingArgs, null, helpers).then((c) => {
                    io.emit(`${module.name}_data`, c);
                }).catch((ex) => console.log(`There was an exception in module ${module.name}: ${ex}`));
            }, module.pollingRate)
        });
	}
	catch (ex) {
		console.log(`Could not load module ${file.split(".")[0]}: ${ex}`)
	}
}
io.on('connection', (socket) => {
	socket.on("request_init", () => {
		console.log('connected.');
		for (let value of Object.keys(modules)) {
			new Promise((reso, reje) => {
				var module = modules[value];
				module.main(module.initArgs, socket, helpers).then((c) => {
					if(c == null) return;
					socket.emit(`${value}_init`, c);
				}).catch((ex) => console.log(`There was an exception in module ${value}: ${ex}.`));
			})
		}
	});
	socket.on('disconnect', () => {
		console.log('disconnected.');
	});
});
app.use(express.static('public'))
app.get("/", async (req, res) => {
	res.render('pages/index', {
		title: config.dash_name,
		tagl: taglines[Math.floor(Math.random() * taglines.length)]
	});
});
app.get('*', function(req, res) {
	res.status(404).render('pages/404', {
		atPage: req.path
	});
});
server.listen(config.port, () => {
	console.log(`listening on *:${config.port}`);
});