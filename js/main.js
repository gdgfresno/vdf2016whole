google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var truncationLength = 40;
  aggregateData.categoryNames.forEach(function(categoryName) {
    var dtAvg = new google.visualization.DataTable();
    var dtMedian = new google.visualization.DataTable();
    dtAvg.addColumn('string', 'Session');
    dtAvg.addColumn('number', 'Avg');
    dtAvg.addColumn('number', 'Conference Avg');
    whole.sort(function(a, b){return b[categoryName].avg - a[categoryName].avg}).forEach(function(sessionEntry) {
      var truncatedSessionTitle = sessionEntry.name.substr(0, truncationLength - 1) + (sessionEntry.name.length > truncationLength ? '…' : '') + ' (' + sessionEntry[categoryName].sampleSize + ')';
      dtAvg.addRows([[
        truncatedSessionTitle,
        sessionEntry[categoryName].avg,
        aggregateData[categoryName].avg,
      ]]);
    });
    dtMedian.addColumn('string', 'Session');
    dtMedian.addColumn('number', 'Median');
    dtMedian.addColumn('number', 'Conference Median');
    whole.sort(function(a, b){return b[categoryName].median - a[categoryName].median}).forEach(function(sessionEntry) {
      var truncatedSessionTitle = sessionEntry.name.substr(0, truncationLength - 1) + (sessionEntry.name.length > truncationLength ? '…' : '') + ' (' + sessionEntry[categoryName].sampleSize + ')';
      dtMedian.addRows([[
        truncatedSessionTitle,
        sessionEntry[categoryName].median,
        aggregateData[categoryName].median
      ]]);
    });

    var $accordion = $('#accordion');

    $accordion.append(
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" role="tab" id="' + categoryName + 'AvgHeading">' +
      '    <h4 class="panel-title">' +
      '      <a role="button" class="accordion-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + categoryName + 'Avg" aria-expanded="true" aria-controls="collapse' + categoryName + 'Avg">' +
      '        ' + categoryName + ' averages' +
      '      </a>' +
      '    </h4>' +
      '  </div>' +
      '  <div id="collapse' + categoryName + 'Avg" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + categoryName + 'AvgHeading">' +
      '    <div class="panel-body">' +
      '      <div id="' + categoryName + 'AvgDiv" class="chart-div">' +
      '        <p>No data</p>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" role="tab" id="' + categoryName + 'MedianHeading">' +
      '    <h4 class="panel-title">' +
      '      <a role="button" class="accordion-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + categoryName + 'Median" aria-expanded="true" aria-controls="collapse' + categoryName + 'Median">' +
      '        ' + categoryName + ' medians' +
      '      </a>' +
      '    </h4>' +
      '  </div>' +
      '  <div id="collapse' + categoryName + 'Median" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + categoryName + 'MedianHeading">' +
      '    <div class="panel-body">' +
      '      <div id="' + categoryName + 'MedianDiv" class="chart-div">' +
      '        <p>No data</p>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    )

    var $chartAvgDiv = $('#' + categoryName + 'AvgDiv');
    var series = {};
    series[1] = {type: 'line'};
    var options = {
      width: 1100,  // $chartAvgDiv.width(),
      height: $chartAvgDiv.height(),
      title: categoryName,
      subtitle: '',
      seriesType: 'bars',
      series: series,
      hAxis: { slantedText: true },
      theme: 'material'
    }

    var dAvgChart = new google.visualization.ComboChart(document.getElementById(categoryName + 'AvgDiv'));
    dAvgChart.draw(dtAvg, options);
    var dMedianChart = new google.visualization.ComboChart(document.getElementById(categoryName + 'MedianDiv'));
    dMedianChart.draw(dtMedian, options);
  });
}

(function (document, $) {
  var tableData = [];
  whole.forEach(function(sessionEntry) {
    var dataEntry = [sessionEntry.name];
    aggregateData.categoryNames.forEach(function(cat) {
      dataEntry.push(sessionEntry[cat].avg);
      dataEntry.push(sessionEntry[cat].median);
      dataEntry.push(sessionEntry[cat].sampleSize);
    });
    tableData.push(dataEntry);
  });

  document.datatable = $("#results-table").DataTable({
    data: tableData,
    columnDefs: [
      {
        render: function (data, type, row) {
          return (data ? data.toFixed(2) : data);
        },
        targets: [1, 2, 4, 5, 7, 8]
      }
    ]
  });
}) (document, $);
