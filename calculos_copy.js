d3.csv("/data/ufo_sights.csv").then(function (data) {

    /*ARRAYS DAS FREQUÊNCIAS DAS FORMAS E DURAÇÕES*/
    let freq_duracao = [];
    data.forEach(function (d) {
        if (freq_duracao[d.duration]) {
            freq_duracao[d.duration] += 1;
        }
        else {
            freq_duracao[d.duration] = 1;
        }
    });

    let freq_formas = [];
    data.forEach(function (d) {
        if (freq_formas[d.shape]) {
            freq_formas[d.shape] += 1;
        }
        else {
            freq_formas[d.shape] = 1;
        }
    });

    /*DICIONÁRIO COM TODOS OS TEMPOS DE CADA FORMA */
    var tempos = {};

    data.forEach(function (d) {
        tempos[d.shape] = [];
    });

    Object.keys(tempos).forEach(key_forma => {
        for (var i = 0; i < data.length; i++) {
            if (key_forma == data[i].shape) {
                tempos[key_forma].push(data[i].duration);
            }
        }
    })
    console.log(tempos);




    /*NOVO ARRAY COM FORMAS AGRUPADAS e DADOS NECESSARIOS PARA ENVIAR PARA GRÁFICO*/
    let new_freqformas = {};
    Object.keys(freq_formas).forEach(key => {
        //CIL
        new_freqformas["cil"] = {};
        new_freqformas["cil"]["abs"] = freq_formas["cylinder"] + freq_formas["cigar"];
        arr_aux = tempos["cylinder"].concat(tempos["cigar"]);
        new_freqformas["cil"]["tempos"] = arr_aux;
        //CIRCULO
        new_freqformas["circulo"] = {};
        new_freqformas["circulo"]["abs"] = freq_formas["circle"] + freq_formas["sphere"] + freq_formas["round"];
        arr_aux = tempos["circle"].concat(tempos["sphere"], tempos["round"]);
        new_freqformas["circulo"]["tempos"] = arr_aux;
        //LUZ
        new_freqformas["luz"] = {};
        new_freqformas["luz"]["abs"] = freq_formas["flash"] + freq_formas["flare"] + freq_formas["light"];
        arr_aux = tempos["flash"].concat(tempos["flare"], tempos["light"]);
        new_freqformas["luz"]["tempos"] = arr_aux;
        //FIREBALL
        new_freqformas["fireball"] = {};
        new_freqformas["fireball"]["abs"] = freq_formas["fireball"];
        new_freqformas["fireball"]["tempos"] = tempos["fireball"];
        //ELIPSE
        new_freqformas["elipse"] = {};
        new_freqformas["elipse"]["abs"] = freq_formas["disk"] + freq_formas["egg"] + freq_formas["oval"];
        arr_aux = tempos["disk"].concat(tempos["egg"], tempos["oval"]);
        new_freqformas["elipse"]["tempos"] = arr_aux;
        //RECT
        new_freqformas["rect"] = {};
        new_freqformas["rect"]["abs"] = freq_formas["rectangle"];
        new_freqformas["rect"]["tempos"] = tempos["rectangle"];
        //TRIAG
        new_freqformas["triang"] = {};
        new_freqformas["triang"]["abs"] = freq_formas["chevron"] + freq_formas["triangle"] + freq_formas["delta"];
        arr_aux = tempos["chevron"].concat(tempos["triangle"], tempos["delta"]);
        new_freqformas["triang"]["tempos"] = arr_aux;
        //FORMATION
        new_freqformas["formation"] = {};
        new_freqformas["formation"]["abs"] = freq_formas["formation"];
        new_freqformas["formation"]["tempos"] = tempos["formation"];
        //CHANGE
        new_freqformas["change"] = {};
        new_freqformas["change"]["abs"] = freq_formas["changing"] + freq_formas["changed"];
        arr_aux = tempos["changing"].concat(tempos["changed"]);
        new_freqformas["change"]["tempos"] = arr_aux;
        //DIAMANTE
        new_freqformas["diamond"] = {};
        new_freqformas["diamond"]["abs"] = freq_formas["diamond"];
        new_freqformas["diamond"]["tempos"] = tempos["diamond"];
        //DESCONHECIDO
        new_freqformas["desconhecido"] = {}
        new_freqformas["desconhecido"]["abs"] = freq_formas["unknown"];
        new_freqformas["desconhecido"]["tempos"] = tempos["unknown"];
        //OUTRO
        new_freqformas["outro"] = {};
        new_freqformas["outro"]["abs"] = freq_formas["other"] + freq_formas["pyramid"] + freq_formas["hexagon"] + freq_formas["crescent"] + freq_formas["dome"] + freq_formas["teardrop"] + freq_formas["cone"] + freq_formas["cross"];
        arr_aux = tempos["other"].concat(tempos["pyramid"], tempos["hexagon"], tempos["crescent"], tempos["dome"], tempos["teardrop"], tempos["cone"], tempos["cross"]);
        new_freqformas["outro"]["tempos"] = arr_aux;
    });


    /*SOMATÓRIO TODOS AVISTAMENTOS*/
    let sum = 0;
    let abs = []
    Object.keys(new_freqformas).forEach(key => {
        abs.push(new_freqformas[key]["abs"]);
        sum = d3.sum(abs);
    })

    /* VALOR RELATIVO*/
    var sorted = [];
    Object.keys(new_freqformas).forEach(key => {
        var relativo = (new_freqformas[key]["abs"]) / sum;
        new_freqformas[key]["pp"] = relativo;
        sorted.push(new_freqformas[key][3]);
        sorted.sort();
        return sorted;
    })

    let new_data = [];
    Object.keys(new_freqformas).forEach(chave => {
        new_data.push({
            nome: chave,
            abs: new_freqformas[chave]["abs"],
            pp: new_freqformas[chave]["pp"],
            tempos: new_freqformas[chave]["tempos"]
        })



    })




    console.log(new_freqformas);

    console.log("new_data")
    console.log(new_data);


    //margem entre fatias da tarte
    let margem = 0.008 * Math.PI * 2;

    //espessura linhas. PROBLEMA: está a ser aplicada uma escala logarítmica a este valor
    var espess = 0.6;

    var arcGenerator = d3.arc();
    var eixoRadial = d3.scaleLog().domain([0.01, 9900]).range([30, 200]);

    //testando
    //console.log("oi");
    //console.log(eixoRadial(0.01));

    var svg = d3.select('#lol').append('svg')
        .attr('width', '100vw')
        .attr('height', '100vh')
        .append('g') //tentar alterar posição do arco com o contentor g (resultou)
        .attr('width', '100vw')
        .attr('height', '100vh')
        .attr('transform', 'translate(500,500)');

    ////////////////////////////////////////////////////////////////////////////////////////CHANGE
    svg.selectAll('path')
        .data(arr_teste_change) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {
            return arcGenerator({
                startAngle: 0,
                endAngle: 0.025038265306122447 * Math.PI * 2,
                /*innerRadius: d.tmp,
                outerRadius: d.tmp+2*/
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "green")


    /*.style("fill", function(d,i){
      if(d<30){
        return "black";
      }else if(d>=30 || d<60*3){
          return "green";
      }else if (d>=60*3 || d<60*10){
          return "yellow";
      }else{
        return"red";
      }
    });*/

    ////////////////////////////////////////////////////////////////////////////////////////CIL
    svg.selectAll('path')
        .data(arr_teste_cil) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {
            return arcGenerator({
                startAngle: 0.025038265306122447 * Math.PI * 2,
                endAngle: 0.025038265306122447 * Math.PI * 2 + 0.04260204081632653 * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })

        .style("fill", "pink")

    ////////////////////////////////////////////////////////////////////////////////////////CIRCULO
    svg.selectAll('path')
        .data(arr_teste_cir) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: 0.025038265306122447 * Math.PI * 2 + 0.04260204081632653 * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "blue")

    /*.style("fill", function(d,i){
        if(d<30){
          return "black";
        }else if(d>=30 || d<60*3){
            return "green";
        }else if (d>=60*3 || d<60*10){
            return "yellow";
        }else{
          return"red";
        }
      });*/

    ///////////////////////////////////////////////////////////////////////////////////////DESCONHECIDO

    svg.selectAll('path')
        .data(arr_teste_desconhecido) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {
            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "violet")

    ////////////////////////////////////////////////////////////////////////////////////////DIAMOND

    svg.selectAll('path')
        .data(arr_teste_diamond) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "orange")


    ////////////////////////////////////////////////////////////////////////////////////////ELLIPSE

    svg.selectAll('path')
        .data(arr_teste_elipse) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "purple")

    ////////////////////////////////////////////////////////////////////////////////////////FIREBALL
    svg.selectAll('path')
        .data(arr_teste_fireball) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "red")

    ////////////////////////////////////////////////////////////////////////////////////////FORMATION

    svg.selectAll('path')
        .data(arr_teste_formation) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "brown")

    ////////////////////////////////////////////////////////////////////////////////////////LUZ

    svg.selectAll('path')
        .data(arr_teste_luz) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "black")

    ////////////////////////////////////////////////////////////////////////////////////////OUTRO

    svg.selectAll('path')
        .data(arr_teste_outro) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735 + 0.08868622448979592) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "blue")

    ////////////////////////////////////////////////////////////////////////////////////////RECT

    svg.selectAll('path')
        .data(arr_teste_rect) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735 + 0.08868622448979592) * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735 + 0.08868622448979592 + 0.016543367346938776) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "blue")

    ////////////////////////////////////////////////////////////////////////////////////////TRIANG
    svg.selectAll('path')
        .data(arr_teste_triang) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path').attr('d', function (d, i) {

            return arcGenerator({
                startAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735 + 0.08868622448979592) + 0.016543367346938776 * Math.PI * 2,
                endAngle: (0.025038265306122447 + 0.04260204081632653 + 0.1657780612244898 + 0.07122448979591836 + 0.015025510204081632 + 0.12378826530612246 + 0.07918367346938776 + 0.031339285714285715 + 0.22823979591836735 + 0.08868622448979592 + 0.016543367346938776 + 0.11255102040816327) * Math.PI * 2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
            })
        })
        .style("fill", "blue");


});




