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

getStackedLabelFormatter = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
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
        data = '$' + data;
        return data;
      }
    };
  } else if (options.yaxisLabelFormat == '%') {
    result = {
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
        data = this.total + '%';
        return data;
      }
    };
  } else {
    result = {
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
        return data;
      }
    };
  }
  return result;
};

getLineLabelFormatter = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
      formatter: function () {
        var data = this.value;

        if (data >= 1000000000000) {
          data = (data / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
        } else if (data >= 1000000000) {
          data = (data / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        } else if (data >= 1000000) {
          data = (data / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (data >= 1000) {
          data = (data / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        data = '$' + data;
        return data;
      }
    };
  } else if (options.yaxisLabelFormat == '%') {
    result = {
      formatter: function () {
        var data = this.value;

        if (data >= 1000000000000) {
          data = (data / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
        } else if (data >= 1000000000) {
          data = (data / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        } else if (data >= 1000000) {
          data = (data / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (data >= 1000) {
          data = (data / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        data = this.value + '%';
        return data;
      }
    };
  } else {
    result = {
      formatter: function () {
        var data = this.value;

        if (data >= 1000000000000) {
          data = (data / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
        } else if (data >= 1000000000) {
          data = (data / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        } else if (data >= 1000000) {
          data = (data / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (data >= 1000) {
          data = (data / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return data;
      }
    };
  }
  return result;
};

getPieDonutLabelFormatter = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
      formatter: function () {
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
        value = '$' + value;
        return value;
      }
    };
  } else {
    result = {
      formatter: function () {
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
        return value;
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
  let formatterResult = getFormatter(result.options);
  let stackedFormatterResult = getStackedLabelFormatter(result.options);

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
    customOptions: {
      id: result.options.identifier
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
      },
      stackLabels: {
        enabled: true,
        formatter: stackedFormatterResult.formatter
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
  var formatterResult = getFormatter(result.options);
  let stackedFormatterResult = getStackedLabelFormatter(result.options);

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
    customOptions: {
      id: result.options.identifier
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
      },
      stackLabels: {
        enabled: true,
        formatter: stackedFormatterResult.formatter
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
  let formatterResult = getLineLabelFormatter(result.options);

  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'line'
    },
    title: {
      text: result.options.chartTitle
    },
    customOptions: {
      id: result.options.identifier
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
        pointWidth: result.options.yaxisBarWidth,
        cursor: 'pointer'
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
  let formatterResult = getPieDonutLabelFormatter(result.options);
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
    legend: { align: 'center' },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          formatter: formatterResult.formatter
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
  let formatterResult = getPieDonutLabelFormatter(result.options);
  var chartOptions = {
    credits: {
      enabled: false
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      marginBottom: 40
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
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
          distance: -50,
          formatter: formatterResult.formatter
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

//drawBulletChart
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

  let formatterResult = getFormatter(result.options);
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
        formatter: formatterResult.formatter
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
    xAxis: {
      categories: result.data.categories,
      title: {
        text: result.options.xaxisTitle
      }
    },
    yAxis: result.options.yaxis,
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