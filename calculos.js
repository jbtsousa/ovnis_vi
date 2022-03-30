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










});





