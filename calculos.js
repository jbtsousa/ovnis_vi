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

    /*DICIONÁRIO COM TODOS OS TEMPOS DE CADA FORMA E MIN E MAX */
    // !!PROBLEMA NO CIRCLE!!
    // !! AINDA TEM AS FORMAS TODAS REDUZIR PARA A LISTA DE MENOS FORMA
    var dict = {};
    var dict_minmax = {};

    data.forEach(function (d) {
        dict[d.shape] = [];
    });

    Object.keys(dict).forEach(key_forma => {
        for (var i = 0; i < data.length; i++) {
            if (key_forma == data[i].shape) {
                dict[key_forma].push(data[i].duration);
            }
        }
        var max = Math.max.apply(Math, dict[key_forma]);
        var min = Math.min.apply(Math, dict[key_forma]);

        dict_minmax[key_forma] = [];
        dict_minmax[key_forma].push(min);
        dict_minmax[key_forma].push(max);

    })

    console.log("Varias durações por objeto");
    console.log(dict);

    console.log("Aparição minima e maxima por forma");
    console.log(dict_minmax);

    /*NOVO ARRAY COM FORMAS AGRUPADAS*/
    //let new_freqformas = [];
    let new_freqformas = {};

    Object.keys(freq_formas).forEach(key => {
        if (key == "cylinder" || key == "cigar") {
            new_freqformas["cil"] = [freq_formas["cylinder"] + freq_formas["cigar"]];
        }
        else if (key == "circle" || key == "sphere" || key == "round") {
            new_freqformas["circulo"] = [freq_formas["circle"] + freq_formas["sphere"] + freq_formas["round"]];
        }
        else if (key == "flash" || key == "flare" || key == "light") {
            new_freqformas["luz"] = [freq_formas["flash"] + freq_formas["flare"] + freq_formas["light"]];
        }
        else if (key == "fireball") {
            new_freqformas["pitbull"] = [freq_formas["fireball"]];
        }
        else if (key == "disk" || key == "egg" || key == "oval") {
            new_freqformas["elipse"] = [freq_formas["disk"] + freq_formas["egg"] + freq_formas["oval"]];
        }
        else if (key == "rectangle") {
            new_freqformas["rect"] = [freq_formas["rectangle"]];
        }
        else if (key == "chevron" || key == "triangle" || key == "delta") {
            new_freqformas["trig"] = [freq_formas["chevron"] + freq_formas["triangle"] + freq_formas["delta"]];
        }
        else if (key == "formation") {
            new_freqformas["form"] = [freq_formas["formation"]];
        }
        else if (key == "changing" || key == "changed") {
            new_freqformas["change"] = [freq_formas["changing"] + freq_formas["changed"]];
        }
        else if (key == "diamond") {
            new_freqformas["dia"] = [freq_formas["diamond"]];
        }
        else if (key == "unknown") {
            new_freqformas["desconhecido"] = [freq_formas["unknown"]];
        }
        else if (key == "other" || key == "pyramid" || key == "hexagon" || key == "crescent" || key == "dome" || key == "teardrop" || key == "cone" || key == "cross") {
            new_freqformas["outro"] = [freq_formas["other"] + freq_formas["pyramid"] + freq_formas["hexagon"] + freq_formas["crescent"] + freq_formas["dome"] + freq_formas["teardrop"] + freq_formas["cone"] + freq_formas["cross"]];
        }
    });
    console.log("new freq formas")
    console.log(new_freqformas);

    /*SOMATÓRIO TODOS AVISTAMENTOS*/
    let sum = 0;
    Object.keys(new_freqformas).forEach(key => {
        sum += new_freqformas[key][0];
    })

    /* VALOR RELATIVO*/
    var sorted = [];
    Object.keys(new_freqformas).forEach(key => {
        var relativo = (new_freqformas[key][0]) / sum;
        new_freqformas[key].push(relativo);
        sorted.push(new_freqformas[key][1]);
        sorted.sort();
        return sorted;
    })
    console.log("valores relativos ordenados");
    console.log(sorted);
    console.log("Valor absoluto, valor relativo");
    console.log(new_freqformas);



    /*TENTATIVA DE DESENHAR ARCOS*/
    let teste = [0.5, 0.3];  //simula as frequencias relativas
    //se há duas entradas, vai desenhar um path (supostamente) por entrada
    var arcGenerator = d3.arc();

    var svg = d3.select('#lol').append('svg')
        .attr('width', 700)
        .attr('height', 500)
        .append('g') //tentar alterar posição do arco com o contentor g (resultou)
        //.attr('width', 700)
        //.attr('height', 500)
        //.attr('translate',(300,110)) //tentar alterar a posição com transform >> translate mas não deu
        .attr('transform', 'translate(230,300)');

    svg.selectAll('path')
        .data(teste) //dados aos quais vamos associar formas/paths
        .enter()
        .append('path')
        .attr('d', function (d, i) {

            //há diferenças entres estes dois "d". O primeiro, é o parâmetro que
            //a forma "path" precisa de receber para ser desenhada.
            //É a esse d que queremos atribuir a função dos arcos. O segundo d,
            //é um parâmetro da função function() que representa o valor de
            //uma entrada do dataset que estamos a receber (neste caso, teste).
            //E o "i" é a posição no data set.

            //a partir do data(teste), que tem duas entradas, os comandos enter
            //append e attr vão correr em loop o número de vezes = número de entradas
            //em data(teste). Neste caso, duas. Pelo que devia desenhar 2 arcos.

            //PROBLEMA: Está a ser desenhado um arco com 0.5*2PI e outro com 0.3*2PI
            //um em cima do outro. Site d3 depth, shapes, pie chart, serºa que ajuda????
            return arcGenerator({

                startAngle: 0,
                endAngle: d * Math.PI * 2,
                innerRadius: 50,
                outerRadius: 150

            })


        })





});





