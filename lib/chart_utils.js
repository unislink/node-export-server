const {
  drawColumnChart,
  drawStackColumnChart,
  drawClusteredStackColumnChart,
  drawLineChart,
  drawPieChart,
  drawDonutChart,
  drawBulletChart,
  drawCombinationChart
} = require('./generic_report_service.js');
var _ = require('lodash');

const computeChartOptions = (inputData) => {
  let chartOptions = processResponse(inputData);
  return chartOptions;
};

// const computeChartOptions1 = (inputData) => {
//   let chartOptions = {
//     xAxis: {
//         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     },
//     plotOptions: {
//         series: {
//             dataLabels: {
//                 enabled: true,
//                	formatter: function () {
//                   this.y = Math.round(this.y);
//                 	var result = this.y;
//                 	return '$'+result;
//             		}
//             },

//         }
//     },

//     series: [{
//         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
//     }]
// };
//   return chartOptions;
// };

const processResponse = (data) => {
  const { reportConfig, displayFilter, sessionVariables, items, footer } = data;
  let chartOptions;

  let contentArray = [];
  var labelVariables = displayFilter;
  for (var pdx in reportConfig.placeholderSources) {
    var placeholder = reportConfig.placeholderSources[pdx];
    var placeholderVariables = getSourceData(
      { items, footer },
      placeholder.pathExp
    );
    labelVariables = Object.assign(labelVariables, placeholderVariables);
  }

  // regex declaration
  let reg = /^((.?)*)Link\(((.?)*)\)((.?)*)$/;

  for (var ldx in reportConfig.labels) {
    var contentAry = [];
    var label = reportConfig.labels[ldx];
    var matchResult = label.content.match(reg);
    if (matchResult && matchResult.length > 0) {
      if (matchResult[1]) {
        contentAry.push({ type: 'text', content: matchResult[1] });
      }
      if (matchResult[3]) {
        contentAry.push({
          type: 'link',
          content: matchResult[3],
          route: label.link
        });
      }
      if (matchResult[5]) {
        contentAry.push({ type: 'text', content: matchResult[5] });
      }
    } else {
      contentAry.push({ type: 'text', content: label.content });
    }

    for (var adx in contentAry) {
      var contentObj = contentAry[adx];
      contentObj.contentDisplay = applyTemplate(
        contentObj.content,
        labelVariables,
        sessionVariables
      );
    }

    if (label.align == 'center') {
      reportConfig.reportOptions.chartTitle = contentAry[0].contentDisplay;
    } else if (label.align == 'top') {
      contentArray = contentAry;
    }
  }

  var result = prepareMetaData({
    items,
    reportConfig,
    displayFilter,
    sessionVariables
  });
  if (result) {
    if (result.options.chartType == 'column') {
      chartOptions = drawColumnChart(result);
    } else if (result.options.chartType == 'stackcolumn') {
      chartOptions = drawStackColumnChart(result);
    } else if (result.options.chartType == 'clusteredstackcolumn') {
      chartOptions = drawClusteredStackColumnChart(result);
    } else if (result.options.chartType == 'line') {
      chartOptions = drawLineChart(result);
    } else if (result.options.chartType == 'pie') {
      chartOptions = drawPieChart(result);
    } else if (result.options.chartType == 'donut') {
      chartOptions = drawDonutChart(result);
    } else if (result.options.chartType == 'bullet') {
      chartOptions = drawBulletChart(result);
    } else if (result.options.chartType == 'combinationchart') {
      chartOptions = drawCombinationChart(result);
    }
  }
  return chartOptions;
};

const getSourceData = (res, pathExp) => {
  if (pathExp == 'footer') {
    if (res.footer) {
      var result = {};
      for (var originalKey in res.footer) {
        var key = originalKey.toLowerCase().replace(/\s/g, '');
        result[key] = res.footer[originalKey];
      }
      return result;
    }
  }
  if (pathExp.startsWith('Percent')) {
    var percentVariables = {};
    // finding label and value from placeholder path
    var reg = /\((.*?)\)/;
    var nameKeys = pathExp.match(reg);
    var keys = nameKeys[1].split(',');
    var labelKey = keys[0];
    var valueKey = keys[1];
    var originalValue = _.sumBy(res.items, function (x) {
      return x[valueKey];
    });

    var newValue = 0;
    for (var idx in res.items) {
      var item = res.items[idx];
      newValue = item[valueKey];
      if (item[labelKey]) {
        var label = item[labelKey].toString().toLowerCase().replace(/\s/g, '');
        percentVariables['Percent_' + label] = Math.round(
          (newValue / originalValue) * 100
        );
      }
    }

    return percentVariables;
  }
};

const applyTemplate = (template, variables = null, sessionVars = null) => {
  // let sessionVars = this.session.getSessionVariables();

  variables = variables || {};
  let data = Object.assign({}, sessionVars, variables);

  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // replace {{}} in template by using custom delimiter {{ }}
  let compiled = _.template(template); // interpolate
  let result = compiled(data);
  return result;
};

prepareMetaData = (inputData) => {
  let { items, reportConfig, displayFilter, sessionVariables } = inputData;
  var data = {
    categories: [],
    series: []
  };

  //apply report variables in chart title
  let chartTitle = applyTemplate(
    reportConfig.reportOptions.chartTitle,
    displayFilter,
    sessionVariables
  );
  //this.title = chartTitle;

  var reportData = {
    options: {
      chartType: reportConfig.reportOptions.chartType,
      chartTitle: chartTitle,
      identifier: reportConfig.identifier,
      colors: reportConfig.reportOptions.colors,
      xaxisTitle: reportConfig.reportOptions.xaxisTitle,
      yaxisMin: reportConfig.reportOptions.yaxisMin || 0,
      yaxisTitle: reportConfig.reportOptions.yaxisTitle,
      yaxisBarWidth: reportConfig.reportOptions.yaxisBarWidth,
      showLegend: reportConfig.reportOptions.showLegend,
      yaxisLabelFormat: reportConfig.reportOptions.yaxisLabelFormat,
      innerSize: reportConfig.reportOptions.innerSize,
      clickfn: '',
      maxValue: reportConfig.reportOptions.maxValue,
      tickInterval: reportConfig.reportOptions.tickInterval,
      plots: reportConfig.reportOptions.plots,
      isShared: reportConfig.reportOptions.isShared,
      stack: reportConfig.reportOptions.stack,
      yaxis: reportConfig.reportOptions.yaxis
    },
    data: data
  };

  if (reportConfig.reportOptions.yaxisMax) {
    reportData.options.yaxisMax = reportConfig.reportOptions.yaxisMax;
  }

  var xaxisKeys = reportConfig.reportOptions.xaxisKeys;
  var yaxisKeys = reportConfig.reportOptions.yaxisKeys;
  var legendKeys = reportConfig.reportOptions.legendKeys;
  var series = reportConfig.reportOptions.series;
  var stackKey = reportConfig.reportOptions.stackKey;

  if (reportConfig.reportOptions.chartType == 'column') {
    var nameRegEx = /Name\((.*?)\)/;
    var tempMap = {};
    var chartMap = {};

    //xaxis
    for (var idx in items) {
      var row = items[idx];
      xaxisKeys.forEach((xk) => {
        var nameKeys = xk.match(nameRegEx);
        var category =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[xk];
        let colIndex = data.categories.indexOf(category);
        if (colIndex == -1) {
          data.categories.push(category);
          colIndex = data.categories.indexOf(category);
        }
        if (xaxisKeys.length == 1) {
          row.colIndex = colIndex;
        } else {
          row['col-idx-' + category] = row['col-idx-' + category] || {};
          row['col-idx-' + category].colIndex = colIndex;
        }
      });
    }
    //legends
    var singleSeries = legendKeys.length == 1 ? legendKeys[0] : [];
    var multipleSeries = legendKeys.length > 1 ? legendKeys : [];
    for (var idx in items) {
      var row = items[idx];
      singleSeries.forEach((lk) => {
        if (!tempMap[row[lk]]) {
          var nameKeys = lk.match(nameRegEx);
          var name =
            nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk];
          let dataAry = new Array(data.categories.length);
          dataAry.fill(0);
          tempMap[row[lk]] = {
            name: name,
            data: dataAry
          };
          data.series.push(tempMap[row[lk]]);
        }
      });

      multipleSeries.forEach((lks) => {
        var displayName = '';
        if (Array.isArray(lks)) {
          lks.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          if (!chartMap[displayName]) {
            chartMap[displayName] = {
              name: displayName,
              data: []
            };
            data.series.push(chartMap[displayName]);
          }
        }
      });
    }
    //yaxis
    for (var idx in items) {
      var row = items[idx];
      singleSeries.forEach((lk) => {
        var item = tempMap[row[lk]];
        yaxisKeys.forEach((yk) => {
          // need to revisit
          if (xaxisKeys.length == 1) {
            item.data[row.colIndex] = row[yk];
          } else {
            data.categories.forEach((xk) => {
              if (xk === yk) {
                item.data[row['col-idx-' + xk].colIndex] = row[yk];
              }
            });
          }
        });
      });

      if (multipleSeries.length > 0) {
        for (var ydx in yaxisKeys) {
          var yk = yaxisKeys[ydx];

          // get lengends
          var lka = multipleSeries[ydx];
          var displayName = '';
          lka.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          var item = chartMap[displayName];
          item.data.push(row[yk]);
        }
      }
    }

    let dataLabels = getDataLabels(reportData.options);
    for (let sdx in data.series) {
      var ser = data.series[sdx];
      //ser.custom = reportData.options;
      ser.dataLabels = dataLabels;
    }
  }
  if (reportConfig.reportOptions.chartType == 'stackcolumn') {
    var nameRegEx = /Name\((.*?)\)/;
    var tempMap = {};
    var chartMap = {};

    //xaxis
    for (let idx in items) {
      let row = items[idx];
      xaxisKeys.forEach((xk) => {
        let nameKeys = xk.match(nameRegEx);
        let category =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[xk];
        let colIndex = data.categories.indexOf(category);
        if (colIndex == -1) {
          data.categories.push(category);
          colIndex = data.categories.indexOf(category);
        }
        if (xaxisKeys.length == 1) {
          row.colIndex = colIndex;
        } else {
          row['col-idx-' + category] = row['col-idx-' + category] || {};
          row['col-idx-' + category].colIndex = colIndex;
        }
      });
    }
    //legends
    var singleSeries = legendKeys.length == 1 ? legendKeys[0] : [];
    var multipleSeries = legendKeys.length > 1 ? legendKeys : [];
    for (let idx in items) {
      let row = items[idx];
      singleSeries.forEach((lk) => {
        if (!tempMap[row[lk]]) {
          let nameKeys = lk.match(nameRegEx);
          let name =
            nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk];
          let dataAry = new Array(data.categories.length);
          dataAry.fill(0);
          tempMap[row[lk]] = {
            name: name,
            data: dataAry
          };
          data.series.push(tempMap[row[lk]]);
        }
      });

      multipleSeries.forEach((lks) => {
        var displayName = '';
        if (Array.isArray(lks)) {
          lks.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          if (!chartMap[displayName]) {
            chartMap[displayName] = {
              name: displayName,
              data: []
            };
            data.series.push(chartMap[displayName]);
          }
        }
      });
    }
    //yaxis
    for (let idx in items) {
      let row = items[idx];
      singleSeries.forEach((lk) => {
        var item = tempMap[row[lk]];
        yaxisKeys.forEach((yk) => {
          // need to revisit
          if (xaxisKeys.length == 1) {
            item.data[row.colIndex] = row[yk];
          } else {
            data.categories.forEach((xk) => {
              if (xk === yk) {
                item.data[row['col-idx-' + xk].colIndex] = row[yk];
              }
            });
          }
        });
      });

      if (multipleSeries.length > 0) {
        for (var ydx in yaxisKeys) {
          var yk = yaxisKeys[ydx];

          // get lengends
          var lka = multipleSeries[ydx];
          var displayName = '';
          lka.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          var item = chartMap[displayName];
          item.data.push(row[yk]);
        }
      }
    }

    let dataLabels = getDataLabels(reportData.options);
    for (let sdx in data.series) {
      var ser = data.series[sdx];
      ser.dataLabels = dataLabels;
    }
  }
  if (reportConfig.reportOptions.chartType == 'clusteredstackcolumn') {
    var nameRegEx = /Name\((.*?)\)/;
    var tempMap = {};
    var chartMap = {};

    //xaxis
    for (let idx in items) {
      let row = items[idx];
      xaxisKeys.forEach((xk) => {
        let nameKeys = xk.match(nameRegEx);
        let category =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[xk];
        let colIndex = data.categories.indexOf(category);
        if (colIndex == -1) {
          data.categories.push(category);
          colIndex = data.categories.indexOf(category);
        }
        if (xaxisKeys.length == 1) {
          row.colIndex = colIndex;
        } else {
          row['col-idx-' + category] = row['col-idx-' + category] || {};
          row['col-idx-' + category].colIndex = colIndex;
        }
      });
    }
    //legends
    var singleSeries = legendKeys.length == 1 ? legendKeys[0] : [];
    var multipleSeries = legendKeys.length > 1 ? legendKeys : [];
    for (let idx in items) {
      let row = items[idx];
      singleSeries.forEach((lk) => {
        if (!tempMap[row[lk]]) {
          let nameKeys = lk.match(nameRegEx);
          let name =
            nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk];
          let dataAry = new Array(data.categories.length);
          dataAry.fill(0);
          tempMap[row[lk]] = {
            name: name,
            data: dataAry,
            stack: row[stackKey]
          };
          data.series.push(tempMap[row[lk]]);
        }
      });

      multipleSeries.forEach((lks) => {
        var displayName = '';
        if (Array.isArray(lks)) {
          lks.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          if (!chartMap[displayName]) {
            chartMap[displayName] = {
              name: displayName,
              data: [],
              stack: row[stackKey]
            };
            data.series.push(chartMap[displayName]);
          }
        }
      });
    }
    //yaxis
    for (let idx in items) {
      let row = items[idx];
      singleSeries.forEach((lk) => {
        var item = tempMap[row[lk]];
        yaxisKeys.forEach((yk) => {
          // need to revisit
          if (xaxisKeys.length == 1) {
            item.data[row.colIndex] = row[yk];
          } else {
            data.categories.forEach((xk) => {
              if (xk === yk) {
                item.data[row['col-idx-' + xk].colIndex] = row[yk];
              }
            });
          }
        });
      });

      if (multipleSeries.length > 0) {
        for (var ydx in yaxisKeys) {
          var yk = yaxisKeys[ydx];

          // get lengends
          var lka = multipleSeries[ydx];
          var displayName = '';
          lka.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          var item = chartMap[displayName];
          item.data.push(row[yk]);
        }
      }
    }

    let dataLabels = getDataLabels(reportData.options);
    for (let sdx in data.series) {
      var ser = data.series[sdx];
      ser.dataLabels = dataLabels;
    }
  }
  if (reportConfig.reportOptions.chartType == 'combinationchart') {
    var nameRegEx = /Name\((.*?)\)/;
    var tempMap = {};

    //xaxis
    for (var idx in items) {
      var row = items[idx];
      xaxisKeys.forEach((xk) => {
        var nameKeys = xk.match(nameRegEx);
        var category =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[xk];
        let colIndex = data.categories.indexOf(category);
        if (colIndex == -1) {
          data.categories.push(category);
          colIndex = data.categories.indexOf(category);
        }
        // if (xaxisKeys.length == 1) {
        //     row.colIndex = colIndex;
        // }
        // else {
        row['col-idx-' + category] = row['col-idx-' + category] || {};
        row['col-idx-' + category].colIndex = colIndex;
        // }
      });
    }
    //legends
    for (var idx in items) {
      var row = items[idx];
      series.forEach((lk) => {
        var nameKeys = lk.name.match(nameRegEx);
        var name =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk.name];

        if (!tempMap[name]) {
          var dataLabels = getCombinationChartDataLabels2(
            lk.tooltipLabelFormat
          );
          let dataAry = new Array(data.categories.length);
          dataAry.fill(0);
          tempMap[name] = {
            name: name,
            data: dataAry,
            type: lk.type,
            yAxis: lk.yAxis,
            dataLabels: dataLabels
          };
          data.series.push(tempMap[name]);
        }
      });
    }
    //yaxis
    for (var idx in items) {
      var row = items[idx];
      series.forEach((lk) => {
        var nameKeys = lk.name.match(nameRegEx);
        var name =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk.name];
        var item = tempMap[name];
        yaxisKeys.forEach((yk) => {
          // need to revisit
          if (xaxisKeys.length == 1 && yk == name) {
            //item.data[row.colIndex] = row[yk];
            data.categories.forEach((xk) => {
              if (xk === row[xaxisKeys[0]]) {
                item.data[row['col-idx-' + xk].colIndex] = row[yk];
              }
            });
          }
          // else {
          //     data.categories.forEach(xk => {
          //         if (xk === yk) {
          //             item.data[row["col-idx-" + xk].colIndex] = row[yk];
          //         }
          //     });
          // }
        });
      });
    }

    for (let ydx in reportConfig.reportOptions.yaxis) {
      var yaxis = reportConfig.reportOptions.yaxis[ydx];
      yaxis.labels = getyAxisDataLabels(yaxis);
    }
    console.log(data);
  } else if (reportConfig.reportOptions.chartType == 'line') {
    var chartMap = {};
    var nameRegEx = /Name\((.*?)\)/;
    var tempMap = {};

    //xaxis
    for (var idx in items) {
      var row = items[idx];
      xaxisKeys.forEach((xk) => {
        var nameKeys = xk.match(nameRegEx);
        var category =
          nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[xk];
        if (data.categories.indexOf(category) == -1) {
          data.categories.push(category);
        }
      });
    }
    //legends
    for (var idx in items) {
      var row = items[idx];
      legendKeys.forEach((lks) => {
        var displayName = '';
        if (Array.isArray(lks)) {
          lks.forEach((lk) => {
            var nameKeys = lk.match(nameRegEx);
            displayName +=
              ' ' +
              (nameKeys != null && nameKeys.length == 2
                ? nameKeys[1]
                : row[lk]);
          });

          if (!chartMap[displayName]) {
            chartMap[displayName] = {
              name: displayName,
              data: []
            };
            data.series.push(chartMap[displayName]);
          }
        }
      });
    }

    // yaxis
    for (var idx in items) {
      var row = items[idx];
      for (var ydx in yaxisKeys) {
        var yk = yaxisKeys[ydx];

        // get lengends
        var lka = legendKeys[ydx];
        var displayName = '';
        lka.forEach((lk) => {
          var nameKeys = lk.match(nameRegEx);
          displayName +=
            ' ' +
            (nameKeys != null && nameKeys.length == 2 ? nameKeys[1] : row[lk]);
        });

        var item = chartMap[displayName];
        item.data.push(row[yk]);
      }
    }
  } else if (
    reportConfig.reportOptions.chartType == 'pie' ||
    reportConfig.reportOptions.chartType == 'donut'
  ) {
    var tempMap = {};
    var legendKey = legendKeys;
    var yaxisKey = yaxisKeys;

    // lengends
    for (var idx in items) {
      var row = items[idx];
      if (!tempMap[row[legendKey]]) {
        tempMap[row[legendKey]] = {
          name: row[legendKey],
          y: null
        };
        data.series.push(tempMap[row[legendKey]]);
      }
    }

    // yaxis
    for (var idx in items) {
      var row = items[idx];
      var item = tempMap[row[legendKey]];
      item.y = row[yaxisKey];
    }

    if (reportConfig.reportOptions.maxValue && data.series.length == 1) {
      let otherSeries = Object.assign({}, data.series[0]);
      otherSeries.name = 'Others';
      otherSeries.y = reportConfig.reportOptions.maxValue - otherSeries.y;
      data.series.push(otherSeries);
    }
  } else if (reportConfig.reportOptions.chartType == 'bullet') {
    data.categories = xaxisKeys;

    var bulletSeries = [];
    for (var idx in items) {
      var row = items[idx];
      yaxisKeys.forEach((xk) => {
        var item = {
          y: xk['y'],
          target: row[xk['targetKey']]
        };
        bulletSeries.push(item);
      });
    }
    data.series = bulletSeries;
  }

  return reportData;
};

getDataLabels = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return '$' + result;
      }
    };
  } else if (options.yaxisLabelFormat == '%') {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return result + '%';
      }
    };
  } else {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return result;
      }
    };
  }
  console.log('getDataLabels formatter=', result);
  return result;
};

getyAxisDataLabels = (options) => {
  let result;
  if (options.yaxisLabelFormat == '$') {
    result = {
      enabled: true,
      formatter: function () {
        var result = this.value;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.value).length > 3) {
          var suffixNum = Math.floor(('' + this.value).length / 3);
          var shortValue = parseFloat(
            (this.value / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        result = '$' + result;
        return result;
      }
    };
  } else if (options.yaxisLabelFormat == '%') {
    result = {
      enabled: true,
      formatter: function () {
        var result = this.value;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.value).length > 3) {
          var suffixNum = Math.floor(('' + this.value).length / 3);
          var shortValue = parseFloat(
            (this.value / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        result = this.value + '%';
        return result;
      }
    };
  } else {
    result = {
      enabled: true,
      formatter: function () {
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
  let response = result;
  return response;
};

// combinationchart data labels starts
getCombinationChartDataLabels2 = (format) => {
  console.log('getCombinationChartDataLabels2 : format=', format);
  let result;
  if (format == '$') {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        result = '$' + result;
        return result;
      }
    };
  } else if (format == '%') {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        result = this.y + '%';
        return result;
      }
    };
  } else {
    result = {
      enabled: true,
      formatter: function () {
        this.y = Math.round(this.y);
        var result = this.y;
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        if (('' + this.y).length > 3) {
          var suffixNum = Math.floor(('' + this.y).length / 3);
          var shortValue = parseFloat(
            (this.y / Math.pow(1000, suffixNum)).toFixed(2)
          );
          result = shortValue + suffixes[suffixNum];
        }
        return result;
      }
    };
  }
  let response = result;
  return response;
};
// combinationchart data labels end

module.exports = {
  computeChartOptions
};
