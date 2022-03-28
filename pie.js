var eixoRadial = d3.scaleLog().domain([]).range([10, 500]);

d3.csv("/data/ufo_sights.csv").then(function (ufos) {

    svg.selectAll("path")
        .data(ufos)
        .enter()
        .append("path")
        .attr("d", function (data) {
            arcGenerator({
                startAngle: function (data) {
                    return
                },
                endAngle: 0.25 * Math.PI,
                innerRadius:

    })


        })
})
