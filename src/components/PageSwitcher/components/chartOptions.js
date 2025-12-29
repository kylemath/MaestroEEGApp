import * as generalTranslations from "./translations/en";

export const chartStyles = {
  wrapperStyle: {
    display: "flex",
    flexWrap: "wrap",
    padding: "20px"
  }
};

export const emptyPpgChannelData = {
  ch0: {
    datasets: [{ data: null }]
  },
  ch1: {
    datasets: [{ data: null }]
  },
  ch2: {
    datasets: [{ data: null }]
  }
};

export const emptyChannelData = {
  ch0: {
    datasets: [{ data: null }]
  },
  ch1: {
    datasets: [{ data: null }]
  },
  ch2: {
    datasets: [{ data: null }]
  },
  ch3: {
    datasets: [{ data: null }]
  }
};

export const emptyAuxChannelData = {
  ch0: {
    datasets: [{ data: null, qual: null, rawData: null, timeLabels: null }]
  },
  ch1: {
    datasets: [{ data: null, qual: null, rawData: null, timeLabels: null }]
  },
  ch2: {
    datasets: [{ data: null, qual: null, rawData: null, timeLabels: null }]
  },
  ch3: {
    datasets: [{ data: null, qual: null, rawData: null, timeLabels: null }]
  },
  ch4: {
    datasets: [{ data: null, qual: null, rawData: null, timeLabels: null }]
  }
};

export const emptySingleChannelData = {
  ch1: {
    datasets: [{ data: null }]
  }
};


export const generalOptions = {
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true
        }
      }
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true
        }
      }
    ]
  },
  elements: {
    point: {
      radius: 0
    }
  },
  title: {
    display: true,
    text: generalTranslations.channel
  },
  responsive: true,
  tooltips: { enabled: false },
  legend: { display: false }
};
