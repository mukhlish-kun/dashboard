let globalChart = null;

drawChart(
  "Grafik Rasio Kasus Baru Terhadap Spesimen Covid di Indonesia",
  "Rasio",
  "Tanggal",
  "Rasio"
);

drawCaseChart();
drawTesChart();

function graph() {
  const pil = document.getElementById("data-selector");
  drawChart(
    "Grafik Rasio Kasus Baru Terhadap Spesimen Covid di Indonesia",
    "Rasio",
    "Tanggal",
    "Rasio",
    pil.value
  );
}

function bouncer(arr) {
  return arr.filter(Boolean);
}

function isGenap(n) {
  return n % 2 == 0;
}

function addOption() {
  var select = document.getElementById("dynamic-select");
  select.options[select.options.length] = new Option("New Element", "0");
}

function quadraticModel(data) {
  const x = [];
  const x2 = [];
  const x4 = [];
  const xy = [];
  const ymod = [];
  const x2y = [];
  const panjang = data.length;
  if (isGenap(panjang)) {
    i = -1 * (panjang / 2);
    data.forEach((row) => {
      if (i !== 0) {
        x.push(i);
        x2.push(i * i);
        x4.push(i * i * i * i);
        xy.push(i * row);
        x2y.push(i * i * row);
      } else {
        i++;
        x.push(i);
        x2.push(i * i);
        x4.push(i * i * i * i);
        xy.push(i * row);
        x2y.push(i * i * row);
      }
      i++;
    });
  } else {
    i = (-1 * (panjang - 1)) / 2;
    data.forEach((row) => {
      x.push(i);
      x2.push(i * i);
      x4.push(i * i * i * i);
      xy.push(i * row);
      x2y.push(i * i * row);
      i++;
    });
  }
  const sumx4 = x4.reduce((a, b) => a + b, 0);
  const sumx2y = x2y.reduce((a, b) => a + b, 0);
  const sumx2 = x2.reduce((a, b) => a + b, 0);
  const sumxy = xy.reduce((a, b) => a + b, 0);
  const sumy = data.reduce((a, b) => a + b, 0);

  const a = (sumy * sumx4 - sumx2y * sumx2) / (panjang * sumx4 - sumx2 * sumx2);
  const b = sumxy / sumx2;
  const c =
    (panjang * sumx2y - sumx2 * sumy) / (panjang * sumx4 - sumx2 * sumx2);

  x.forEach((row) => {
    ymod.push(a + b * row + c * row * row);
  });

  return ymod;
}
function linearModel(data) {
  const x = [];
  const x2 = [];
  const xy = [];
  const ymod = [];
  const panjang = data.length;
  if (isGenap(panjang)) {
    i = -1 * (panjang / 2);
    data.forEach((row) => {
      if (i !== 0) {
        x.push(i);
        x2.push(i * i);
        xy.push(i * row);
      } else {
        z = i + 1;
        x.push(z);
        x2.push(z * z);
        xy.push(z * row);
        i++;
      }
      i++;
    });
  } else {
    i = (-1 * (panjang - 1)) / 2;
    data.forEach((row) => {
      x.push(i);
      x2.push(i * i);
      xy.push(i * row);

      i++;
    });
  }
  const sumy = data.reduce((a, b) => a + b, 0);
  const sumxy = xy.reduce((a, b) => a + b, 0);
  const sumx2 = x2.reduce((a, b) => a + b, 0);
  const a = sumy / panjang;
  const b = sumxy / sumx2;
  x.forEach((row) => {
    ymod.push(a + b * row);
  });
  return ymod;
}

async function drawCaseChart() {
  const dataUse = await getData();
  //await getData();
  drawSingleChart(
    "Grafik Kasus Harian Covid-19 Di Indonesia",
    "Kasus",
    "Tanggal",
    "Kasus",
    dataUse.tgl,
    dataUse.kasus,
    "#de425b",
    "caseChart"
  );
}

async function drawTesChart() {
  const dataUse = await getData();
  drawSingleChart(
    "Grafik Spesimen Harian Covid-19 Di Indonesia",
    "Spesimen",
    "Tanggal",
    "Spesimen",
    dataUse.tgl,
    dataUse.tes,
    "#488f31",
    "tesChart"
  );
}

async function drawChart(title, titleline, xtitle, ytitle, click) {
  //data
  const y = document.getElementById("ratioChart");
  Chart.defaults.scales.linear.min = 0;
  const datapoint = await getData();
  const panjang = datapoint.tgl.length;

  if (click == "1") {
    if (globalChart != null) {
      globalChart.destroy();
    }
  }
  if (click == "2020") {
    const slice = datapoint.tgl.indexOf("1 Januari 2021");
    const tgl = datapoint.tgl.slice(0, slice);
    const ratio = datapoint.ratio.slice(0, slice);
    datapoint.tgl = tgl;
    datapoint.ratio = ratio;
    if (globalChart != null) {
      globalChart.destroy();
    }
  }
  if (click == "2021") {
    const tgl = datapoint.tgl.slice(284, panjang);
    const ratio = datapoint.ratio.slice(284, panjang);
    datapoint.tgl = tgl;
    datapoint.ratio = ratio;
    if (globalChart != null) {
      globalChart.destroy();
    }
  }

  const data = {
    labels: datapoint.tgl,
    datasets: [
      {
        label: titleline,
        data: bouncer(datapoint.ratio),
        borderColor: "#003f5c",
        backgroundColor: "#003f5c",
        fill: false,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Model linear",
        data: linearModel(bouncer(datapoint.ratio)),
        borderColor: "#bc5090",
        backgroundColor: "#bc5090",
        borderDash: [5, 5],
        fill: false,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Model kuadrat",
        data: quadraticModel(bouncer(datapoint.ratio)),
        borderColor: "#ffa600",
        backgroundColor: "#ffa600",
        borderDash: [20, 10],
        fill: false,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  //config
  const config = {
    type: "line",
    data: data,
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      aspectRatio: 1.4,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 20,
          },
        },
      },
      interaction: {
        intersect: false,
      },
      layout: {
        padding: 3,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: xtitle,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: ytitle,
          },
        },
      },
    },
  };
  globalChart = new Chart(y, config);
}

async function drawSingleChart(
  title,
  titleline,
  xtitle,
  ytitle,
  xaxis,
  yaxis,
  border,
  classChart
) {
  //data
  const y = document.getElementsByClassName(classChart);
  Chart.defaults.scales.linear.min = 0;
  const data = {
    labels: xaxis,
    datasets: [
      {
        label: titleline,
        data: yaxis,
        borderColor: border,
        backgroundColor: border,
        //"#3e95cd",
        fill: false,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  //config
  const config = {
    type: "line",
    data: data,
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      responsive: true,
      aspectRatio: 1.4,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 20,
          },
        },
      },
      interaction: {
        intersect: false,
      },
      layout: {
        padding: 3,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: xtitle,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: ytitle,
          },
        },
      },
    },
  };
  chart = new Chart(y, config);
}

async function getData() {
  const url = "dailyCaseIndo.csv";
  const response = await fetch(url);
  const datapoints = await response.text();
  const data = datapoints.split("\n").slice(1);
  const tgl = [];
  const kasus = [];
  const tes = [];
  const ratio = [];
  data.forEach((row) => {
    const column = row.split(",");
    moment.locale("id");
    let dt = moment(column[3], "MM-DD-YYYY");
    tgl.push(dt.format("LL"));
    kasus.push(column[6]);
    tes.push(column[29]);
    const sq = column[6] / column[29];
    ratio.push(sq);
  });
  return {
    tgl,
    kasus,
    tes,
    ratio,
  };
}
