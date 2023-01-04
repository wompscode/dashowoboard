const express = require("express"),
	http = require("http"),
	app = express(),
	server = http.createServer(app),
	socketio = require("socket.io"),
	io = new socketio.Server(server),
	prettyms = require("pretty-ms"),
	config = require("./config.json"),
	si = require("systeminformation");
taglines = config.taglines;
app.set('view engine', 'ejs');

function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

function getData(rt = false) {
	return new Promise(async (resolve, reject) => {
		cpuTemp = await si.cpuTemperature();
		osI = await si.osInfo();
		sy = await si.system();
		siMem = await si.mem();
		if (rt == false) {
			filesys = [];
			await si.fsSize((fsSize) => {
				fsSize.forEach((cv) => {
					filesys.push({
						name: `${cv.fs} (${cv.mount})`,
						used: `${formatBytes(cv.used)} / ${formatBytes(cv.size)} (${cv.use}%)`
					});
				});
			});
		}
		resolve({
			ptmp: cpuTemp.main,
			pmem: formatBytes(siMem.active) + " / " + formatBytes(siMem.total) + " (" + formatBytes(siMem.available) + " available)",
			umem: siMem.active * 0.000001,
			uptime: prettyms(si.time().uptime * 1000),
			filesystems: rt ? [] : filesys,
			sys: {
				model: sy.model,
				hostname: osI.hostname,
				kernel: osI.kernel
			}
		});
	});
}
socketEmitter = setInterval(() => {
	getData(true).then((data) => {
		io.emit('pi_data', data);
	})
}, 500);
io.on('connection', (socket) => {
	console.log('connected.');
	socket.on('disconnect', () => {
		console.log('disconnected.');
	});
});
app.use(express.static('public'))
app.get("/", (req, res) => {
	getData().then((data) => {
		res.render('pages/index', Object.assign({
			tagl: taglines[Math.floor(Math.random() * taglines.length)]
		}, data));
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