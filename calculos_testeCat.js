/*** INFORMAÇÃO DIVIDIDA POR ESTADO ***/

d3.csv("/data/ufo_sights.csv").then(function (data) {

    /** * Array auxiliar apenas com as formas **/
    var shapes_rep = []
    for (var i = 0; i < data.length; i++) {
        shapes_rep.push(data[i].shape);
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

    /*** TEMPOS POR ESTADO POR FORMA ***/
    let tempos = [];

    /**** ARRAY Q TEM INFO QUE VAI PARA D3 *****/
    let new_ufo_data = [];


    /**** DENTRO DO UFO DATA *****/

    Object.entries(ufo_data).forEach(([state, avist]) => {

        freq_formas[state] = [];
        tempos[state] = [];
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

        //TEMPOS
        for (var i = 0; i < arr_shapes.length; i++) {
            tempos[state].push({
                forma: arr_shapes[i],
                tempos: []
            });
        }

        for (var i = 0; i < arr_shapes.length; i++) {
            for (j = 0; j < avist.length; j++) {
                if (avist[j].shape == tempos[state][i]["forma"]){
                    tempos[state][i]["tempos"].push(avist[j].duration);
                }

            }
        }

        /****  INFO QUE VAI PARA D3 *****/

        new_ufo_data[state] = [];

        for (var i = 0; i < arr_shapes.length; i++) {
            new_ufo_data[state].push({
                forma: arr_shapes[i],
                frequencia: freq_formas[state][arr_shapes[i]],
                tempos: tempos[state][i]["tempos"]
            });
        }

    });


    console.log('freq_formas por estado',freq_formas);
    
    console.log('tempos por formas por estado',tempos);

    console.log("new ufo_data", new_ufo_data);


     /******* DESENHO DO GRÁFICO - Evgheni  *******/

     var width = 600;
     var height = 600;
     var radius = 300;
     //var thickness = 15;
 
     //aqui estamos só a fazer com um estado
     //isolar isto tudo numa função e depois chamar de acordo com o id do estado
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
         .attr('class', 'slice');
 
 
 
         var slices = chart.selectAll('g.slice') //substituição de d3 por chart porque assim vai buscar dados ao data joint e não antes de fazer join, iu seja, html, sem dados agarrados
         .data((sector) => {
             //console.log("sector:",sector);
             
             var navistamentos =[20,50,54,59]; //se for acumulativo ou seja 20, 30, 4, 5
             var max = 200;
             var margem = 8;
       
             scaleX.domain([0,max])
             .range([30,300])

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
         .data(function(dados){
             //ESTE CONSOLE LOG NÃO CORRE
             //console.log("dados:",dados);
             return [dados];
         })
         .enter()
         .append('path')
     
         .attr('d', (barra) => {
 
             //ESTE CONSOLE LOG NÃO CORRE
             console.log("barra:", barra);
             arc.
             innerRadius(barra.inner)
             .outerRadius(barra.outer)
             .startAngle(barra.startAngle)
             .endAngle(barra.endAngle)
         })
         .attr('fill','#F5F5F5');




});