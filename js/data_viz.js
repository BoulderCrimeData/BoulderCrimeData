/*
* Gen basic crime stats over the given period
*/

d3.csv("data/CrimeLocations.csv", function(data) {
    create_radar_chart(data);

});

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
    
        var color = d3.scale.ordinal()
                    .range(["#EDC951","#CC333F","#00A0B0"]);
                    
        var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
        var maxCrimeMonth = 0;
        time_data.forEach((entry) => {
            if (entry.value > maxCrimeMonth) {
                maxCrimeMonth = entry.value;
            }
        })
                    
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