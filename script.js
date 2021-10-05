drawChart(
  "Grafik Rasio Kasus Baru Terhadap Spesimen Covid di Indonesia",
  "Rasio",
  "Tanggal",
  "Rasio"
);
drawCaseChart();
drawTesChart();
function linearModel(data) {}

async function drawCaseChart() {
  const dataUse = await getData();
  drawSingleChart(
    "Grafik Kasus Harian Covid-19 Di Indonesia",
    "Kasus",
    "Tanggal",
    "Kasus",
    dataUse.tgl,
    dataUse.kasus,
    "yellow",
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
    "lime",
    "tesChart"
  );
}

async function drawChart(title, titleline, xtitle, ytitle) {
  //data
  Chart.defaults.scales.linear.min = 0;
  const datapoint = await getData();
  const data = {
    labels: datapoint.tgl,
    datasets: [
      {
        label: titleline,
        data: datapoint.ratio,
        borderColor: "#3e95cd",
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
  const y = document.getElementsByClassName("ratioChart");
  Array.prototype.slice.call(y).forEach((data) => {
    new Chart(data, config);
  });
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
  Chart.defaults.scales.linear.min = 0;
  const data = {
    labels: xaxis,
    datasets: [
      {
        label: titleline,
        data: yaxis,
        borderColor: border,
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
  const y = document.getElementsByClassName(classChart);
  Array.prototype.slice.call(y).forEach((data) => {
    new Chart(data, config);
  });
}

async function getData() {
  const url = "dailyCaseIndo.csv";
  const response = await fetch(url);
  const datapoints = await response.text();
  const data = datapoints.split("\n").slice(19);
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
  return { tgl, kasus, tes, ratio };
}
