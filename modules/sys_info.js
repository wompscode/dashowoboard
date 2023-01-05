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
exports.name = "sys_info";
exports.pollingArgs = {
	rt: true
};
exports.initArgs = {
	rt: false
};
exports.pollingRate = 500;
exports.main = function(args) {
	return new Promise(async (resolve, reject) => {
		cpuTemp = await si.cpuTemperature();
		osI = await si.osInfo();
		sy = await si.system();
		siMem = await si.mem();
		if (args.rt == false) {
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
			filesystems: args.rt ? [] : filesys,
			sys: {
				model: sy.model,
				hostname: osI.hostname,
				kernel: osI.kernel
			}
		});
	});
}