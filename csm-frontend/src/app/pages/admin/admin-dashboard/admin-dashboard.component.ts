import { Component, ViewChild } from '@angular/core';
import { AgChartsAngular } from 'ag-charts-angular';

import {
  AgCartesianChartOptions,
  AgCartesianSeriesTooltipRendererParams,
  AgCharts,
  AgPolarChartOptions,
  AgTooltipRendererResult,
} from "ag-charts-enterprise";
const numFormatter = new Intl.NumberFormat("en-US");
const tooltip = {
  renderer: ({
    title,
    datum,
    xKey,
    yKey,
  }: AgCartesianSeriesTooltipRendererParams): AgTooltipRendererResult => ({
    title,
    content: `${datum[xKey]}: ${numFormatter.format(datum[yKey])}`,
  }),
};
const barOptions: AgCartesianChartOptions = {
  series: [
    {
      type: "bar",
      xKey: "station",
      yKey: "early",
      stacked: true,
      yName: "Early",
      tooltip,
    },
    {
      type: "bar",
      xKey: "station",
      yKey: "morningPeak",
      yName: "Morning peak",
      stacked: true,
      tooltip,
    },
    {
      type: "bar",
      xKey: "station",
      yKey: "interPeak",
      yName: "Between peak",
      stacked: true,
      tooltip,
    },
    {
      type: "bar",
      xKey: "station",
      yKey: "afternoonPeak",
      yName: "Afternoon peak",
      stacked: true,
      tooltip,
    },
    {
      type: "bar",
      xKey: "station",
      yKey: "evening",
      yName: "Evening",
      stacked: true,
      tooltip,
    },
  ],
  axes: [
    {
      type: "category",
      position: "bottom",
    },
    {
      type: "number",
      position: "left",
      label: {
        formatter: (params:any) => {
          return params.value / 1000 + "k";
        },
      },
    },
  ],
};
const lineOptions: AgCartesianChartOptions = {
  series: [
    {
      type: "line",
      xKey: "station",
      yKey: "early",
      yName: "Early",
      tooltip,
    },
    {
      type: "line",
      xKey: "station",
      yKey: "morningPeak",
      yName: "Morning peak",
      tooltip,
    },
    {
      type: "line",
      xKey: "station",
      yKey: "interPeak",
      yName: "Between peak",
      tooltip,
    },
    {
      type: "line",
      xKey: "station",
      yKey: "afternoonPeak",
      yName: "Afternoon peak",
      tooltip,
    },
    {
      type: "line",
      xKey: "station",
      yKey: "evening",
      yName: "Evening",
      tooltip,
    },
  ],
  axes: [
    {
      type: "category",
      position: "bottom",
    },
    {
      type: "number",
      position: "left",
      label: {
        formatter: (params:any) => {
          return params.value / 1000 + "k";
        },
      },
    },
  ],
};

const donutOptions: AgPolarChartOptions = {
  series: [
    {
      type: "pie",
      title: {
        text: "Morning Peak",
      },
      calloutLabelKey: "station",
      legendItemKey: "station",
      angleKey: "morningPeak",
      outerRadiusRatio: 0.6,
    },
    {
      type: "donut",
      title: {
        text: "Afternoon Peak",
      },
      calloutLabelKey: "station",
      legendItemKey: "station",
      angleKey: "afternoonPeak",
      innerRadiusRatio: 0.7,
      showInLegend: false,
    },
  ],
  axes: [],
};

function getData() {
  return [
    {
      station: "Finsbury\nPark",
      early: 2454,
      morningPeak: 16644,
      interPeak: 9338,
      afternoonPeak: 6346,
      evening: 3547,
    },
    {
      station: "Seven\nSisters",
      early: 3927,
      morningPeak: 7581,
      interPeak: 5421,
      afternoonPeak: 3245,
      evening: 2036,
    },
    {
      station: "Tottenham\nHale",
      early: 6836,
      morningPeak: 12740,
      interPeak: 14964,
      afternoonPeak: 12790,
      evening: 8428,
    },
    {
      station: "Warren\nStreet",
      early: 9108,
      morningPeak: 1210,
      interPeak: 5902,
      afternoonPeak: 10947,
      evening: 5574,
    },
    {
      station: "Oxford\nCircus",
      early: 7170,
      morningPeak: 1796,
      interPeak: 26616,
      afternoonPeak: 32269,
      evening: 3665,
    },
    {
      station: "Green\nPark",
      early: 6252,
      morningPeak: 1911,
      interPeak: 11971,
      afternoonPeak: 19749,
      evening: 11582,
    },
  ];
}
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  public options;

  @ViewChild(AgChartsAngular)
  public agCharts!: AgChartsAngular;

  
  constructor() {
    this.options = {
      data: getData(),
      animation: {
        enabled: true,
      },
      ...barOptions,
    };
  }

  changeSeriesBar = () => {
    const options = { ...this.options };

    options.series = barOptions.series;
    options.axes = barOptions.axes;

    this.options = options;
  };

  changeSeriesLine = () => {
    const options = { ...this.options };

    options.series = lineOptions.series;
    options.axes = lineOptions.axes;

    this.options = options;
  };

 

  // changeSeriesDonut = () => {
  //   const options = { ...this.options };

  //   options.series = donutOptions.series;
  //   options.axes = donutOptions.axes;

  //   this.options = options;
  // };
}
