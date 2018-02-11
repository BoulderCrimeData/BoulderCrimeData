/*
* Gen basic crime stats over the given period
*/

function refresh_charts(start_date, end_date){
    d3.csv("data/CrimeLocations.csv", function(data) {
        var filtered = data.filter(function (d) {
            var temp = new Date(d.REPORTDATE)
            if(temp > start_date && temp < end_date) {
                return d;
            }
            
        });
        create_radar_chart(filtered);
        summary_statistics(filtered);
        pie_chart(filtered);
    });
}



/*
* Function that generates a radar chart of 
*/
function create_radar_chart(data) {
        // Count how many crimes happened in each month
        var months = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0}
        total = 0;
        data.forEach(function(d) {  
            total += 1;
            var crime_date = new Date(d["REPORTDATE"]);
            months[crime_date.getMonth()] += 1;
        });
        // Formatting for the radar_chart script
        var time_data = [[
            {axis: "January", value: months[0]},
            {axis: "February", value: months[1]},
            {axis: "March", value: months[2]},
            {axis: "April", value: months[3]},
            {axis: "May", value: months[4]},
            {axis: "June", value: months[5]},
            {axis: "July", value: months[6]},
            {axis: "August", value: months[7]},
            {axis: "September", value: months[8]},
            {axis: "October", value: months[9]},
            {axis: "November", value: months[10]},
            {axis: "December", value: months[11]}
        ]];
    
        var color = d3.scale.ordinal().range(["#F8E94D"]);
                    
        var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

        // Get the month with the most amount of crime, to be used in the options
        var maxCrimeMonth = 0;
        time_data.forEach((entry) => {
            if (entry.value > maxCrimeMonth) {
                maxCrimeMonth = entry.value;
            }
        }); 
                    
        var radarChartOptions = {
            w: width,
            h: height,
            margin: margin,
            maxValue: maxCrimeMonth,
            levels: 5,
            roundStrokes: true,
            color: color
        };
        //Call function to draw the Radar chart
        RadarChart(".radarChart", time_data, radarChartOptions);
}

/*
* Function that generates summary stats
*/
function summary_statistics(data) {
    var total_crimes = 0;
    var total_thefts = 0;
    var total_minor_crimes = 0;
    var total_violent_crimes = 0;
    var crime_types = {}
    data.forEach((crime) => {
        var crime_type = crime.OFFENSE;
        if(crime_types[crime_type] == null){
            crime_types[crime_type] = 1;
        } else {
            crime_types[crime_type] += 1;
        }
    });

    // Hoping these are right
    var thefts = ["Auto Theft", "Burglary", "Motorcycle Theft", "Robbery", "Theft From Vehicle", "Theft Of Car Parts"];
    var minor_offenses = ["Incident", "Indecency", "Indecent Exposure", "Recovery", "Trespassing", "Vandalism"];
    var violent_crimes = ["Assault", "Homicide", "Sex Assault"];

    // Sum the new types
    Object.entries(crime_types).forEach((obj) => {
        total_crimes += obj[1];
        
        if (thefts.indexOf(obj[0]) > -1) {
            total_thefts += obj[1];
        } else if (minor_offenses.indexOf(obj[0]) > -1) {
            total_minor_crimes += obj[1];
        } else {
            total_violent_crimes += obj[1];
        }
    });
    
      
    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
    $('#total-crimes').animateNumber({
        number: total_crimes,
        color: 'green',
        'font-size': '55px',
        easing: 'easeInQuad',
        numberStep: comma_separator_number_step
      }, 5000);
    $('#thefts').animateNumber({
        number: total_thefts,
        color: 'green',
        'font-size': '55px',
        easing: 'easeInQuad',
        numberStep: comma_separator_number_step
    }, 5000);
    $('#minor-offenses').animateNumber({
        number: total_minor_crimes,
        color: 'green',
        'font-size': '55px',
        easing: 'easeInQuad',
        numberStep: comma_separator_number_step
    }, 5000);
    $('#violent-crimes').animateNumber({
        number: total_violent_crimes,
        color: 'green',
        'font-size': '55px',
        easing: 'easeInQuad',
        numberStep: comma_separator_number_step
    }, 5000);

}

function pie_chart(raw_data) {
    d3.select(".pieChart svg").remove();
    var margin = {top: 20, right: 20, bottom: 200, left: 70},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 10]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select(".pieChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")").attr("fill", "white");

    var crime_types = {}
    raw_data.forEach((crime) => {
        var crime_type = crime.OFFENSE;
        if(crime_types[crime_type] == null){
            crime_types[crime_type] = 1;
        } else {
            crime_types[crime_type] += 1;
        }
    });

    data = []
    for (var crime in crime_types){
        data.push({"name": crime, "value": crime_types[crime]})
    }


    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "rgba(258, 243, 87, 0.8)")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
}