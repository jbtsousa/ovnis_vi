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
    console.log(ufo_data);

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

    console.log('freq_formas por estado');
    console.log(freq_formas);
    
    console.log('tempos por formas por estado');
    console.log(tempos);

    console.log("new ufo_data")
    console.log(new_ufo_data);







});
