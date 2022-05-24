/*** INFORMAÇÃO DIVIDIDA POR ESTADO ***/

d3.csv("/data/ufo_sights.csv").then(function (data) {

    /** * Array auxiliar apenas com as formas **/
    var shapes_rep = []
    for (var i = 0; i < data.length; i++) {
        if (data[i].shape != '') {
            shapes_rep.push(data[i].shape);
        }
    }
    let arr_shapes = [];
    shapes_rep.forEach((c) => {
        if (!arr_shapes.includes(c)) {
            arr_shapes.push(c);
        }
    });

    /*** CSV todo, só que dividido por estados; ***/

    ufo_data = data.reduce(function (ufo, d) {
        ufo[d.state] = ufo[d.state] || [];
        ufo[d.state].push(d);
        return ufo;
    }, Object.create(null));
    //console.log(ufo_data);

    /*** FREQUÊNCIA DE AVISTAMENTOS POR ESTADO POR FORMA ***/
    let freq_formas = [];

    /*** TEMPOS E COMENTÁRIOS POR ESTADO POR FORMA ***/
    let tempos = [];

    /**** ARRAY Q TEM INFO QUE VAI PARA D3 *****/
    let new_ufo_data = [];
    let tempos_aux = [];
    let tempos_max = [];
    let interv_tempo_aux = [];


    /**** DENTRO DO UFO DATA *****/

    Object.entries(ufo_data).forEach(([state, avist]) => {

        freq_formas[state] = [];
        tempos[state] = [];
        interv_tempo_aux[state] = [];

        Object.entries(freq_formas).forEach(([state2, value2]) => {

            if (state == state2) {
                //array q tem as formas todas de cada estado

                for (i = 0; i < avist.length; i++) {
                    if (value2[avist[i].shape]) {
                        value2[avist[i].shape] = value2[avist[i].shape] + 1
                    }
                    else {
                        value2[avist[i].shape] = 1;
                    }
                }
            }
        });

        //TEMPOS E COMENTÁRIOS
        var interv1, interv2, interv3, interv4;
        for (var i = 0; i < arr_shapes.length; i++) {

            Object.entries(new_ufo_data).forEach(([estado, avist]) => {
                for (var i = 0; i < avist["frequencia"]; i++) {

                    if (avist["tempos"][i] >= 1 && avist["tempos"][i] < 30) {
                        interv1 += 1;
                    }
                    else if (avist["tempos"][i] >= 30 && avist["tempos"][i] < 180) {
                        interv2 += 1;
                    }
                    else if (avist["tempos"][i] >= 180 && avist["tempos"][i] < 600) {
                        interv3 += 1;
                    }
                    else if (avist["tempos"][i] >= 600) {
                        interv4 += 1;
                    }
                }
            });


            /***calculo auxiliar intervalos tempos por estado por forma** */
            interv_tempo_aux[state].push({
                forma: arr_shapes[i],
                '1a30': interv1,
                '30a180': interv2,
                '180a600': interv3,
                '+600': interv4
            });

            tempos[state].push({
                forma: arr_shapes[i],
                tempos: [],
                comentarios: []
            });
        }

        for (var i = 0; i < arr_shapes.length; i++) {
            for (j = 0; j < avist.length; j++) {
                if (avist[j].shape == tempos[state][i]["forma"]) {
                    tempos[state][i]["tempos"].push(avist[j].duration);
                    tempos[state][i]["comentarios"].push(avist[j].comments);
                }
            }
        }
        tempos_aux[state] = [];
        tempos_max[state] = [];

        /****  INFO QUE VAI PARA D3 *****/

        new_ufo_data[state] = [];
        for (var i = 0; i < arr_shapes.length; i++) {
            new_ufo_data[state].push({
                forma: arr_shapes[i],
                frequencia: freq_formas[state][arr_shapes[i]],
                tempos: tempos[state][i]["tempos"],
                comment: tempos[state][i]["comentarios"]
            });
            tempos_aux[state].push(freq_formas[state][arr_shapes[i]]);
        }

        /***calculo auxiliar tempo maximo por estado** */
        let max;
        Object.entries(tempos_aux).forEach(([estado, tempos]) => {
            max = d3.max(tempos);
            Object.entries(tempos_max).forEach(([estado2, max2]) => {
                tempos_max[state] = max;
            })
        });

        

        /******* DESENHO DO GRÁFICO - Evgheni  *******/

        var width = 600;
        var height = 600;
        var radius = 300;
        var thickness = 15;

        //aqui estamos só a fazer com um estado
        var pieData = new_ufo_data["ab"]

        var pie = d3.pie()
            .value(function (d) {
                return d.frequencia;
            })


        var arc = d3.arc()
            .innerRadius(30)
            .outerRadius(radius)
            .padAngle(2)
            .padRadius(2);

        //let cor= xxx
        //função que define forma como cor é dada?


        let band = d3.scaleBand();

        var chart = d3.select('#chart').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width - radius) + ',' + (height - radius) + ')')
            .selectAll('path')
            .data(pie(pieData, (d) => {
                return {
                    pie: pie(d),
                    dados: d
                }

            }))
            .enter()
            .append('g') //para cada setor um g, para cada abs
            .attr('class', 'slice');



        var slices = chart.selectAll('g.slice') //substituição de d3 por chart porque assim vai buscar dados ao data joint e não antes de fazer join, iu seja, html, sem dados agarrados
            .data((sector) => {
                //console.log("sector:",sector);

                //exemplo do prof do q devia dar [{q: 1000, dur: 10}, { q: 1000, dur: 60}, 1000, 1000, 10]
                //var avistamentos = avistamentos(sector.dados);
                //FALTA FUNÇÃO DE AVISTAMENTOS
                //esta que pus a seguir foi introduzida na aula:
                var avistamentos = sector.data.tempos; //organizado por ordem das formas i.e por setor
                //var formass = sector.data.forma;
                //console.log("avist:", avistamentos);
                //console.log("formass:", formass);

                band.domain(avistamentos)
                    .range([10, 300])
                //.range(rangeAvistamentos(avistamentos.length)) // 10 => {20 }
                return {
                    inner: band(sector.avistamentos),
                    outer: band(sector.data) + band.bandwidth(),
                    //cor: cor(avistamentos), //depois impor regra para cor
                    angInf: sector.startAngle,
                    angSup: sector.endAngle,
                    dados: sector.dados
                }


            })

            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('fill', '#0FF285');

        let arco = slices.selectAll('g.arc') //aqui vamos buscar o joint anterior que criou mais dados importantes para aqui
            .data(function (dados) {
                //ESTE CONSOLE LOG NÃO CORRE
                //console.log("dados:",dados);
                return dados;
            })
            .enter()
            .append('path')

            .attr('d', (barra) => {

                //ESTE CONSOLE LOG NÃO CORRE
                //console.log("barra:", barra);
                arc.
                    innerRadius(barra.inner)
                    .outerRadius(barra.outer)
                    .startAngle(barra.startAngle)
                    .endAngle(barra.endAngle)
            })
            .attr('fill', '#F5F5F5');

        /******* DESENHO DO GRÁFICO - Evgheni  *******/
        var width = 600;
        var height = 600;
        var radius = 300;
        var thickness = 15;

        //aqui estamos só a fazer com um estado
        var pieData = new_ufo_data["ab"];

        var pie = d3.pie()
            .value(function (d) {
                return d.abs;
            })

        var arc = d3.arc()
            .innerRadius(30)
            .outerRadius(radius)
            .padAngle(2)
            .padRadius(2);

        //let cor= xxx
        //função que define forma como cor é dada?


        let band = d3.scaleBand();

        var chart = d3.select('#chart').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width - radius) + ',' + (height - radius) + ')')
            .selectAll('path')
            .data(pie(pieData, (d) => {
                return {
                    pie: pie(d),
                    dados: d
                }
            }))
            .enter()
            .append('g') //para cada setor um g, para cada abs
            .attr('class', 'slice');

        var slices = chart.selectAll('g.slice') //substituição de d3 por chart porque assim vai buscar dados ao data joint e não antes de fazer join, iu seja, html, sem dados agarrados
            .data((sector) => {
                //console.log("sector:",sector);
                //exemplo do prof do q devia dar [{q: 1000, dur: 10}, { q: 1000, dur: 60}, 1000, 1000, 10]
                //var avistamentos = avistamentos(sector.dados);
                //FALTA FUNÇÃO DE AVISTAMENTOS
                //esta que pus a seguir foi introduzida na aula:
                var avistamentos = sector.data.tempos;
                //console.log("avist:", avistamentos);
                band.domain(avistamentos)
                    .range([10, 300])
                //.range(rangeAvistamentos(avistamentos.length)) // 10 => {20 }
                return {
                    inner: band(sector.avistamentos),
                    outer: band(sector.data) + band.bandwidth(),
                    //cor: cor(avistamentos), //depois impor regra para cor
                    angInf: sector.startAngle,
                    angSup: sector.endAngle,
                    dados: sector.dados
                }
            })
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('fill', '#0FF285');


        let arco = slices.selectAll('g.arc') //aqui vamos buscar o joint anterior que criou mais dados importantes para aqui
            .data(function (dados) {
                console.log("dados:", dados);
                return dados;
            })
            .enter()
            .append('path')
            .attr('d', (barra) => {

                //console.log("barra:", barra);
                arc.innerRadius(barra.inner)
                    .outerRadius(barra.outer)
                    .startAngle(barra.startAngle)
                    .endAngle(barra.endAngle)
            })
            .attr('fill', '#F5F5F5');

    });

    console.log("new ufo_data")
    console.log(new_ufo_data);
    console.log(interv_tempo_aux);

});
