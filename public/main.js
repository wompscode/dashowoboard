var socket = io({
	reconnectionAttempts: 3
});
// common chart options
const options = {
	plugins: {
		legend: {
			display: true,
		}
	},
	scales: {
		x: {
			ticks: {
				display: false
			}
		}
	}
}
Chart.defaults.font.family = "monospace";
// temp chart
var piTempArray = [];
var piTempChart = new Chart(document.getElementById('piTempC'), {
	type: 'line',
	data: {
		labels: piTempArray,
		datasets: [{
			label: 'temperature (in c)',
			data: piTempArray,
			fill: true,
			backgroundColor: "rgba(0,0,0,1.0)",
			borderColor: 'rgb(131, 87, 179)',
			pointRadius: 2.5,
			pointHoverRadius: 2.8,
			tension: 0.05
		}]
	},
	options
});
piTempChart.paused = false;
// memory chart
var piMemArray = [];
var piMemChart = new Chart(document.getElementById('piMemC'), {
	type: 'line',
	data: {
		labels: piTempArray,
		datasets: [{
			label: 'memory (in mb)',
			data: piTempArray,
			fill: true,
			backgroundColor: "rgba(0,0,0,1.0)",
			borderColor: 'rgb(131, 87, 179)',
			pointRadius: 2.5,
			pointHoverRadius: 2.8,
			tension: 0.05
		}]
	},
	options
});
piMemChart.paused = false;
document.querySelector("#dataPausePiTemp").addEventListener("click", () => {
	piTempChart.paused = !piTempChart.paused;
	document.querySelector("#dataPausePiTempT").innerText = piTempChart.paused ? "Resume graphing" : "Pause graphing";
});
document.querySelector("#dataPausePiMem").addEventListener("click", () => {
	piMemChart.paused = !piMemChart.paused;
	document.querySelector("#dataPausePiMemT").innerText = piMemChart.paused ? "Resume graphing" : "Pause graphing";
});
// connection handling
socket.io.on("reconnect_attempt", (attempt) => {
	document.querySelector("#infotable").style.display = "block";
	document.querySelector("#warning").innerText = `trying to reconnect. (attempt ${attempt})`;
});
socket.io.on("reconnect_failed", () => {
	document.querySelector("#infotable").style.display = "block";
	document.querySelector("#warning").innerText = `failed to reconnect, refreshing in 15 seconds..`;
	setTimeout(function() {
		window.location.reload();
	}, 15000);
});
socket.io.on("reconnect", (attempt) => {
	document.querySelector("#infotable").style.display = "block";
	document.querySelector("#warning").innerText = ``;
	document.querySelector("#success").innerText = `successfully reconnected.`;
	setTimeout(() => {
		document.querySelector("#success").innerText = ``;
		document.querySelector("#infotable").style.display = "none";
	}, 2000)
});
function updChart(_, arr, data, slice) {
	arr.push(data);
	arr = arr.slice(slice);
	if (_.paused == true) return;
	_.data.datasets[0].data = arr;
	_.data.labels = arr;
	_.update('none');
}
socket.on('pi_data', (data) => {
	updChart(piTempChart, piTempArray, data.ptmp, -38);
	piTempArray = piTempArray.slice(-38);
	updChart(piMemChart, piMemArray, data.umem, -45);
	piMemArray = piMemArray.slice(-45);
	document.querySelector("#piTemp").innerText = data.ptmp + "c";
	document.querySelector("#piMem").innerText = data.pmem;
	document.querySelector("#piUptime").innerText = data.uptime;
});