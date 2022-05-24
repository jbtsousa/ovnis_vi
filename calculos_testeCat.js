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
    //var thickness = 15;

    //aqui estamos só a fazer com um estado
    //isolar isto tudo numa função e depois chamar de acordo com o id do estado
    var pieData = new_ufo_data["ab"];

    var pie = d3.pie()
        .value(function (d) {
            return d.frequencia;
        });

    var arc = d3.arc()
        .innerRadius(30)
        .outerRadius(radius)
        .padAngle(2)
        .padRadius(2);

    let scaleX = d3.scaleLinear();

    //antes do chart>slice>arc acresentar secção que tem input o estado
    //tratr das posiç~eos dos graficos. no inicio por random

    var chart = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)

        /*function(chart,estado){ --> função com tudo
           chart.append('g')
           .attr("id", estado)
           ... //a partir daqui repetir todo o código que esta para baixo
        }*/
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
        .attr('class', 'slice')
        .attr('width', width)


    var slices = chart.selectAll('g.slice') //substituição de d3 por chart porque assim vai buscar dados ao data joint e não antes de fazer join, iu seja, html, sem dados agarrados
        .data((sector) => {
            //console.log("sector:",sector);
            var navistamentos = [20, 50, 54, 59]; //se for acumulativo ou seja 20, 30, 4, 5
            var max = 200;
            var margem = 8;

            scaleX.domain([0, max])
                .range([30, 300])

            return [{
                inner: 30,
                //margem + scaleX(data), //MAS O ANTERIOR
                outer: 100,
                angInf: sector.startAngle,
                angSup: sector.endAngle,
                dados: sector.dados
            }]  //d3 trabalha com array e nao objetos
        })
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('fill', '#0FF285');
    //console.log(slices.selectAll('g.arc'));

    let arco = slices.selectAll('g.arc') //aqui vamos buscar o joint anterior que criou mais dados importantes para aqui

        .data(function (dados) {
            //console.log(dados);
            return [dados];
        })
        .enter()
        .append('path')

         .attr("d", (barra) => {
            //console.log("barra:", barra);
            return d3.arc()({
                innerRadius:barra.inner,
                outerRadius:barra.outer,
                startAngle:barra.angInf,
                endAngle:barra.angSup
            })
        }) 
        .attr('fill', '#F5F5F5');

    });

    console.log("new ufo_data")
    console.log(new_ufo_data);
    console.log(interv_tempo_aux);


});