getFormatter = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
      formatter: function () {
        this.value = Math.round(this.value);
        var result = this.value;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.value).length > 3) {
          var suffixNum = Math.floor(('' + this.value).length / 3);
          var shortValue = parseFloat(
            (this.value / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return '$' + result;
      }
    };
  } else if (options.yaxisLabelFormat == '%') {
    result = {
      formatter: function () {
        this.value = Math.round(this.value);
        var result = this.value;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.value).length > 3) {
          var suffixNum = Math.floor(('' + this.value).length / 3);
          var shortValue = parseFloat(
            (this.value / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return result + '%';
      }
    };
  } else {
    result = {
      formatter: function () {
        this.value = Math.round(this.value);
        var result = this.value;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.value).length > 3) {
          var suffixNum = Math.floor(('' + this.value).length / 3);
          var shortValue = parseFloat(
            (this.value / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return result;
      }
    };
  }
  return result;
};

drawColumnChart = (result) => {
  var formatterResult = getFormatter(result.options);
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'column'
    },
    title: {
      text: result.options.chartTitle
    },
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: {
      min: result.options.yaxisMin,
      max: result.options.yaxisMax,
      tickInterval: result.options.yaxisInterval,
      title: {
        text: result.options.yaxisTitle
      },
      labels: {
        formatter: formatterResult.formatter
      }
    },
    plotOptions: {
      series: {
        pointWidth: result.options.yaxisBarWidth
      }
    },
    legend: {
      enabled: result.options.showLegend
    },
    series: result.data.series
  };
  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }
  return chartOptions;
};

drawStackColumnChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'column',
      events: {
        click: result.options && result.options.clickfn
      }
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      pointFormatter: function () {
        var data = this.y;
        if (result.options.yaxisLabelFormat == '$') {
          data =
            result.options.yaxisLabelFormat +
            Highcharts.numberFormat(this.y, 0, '.', ',');
        } else if (result.options.yaxisLabelFormat == '%') {
          data =
            parseFloat(this.y).toFixed(2) + result.options.yaxisLabelFormat;
        }
        return data;
      }
    },
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: {
      min: result.options.yaxisMin,
      max: result.options.yaxisMax,
      tickInterval: result.options.yaxisInterval,
      title: {
        text: result.options.yaxisTitle
      },
      labels: {
        formatter: function () {
          // this.value = Math.round(this.value);
          var data = this.value;
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          if (('' + this.value).length > 3) {
            var suffixNum = Math.floor(('' + this.value).length / 3);
            var shortValue = parseFloat(
              (this.value / Math.pow(1000, suffixNum)).toFixed(2)
            );
            data = shortValue + suffixes[suffixNum];
          }

          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.value + result.options.yaxisLabelFormat;
          }
          return data;
        }
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          var data = this.total;
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          if (('' + this.total).length > 3) {
            var suffixNum = Math.floor(('' + this.total).length / 3);
            var shortValue = parseFloat(
              (this.total / Math.pow(1000, suffixNum)).toFixed(2)
            );
            data = shortValue + suffixes[suffixNum];
          }

          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.total + result.options.yaxisLabelFormat;
          }
          return data;
        }
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      },
      series: {
        pointWidth: result.options.yaxisBarWidth
      }
    },
    legend: {
      enabled: result.options.showLegend
    },
    series: result.data.series
  };
  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }
  return chartOptions;
};

drawClusteredStackColumnChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'column',
      events: {
        click: result.options && result.options.clickfn
      }
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      pointFormatter: function () {
        var data = this.y;
        if (result.options.yaxisLabelFormat == '$') {
          data =
            result.options.yaxisLabelFormat +
            Highcharts.numberFormat(this.y, 0, '.', ',');
        } else if (result.options.yaxisLabelFormat == '%') {
          data =
            parseFloat(this.y).toFixed(2) + result.options.yaxisLabelFormat;
        }
        return data;
      }
    },
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: {
      min: result.options.yaxisMin,
      max: result.options.yaxisMax,
      tickInterval: result.options.yaxisInterval,
      title: {
        text: result.options.yaxisTitle
      },
      labels: {
        formatter: function () {
          // this.value = Math.round(this.value);
          var data = this.value;
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          if (('' + this.value).length > 3) {
            var suffixNum = Math.floor(('' + this.value).length / 3);
            var shortValue = parseFloat(
              (this.value / Math.pow(1000, suffixNum)).toFixed(2)
            );
            data = shortValue + suffixes[suffixNum];
          }

          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.value + result.options.yaxisLabelFormat;
          }
          return data;
        }
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          var data = this.total;
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          if (('' + this.total).length > 3) {
            var suffixNum = Math.floor(('' + this.total).length / 3);
            var shortValue = parseFloat(
              (this.total / Math.pow(1000, suffixNum)).toFixed(2)
            );
            data = shortValue + suffixes[suffixNum];
          }

          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.total + result.options.yaxisLabelFormat;
          }
          return data;
        }
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      },
      series: {
        pointWidth: result.options.yaxisBarWidth
      }
    },
    legend: {
      enabled: result.options.showLegend
    },
    series: result.data.series
  };
  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }
  return chartOptions;
};

drawLineChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'line',
      events: {
        click: result.options && result.options.clickfn
      }
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      pointFormatter: function () {
        var data = this.y;
        if (result.options.yaxisLabelFormat == '$') {
          data =
            result.options.yaxisLabelFormat +
            Highcharts.numberFormat(this.y, 0, '.', ',');
        } else if (result.options.yaxisLabelFormat == '%') {
          data =
            parseFloat(this.y).toFixed(2) + result.options.yaxisLabelFormat;
        }
        return data;
      }
    },
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: {
      min: result.options.yaxisMin,
      max: result.options.yaxisMax,
      tickInterval: result.options.yaxisInterval,
      title: {
        text: result.options.yaxisTitle
      },
      labels: {
        formatter: function () {
          // this.value = Math.round(this.value);
          var data = this.value; // 12.5
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          // if (("" + this.value).length > 3) {
          //     var suffixNum = Math.floor(("" + this.value).length / 3); // 1
          //     var shortValue = parseFloat((this.value / Math.pow(1000, suffixNum)).toFixed(2)); // 0.01
          //     data = shortValue + suffixes[suffixNum]; // o/p = 0.01K
          // }
          if (data >= 1000000000000) {
            data = (data / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
          } else if (data >= 1000000000) {
            data = (data / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
          } else if (data >= 1000000) {
            data = (data / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
          } else if (data >= 1000) {
            data = (data / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
          }
          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.value + result.options.yaxisLabelFormat;
          }
          return data;
        }
      }
    },
    plotOptions: {
      series: {
        pointWidth: result.options.yaxisBarWidth,
        cursor: 'pointer',
        point: {
          events: {
            click: result.options && result.options.clickfn
          }
        }
      }
    },
    legend: {
      enabled: result.options.showLegend
    },
    series: result.data.series
  };

  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }
  return chartOptions;
};

drawPieChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      /*pointFormat: '<b>{point.y}, {point.percentage}%</b>',*/
      pointFormatter:
        result.options.tooltipFormatter ||
        function () {
          var value =
            this.y + ', ' + Highcharts.numberFormat(this.percentage, 1) + '%';
          if (result.options.yaxisLabelFormat == '$') {
            value = result.options.yaxisLabelFormat + value;
          }

          return value;
        }
    },
    legend: { align: 'center' },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          formatter:
            result.options.labelFormatter ||
            function () {
              this.y = Math.round(this.y);
              var data = this.y;
              var suffixes = ['', 'K', 'M', 'B', 'T'];

              if (('' + this.y).length > 3) {
                var suffixNum = Math.floor(('' + this.y).length / 3);
                var shortValue = parseFloat(
                  (this.y / Math.pow(1000, suffixNum)).toFixed(2)
                );
                data = shortValue + suffixes[suffixNum];
              }

              var value =
                data + ', ' + Highcharts.numberFormat(this.percentage, 1) + '%';
              if (result.options.yaxisLabelFormat == '$') {
                value = result.options.yaxisLabelFormat + value;
              }

              return value;
            }
        },
        showInLegend: result.options.showLegend
      }
    },
    series: [
      {
        type: 'pie',
        name: '',
        data: result.data.series,
        innerSize:
          result.options && result.options.innerSize
            ? result.options.innerSize
            : '0%'
      }
    ]
  };

  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }

  return chartOptions;
};

//drawDonutChart
drawDonutChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        click: result.options && result.options.clickfn
      },
      // margin bottom between legend and chart
      marginBottom: 40
      // margin for no space, legend overlaps on chart
      // margin: [0, 0, 0, 0]
    },
    // legend character set to 8
    legend: {
      itemWidth: 120
    },
    title: {
      text: result.options.chartTitle,
      align: 'center',
      verticalAlign: 'middle',
      y: 0
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      pointFormatter:
        result.options.tooltipFormatter ||
        function () {
          var value =
            Highcharts.numberFormat(this.y, 0, '.', ',') +
            ', ' +
            Highcharts.numberFormat(this.percentage, 1) +
            '%';
          if (result.options.yaxisLabelFormat == '$') {
            value = result.options.yaxisLabelFormat + value;
          }

          return value;
        }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
          distance: -50,
          style: {},
          formatter:
            result.options.labelFormatter ||
            function () {
              this.y = Math.round(this.y);
              var data = this.y;
              var suffixes = ['', 'K', 'M', 'B', 'T'];

              if (('' + this.y).length > 3) {
                var suffixNum = Math.floor(('' + this.y).length / 3);
                var shortValue = parseFloat(
                  (this.y / Math.pow(1000, suffixNum)).toFixed(2)
                );
                data = shortValue + suffixes[suffixNum];
              }

              var value =
                data + ', ' + Highcharts.numberFormat(this.percentage, 1) + '%';
              if (result.options.yaxisLabelFormat == '$') {
                value = result.options.yaxisLabelFormat + value;
              }

              return value;
            }
        },
        showInLegend: result.options.showLegend,
        startAngle: -135,
        endAngle: 135
      }
    },
    series: [
      {
        type: 'pie',
        name: '',
        innerSize: '70%',
        data: result.data.series
      }
    ]
  };

  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }

  return chartOptions;
};

//drawDonutChart
drawBulletChart = (result) => {
  var headerVal = '';
  if (result.data && result.data.series && result.data.series.length > 0) {
    headerVal = result.data.series[0].target;
    if (result.options.yaxisLabelFormat == '$') {
      headerVal =
        result.options.yaxisLabelFormat +
        Highcharts.numberFormat(headerVal, 0, '.', ',');
    } else if (result.options.yaxisLabelFormat == '%') {
      headerVal = headerVal + result.options.yaxisLabelFormat;
    }
  }

  var title =
    '<span style="font-size:16px">' + result.options.chartTitle + '</span>';
  var subTitle = '<span style="font-size:30px">' + headerVal + '</span>';
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      inverted: true,
      type: 'bullet',
      marginTop: 90,
      marginBottom: 40
    },
    // legend character set to 8
    legend: {
      enabled: false
    },
    title: {
      text: title,
      align: 'left'
    },
    customOptions: {
      id: result.options.identifier
    },
    subtitle: {
      text: subTitle,
      align: 'center',
      y: 55
    },
    tooltip: {
      pointFormatter: function () {
        var data = this.target;
        if (result.options.yaxisLabelFormat == '$') {
          data =
            result.options.yaxisLabelFormat +
            Highcharts.numberFormat(this.target, 0, '.', ',');
        } else if (result.options.yaxisLabelFormat == '%') {
          data =
            parseFloat(this.target).toFixed(2) +
            result.options.yaxisLabelFormat;
        }
        return data;
      }
    },
    xAxis: {
      categories: result.data.categories
    },
    yAxis: {
      max: result.options.maxValue,
      tickInterval: result.options.tickInterval,
      gridLineWidth: 0,
      plotBands: result.options.plots,
      title: null,
      labels: {
        formatter: function () {
          this.value = Math.round(this.value);
          var data = this.value;
          var suffixes = ['', 'K', 'M', 'B', 'T'];

          if (('' + this.value).length > 3) {
            var suffixNum = Math.floor(('' + this.value).length / 3);
            var shortValue = parseFloat(
              (this.value / Math.pow(1000, suffixNum)).toFixed(2)
            );
            data = shortValue + suffixes[suffixNum];
          }

          if (result.options.yaxisLabelFormat == '$') {
            data = result.options.yaxisLabelFormat + data;
          } else if (result.options.yaxisLabelFormat == '%') {
            data = this.value + result.options.yaxisLabelFormat;
          }
          return data;
        }
      }
    },

    plotOptions: {
      series: {
        pointPadding: 0.25,
        borderWidth: 0,
        color: 'black',
        targetOptions: {
          width: '200%'
        }
      }
    },
    series: [
      {
        data: result.data.series
      }
    ]
  };

  return chartOptions;
};

drawCombinationChart = (result) => {
  var chartOptions = {
    credits: {
      enabled: false
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
    },
    tooltip: {
      shared: result.options.isShared
      // pointFormatter: function () {
      //     var data = this.y;
      //     if (result.options.yaxisLabelFormat == '$') {
      //         data = result.options.yaxisLabelFormat + Highcharts.numberFormat(this.y, 0, '.', ',');
      //     } else if (result.options.yaxisLabelFormat == '%') {
      //         data = parseFloat(this.y).toFixed(2) + result.options.yaxisLabelFormat;
      //     }
      //     return data;
      // }
    },
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: result.options.yaxis,
    // [{
    //     min: result.options.yaxisMin,
    //     max: result.options.yaxisMax,
    //     tickInterval: result.options.yaxisInterval,
    //     title: {
    //         text: result.options.yaxisTitle
    //     },
    //     labels: {}
    // }],
    plotOptions: {
      series: {
        stacking: result.options.stack,
        pointWidth: result.options.yaxisBarWidth
      }
    },
    legend: {
      enabled: result.options.showLegend
    },
    series: result.data.series
  };
  if (result.options.colors && result.options.colors.length > 0) {
    chartOptions.colors = result.options.colors;
  }
  return chartOptions;
};

module.exports = {
  drawColumnChart,
  drawStackColumnChart,
  drawClusteredStackColumnChart,
  drawLineChart,
  drawPieChart,
  drawDonutChart,
  drawBulletChart,
  drawCombinationChart
};
