// Data for the graph (example data)
const labels = ["Move 1", "Move 2", "Move 3", "Move 4", "Move 5"];
const evaluationData = [0, -0.5, 1, -1, 0.5];

// Create the chart
const ctx = document.getElementById("analysisGraph").getContext("2d");

// Custom plugin to draw the connecting lines
Chart.plugins.register({
  afterDraw: function(chart) {
    const { ctx, scales } = chart;

    const dataset = chart.data.datasets[0];
    const points = dataset.data;

    ctx.save();
    ctx.strokeStyle = dataset.borderColor || "black";
    ctx.lineWidth = dataset.borderWidth || 1;
    ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const x = scales["x"].getPixelForValue(i);
      const y = scales["y"].getPixelForValue(point);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
});

new Chart(ctx, {
  type: "scatter",
  data: {
    labels: labels,
    datasets: [{
      data: evaluationData,
      borderColor: "blue",
      backgroundColor: "blue",
      pointRadius: 4,
      pointHoverRadius: 6,
      showLine: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)"
        },
        ticks: {
          suggestedMin: -1,
          suggestedMax: 1
        }
      }
    }
  }
});
