/*
google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  // var truncationLength = 40;
  // var truncatedSessionTitle = session.title.substr(0, truncationLength - 1) + (session.title.length > truncationLength ? '…' : '');


  var $accordion = $('#accordion');
  var $chartDiv = $('#chart-div');
  if (searchParams.has("uuid")) {
    var uuid = searchParams.get("uuid");
    var statURL = 'https://vdf2016r.firebaseapp.com/uuid-' + uuid + '.jsonp';
    $.getJSON(statURL, function(stat) {
      var chartData = [
        [
          "Category",
          "Your Session's Median",
          "Conference Median Avergae",
          "Your Session's Average",
          "Conference Avergae"
        ]
      ];
      var rating = stat.rating;

      aggregateData.categoryNames.forEach(function(categoryName) {
        var categoryRating = rating[categoryName];
        if (categoryRating.values > 0) {
          chartData.push([
            categoryName,
            categoryRating.median,
            aggregateData[categoryName].median,
            categoryRating.avg,
            aggregateData[categoryName].avg
          ]);

          $accordion.append(
            '<div class="panel panel-default">' +
            '  <div class="panel-heading" role="tab" id="' + categoryName + 'Heading">' +
            '    <h4 class="panel-title">' +
            '      <a role="button" class="accordion-header" data-toggle="collapse" data-parent="#accordion" href="#collapse' + categoryName + '" aria-expanded="true" aria-controls="collapse' + categoryName + '">' +
            '        ' + categoryName + ' rating distribution' +
            '      </a>' +
            '    </h4>' +
            '  </div>' +
            '  <div id="collapse' + categoryName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + categoryName + 'Heading">' +
            '    <div class="panel-body">' +
            '      <div id="' + categoryName + 'Div" class="chart-div">' +
            '        <p>No data</p>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
          )

          // var distribData = [
          //   [
          //     'Rating',
          //     'Session',
          //     'Conference (normalized)'
          //   ]
          // ];
          var distribData = new google.visualization.DataTable();
          distribData.addColumn('string', 'Rating');
          distribData.addColumn('number', 'Your Session');
          distribData.addColumn('number', 'Conference (normalized)');
          var numRates = aggregateData.ratingTitles.length;
          sumAggrDistrib = aggregateData[categoryName].distribution.reduce(function(a, b) {return a + b});
          sumDistrib = categoryRating.distribution.reduce(function(a, b) {return a + b});
          for (var i = 0; i < numRates; i++) {
            // distribData.push([
            //   aggregateData.ratingTitles[i],
            //   categoryRating.distribution[i],
            //   aggregateData[categoryName].distribution[i] * sumDistrib / sumAggrDistrib
            // ]);
            distribData.addRow([
              aggregateData.ratingTitles[i],
              categoryRating.distribution[i],
              aggregateData[categoryName].distribution[i] * sumDistrib / sumAggrDistrib
            ]);
          }
          // var dData = google.visualization.arrayToDataTable(distribData);
          // var $chartDiv = $('#' + categoryName + 'Div');
          var options = {
            width: $chartDiv.width(),
            height: $chartDiv.height(),
            title: stat.title + ' \u2014 ' + categoryName + ' rating distribution',
            subtitle: '',
            curveType: 'function',
            pointSize: 7,
            hAxis: { slantedText: true }
          }
          var dChart = new google.visualization.LineChart(document.getElementById(categoryName + 'Div'));
          dChart.draw(distribData, options);
        } else {
          chartData.push([categoryName, null, null, null, null]);
        }
      });
      if (stat.comments.length > 0) {
        var commentsHtml = '<ul>';
        stat.comments.forEach(function (comment) {
          commentsHtml += '<li>' + comment + '</li>';
        });
        commentsHtml += '</ul>';
        $('#commentBody').html(commentsHtml);
      }
      var data = google.visualization.arrayToDataTable(chartData);
      var options = {
        width: $chartDiv.width(),
        height: $chartDiv.height(),
        chart: {
          title: stat.title,
          subtitle: ''
        }
      }
      var chart = new google.charts.Bar(document.getElementById('chart-div'));
      chart.draw(data, options);
    }).fail(function() {
      $chartDiv.html("Couldn't download stat. Wrong GUID?");
    });
  } else {
    $chartDiv.html('Need UUID URL parameter');
  }
}
*/
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
