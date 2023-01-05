const prettyms = require("pretty-ms"),
	si = require("systeminformation");

function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

let cached_data = {};
let filesys_interval;

exports.name = "sys_info";
exports.pollingArgs = {
	init: true
};
exports.initArgs = {
	init: false
};
exports.pollingRate = 500;

exports.onLoad = function(args) {
	return new Promise(async (resolve, reject) => {

		osI = await si.osInfo();
		sy = await si.system();
		filesys = [];
		si.fsSize().then((fsSize) => {
			fsSize.forEach((cv) => {
				filesys.push({
					name: `${cv.fs} (${cv.mount})`,
					used: `${formatBytes(cv.used)} / ${formatBytes(cv.size)} (${cv.use}%)`
				});
			});
		});
		cached_data = {
			osI,
			sy,
			filesys
		};
		filesys_interval = setInterval(()=>{
			console.log(`[sys_info] filesys_interval ran.`)
			filesys = [];
			si.fsSize().then((fsSize) => {
				fsSize.forEach((cv) => {
					filesys.push({
						name: `${cv.fs} (${cv.mount})`,
						used: `${formatBytes(cv.used)} / ${formatBytes(cv.size)} (${cv.use}%)`
					});
				});
			});
			cached_data["filesys"] = filesys;
		},900000);
		resolve(true);
	});
}

exports.main = function(args) {
	return new Promise(async (resolve, reject) => {
		
		cpuTemp = await si.cpuTemperature();
		siMem = await si.mem();


		resolve({
			ptmp: cpuTemp.main,
			pmem: formatBytes(siMem.active) + " / " + formatBytes(siMem.total) + " (" + formatBytes(siMem.available) + " available)",
			umem: siMem.active * 0.000001,
			uptime: prettyms(si.time().uptime * 1000),
			filesystems: cached_data.filesys,
			sys: {
				model: cached_data.sy.model,
				hostname: cached_data.osI.hostname,
				kernel: cached_data.osI.kernel
			}
		});
	});
}