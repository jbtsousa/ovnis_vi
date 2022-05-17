/* CALCULOS.JS SÓ QUE MAIS ORGANIZADO E LIMPO E SEM NENHUM DESENHO D3 */
d3.csv("/data/ufo_sights.csv").then(function (data) {

 ufo_data = data.reduce(function(ufo,d){
    ufo[d.state]= ufo[d.state] || [];
    ufo[d.state].push(d);

 
    return ufo;
}, Object.create(null));

console.log(ufo_data);


 Object.entries(ufo_data).forEach(entry=>{
     const[key,value]=entry;
    //console.log (key,value);
     //console.log("_______")
 })

 
    /*ARRAYS DAS FREQUÊNCIAS DAS FORMAS E DURAÇÕES*/
   /*  let freq_duracao = [];
    data.forEach(function (d) {
        if (freq_duracao[d.duration]) {
            freq_duracao[d.duration] += 1;
        }
        else {
            freq_duracao[d.duration] = 1;
        }
    }); */

    let freq_formas = [];
    console.log(freq_formas);

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
    console.log(freq_formas);

    Object.keys(tempos).forEach(key_forma => {
        for (var i = 0; i < data.length; i++) {
            if (key_forma == data[i].shape) {
                tempos[key_forma].push(data[i].duration);
            }
        }
    })

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

    console.log(new_data);


 


});




