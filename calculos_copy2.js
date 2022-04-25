/*** AQUI VAI SER TUDO O QUE FOI FEITO NO CALCULOS_COPY MAS DIVIDIDO POR ESTADO ***/

d3.csv("/data/ufo_sights.csv").then(function (data) {

    ufo_data = data.reduce(function (ufo, d) {
        ufo[d.state] = ufo[d.state] || [];
        ufo[d.state].push(d);

        return ufo;
    }, Object.create(null));

    console.log(ufo_data);

    /*** FREQUÊNCIA DE AVISTAMENTOS POR FORMA ***/

    Object.entries(ufo_data).forEach(entry => {
        const [key, value] = entry;

        let freq_formas = {};

        // !!! isto so está a fazer para o primeiro estado e esta a dar problemas c tudo a seguir , pie tb pq algumas formas n existem !!!
            value.forEach(function (d) {

                if (freq_formas[d.shape]) {
                    freq_formas[d.shape] += 1;
                }
                else {
                    freq_formas[d.shape] = 1;
                }
            })
        

        console.log(freq_formas);

          /*** NOVO ARRAY COM FORMAS AGRUPADAS e DADOS NECESSARIOS PARA ENVIAR PARA GRÁFICO ***/
          // !!! não está bem porque, caso uma das formas (das somadas) não exista, dá erro e o valor dessa forma fica Nan !!!
          let new_freqformas = {};
          Object.keys(freq_formas).forEach(key => {
              //CIL
              new_freqformas["cil"] = freq_formas["cylinder"] + freq_formas["cigar"];
              //CIRCULO
              new_freqformas["circulo"] = freq_formas["circle"] + freq_formas["sphere"] + freq_formas["round"];
              //LUZ
              new_freqformas["luz"] = freq_formas["flash"] + freq_formas["flare"] + freq_formas["light"];
              //FIREBALL
              new_freqformas["fireball"] = freq_formas["fireball"];
              //ELIPSE
              new_freqformas["elipse"]  = freq_formas["disk"] + freq_formas["egg"] + freq_formas["oval"];
              //RECT
              new_freqformas["rect"] =  freq_formas["rectangle"];
              //TRIAG
              new_freqformas["triang"] =  freq_formas["chevron"] + freq_formas["triangle"] + freq_formas["delta"];
              //FORMATION
              new_freqformas["formation"] =  freq_formas["formation"];
              //CHANGE
              new_freqformas["change"] =  freq_formas["changing"] + freq_formas["changed"];
              //DIAMANTE
              new_freqformas["diamond"] = freq_formas["diamond"];
              //DESCONHECIDO
              new_freqformas["desconhecido"] =  freq_formas["unknown"];
              //OUTRO
              new_freqformas["outro"] = freq_formas["other"] + freq_formas["pyramid"] + freq_formas["hexagon"] + freq_formas["crescent"] + freq_formas["dome"] + freq_formas["teardrop"] + freq_formas["cone"] + freq_formas["cross"];
          });
  
          //console.log(new_freqformas);
  

        /*** POR INFORMAÇÃO DE FORMA A ESTAR PRONTA A SER RECEBIDA PELO D3 */
        let new_ufo_data = {};
        new_ufo_data[key] = [];
        //agora estamos a usar as formas todas (não as 12), pq o new_freqformas não está bem
        Object.entries(freq_formas).forEach(([key2, value]) => {
            new_ufo_data[key].push({
                nome: key2,
                abs: value
            })
        })

        console.log(new_ufo_data);



        /******* DESENHO DO GRÁFICO *******/

        var width = 800;
        var height = 800;
        var radius = 400;

        //aqui estamos só a fazer com um estado
        var pieData = new_ufo_data["ab"]

        var pie = d3.pie()
            .value(function (d) {
                //frequencia absoluta de cada forma (fatia)
                return d.abs;
            })

        var arc = d3.arc()
            .innerRadius(30)
            .outerRadius(radius)
            .cornerRadius(3)
            .padAngle(1)
            .padRadius(2);

        var chart = d3.select('#chart').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width - radius) + ',' + (height - radius) + ')')
            .selectAll('path')
            .data(pie(pieData))
            .enter()
            .append('g')
            .attr('class', 'slice')

        var slices = d3.selectAll('g.slice')
            .append('path')
            .attr('d', arc)


        var text = d3.selectAll('g.slice')
            .append('text')
            .text(function (d, i) {
                return d.data.nome;
            })
            .attr('text-anchor', 'middle')
            .attr('fill', 'yellow')
            .attr('transform', function (d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return 'translate(' + arc.centroid(d) + ')';
            })

    });



});
