/* HISTOGRAMA PARA ANALISAR DADOS */

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let inc=0;
d3.csv("/data/ufo_sights.csv").then(function (data) {

    console.log(data);

    if(data[inc].state!=="" && data[inc].country!="" && data[inc].shape!="" && data[inc].duration!="" ){

    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([0, 60])     // can use this instead of 1000 to have the MAX of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    // x duração
    var histogram = d3.histogram()
        .value(function (d) { return d.duration; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(100)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    //y frequencia
    var y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return height - y(d.length); })
        .style("fill", "#69b3a2")


/*ARRAYS DAS FREQUÊNCIAS DAS FORMAS E DURAÇÕES*/
    let freq_duracao = [];
    let freq_formas = [];

    data.forEach(function (d) {
        if (freq_duracao[d.duration]) {
            freq_duracao[d.duration] += 1;
        }
        else {
            freq_duracao[d.duration] = 1;
        }
    });

    data.forEach(function (d) {
        if (freq_formas[d.shape]) {
            freq_formas[d.shape] += 1;
        }
        else {
            freq_formas[d.shape] = 1;
        }
    });

    if (freq_formas.keys())
    console.log(freq_formas);
    console.log(freq_duracao);


/*CÁLCULO QUARTIS (das durações dos avistamentos)*/
    let duracoes = [];
    for (var i = 0; i < data.length; i++) {

        duracoes.push(data[i].duration);
    }
    let p25 = d3.quantile(duracoes, 0.25);
    let p50 = d3.quantile(duracoes, 0.5);
    let p75 = d3.quantile(duracoes, 0.75);

    console.log(duracoes);
    console.log(p25);
    console.log(p50);
    console.log(p75);
}
inc +=1;

});



