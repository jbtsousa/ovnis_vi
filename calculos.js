d3.csv("/data/ufo_sights.csv").then(function (data) {
    let freq_formas = [];

    data.forEach(function (d) {
        if (freq_formas[d.shape]) {
            freq_formas[d.shape] += 1;
        }
        else {
            freq_formas[d.shape] = 1;
        }
    });

    var dict = {};
    data.forEach(function (d) {
        dict[d.shape] = [];
    });
    console.log(dict);

    console.log(data);
    Object.keys(dict).forEach(key_forma => {
        for (var i = 0; i < data.length; i++) {
            if (key_forma = data[i].shape) {
                //if (i+1 <= freq_formas[data[i].shape] ) {
                dict[data[i].shape].push(data[i].duration);
                //}
            }
        }
    })

    console.log(dict);

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

    console.log(freq_formas);
    console.log(freq_duracao);

    /*SOMATÓRIO TODOS AVISTAMENTOS*/
    let sum = 0;
    Object.keys(new_freqformas).forEach(key => {
        sum += new_freqformas[key];
    })
    console.log(sum);


    /*NOVO ARRAY COM FORMAS AGRUPADAS*/
    let new_freqformas = [];

    Object.keys(freq_formas).forEach(key => {
        if (key == "cylinder" || key == "cigar") {
            new_freqformas.cil = freq_formas["cylinder"] + freq_formas["cigar"];
        }
        else if (key == "circle" || key == "sphere" || key == "round") {
            new_freqformas.circulo = freq_formas["circle"] + freq_formas["sphere"] + freq_formas["round"];
        }
        else if (key == "flash" || key == "flare" || key == "light") {
            new_freqformas.luz = freq_formas["flash"] + freq_formas["flare"] + freq_formas["light"];
        }
        else if (key == "fireball") {
            new_freqformas.pitbull = freq_formas["fireball"];
        }
        else if (key == "disk" || key == "egg" || key == "oval") {
            new_freqformas.elipse = freq_formas["disk"] + freq_formas["egg"] + freq_formas["oval"];
        }
        else if (key == "rectangle") {
            new_freqformas.rect = freq_formas["rectangle"];
        }
        else if (key == "chevron" || key == "triangle" || key == "delta") {
            new_freqformas.trig = freq_formas["chevron"] + freq_formas["triangle"] + freq_formas["delta"];
        }
        else if (key == "formation") {
            new_freqformas.form = freq_formas["formation"];
        }
        else if (key == "changing" || key == "changed") {
            new_freqformas.change = freq_formas["changing"] + freq_formas["changed"];
        }
        else if (key == "diamond") {
            new_freqformas.dia = freq_formas["diamond"];
        }
        else if (key == "unknown") {
            new_freqformas.desconhecido = freq_formas["unknown"];
        }
        else if (key == "other" || key == "pyramid" || key == "hexagon" || key == "crescent" || key == "dome" || key == "teardrop" || key == "cone" || key == "cross") {
            new_freqformas.outro = freq_formas["other"] + freq_formas["pyramid"] + freq_formas["hexagon"] + freq_formas["crescent"] + freq_formas["dome"] + freq_formas["teardrop"] + freq_formas["cone"] + freq_formas["cross"];
        }
    });
    console.log(new_freqformas);





});





