/*AQUI VAI SER TUDO O QUE FOI FEITO NO CALCULOS_COPY MAS DIVIDIDO POR ESTADO*/

d3.csv("/data/ufo_sights.csv").then(function (data) {

    ufo_data = data.reduce(function (ufo, d) {
        ufo[d.state] = ufo[d.state] || [];
        ufo[d.state].push(d);


        return ufo;
    }, Object.create(null));

   // console.log(ufo_data);


    Object.entries(ufo_data).forEach(entry => {
        const [key, value] = entry;
   
        let freq_formas = {};
        let new_ufo_data = {};

        value.forEach(function (d) {

            if (freq_formas[d.shape]) {
                freq_formas[d.shape] += 1;
            }
            else {
                freq_formas[d.shape] = 1;
            }
        })


        new_ufo_data[key] = [];
        Object.entries(freq_formas).forEach(([key2, value]) => {

            new_ufo_data[key].push({
                nome: key2,
                abs: value

            })
        })

        console.log(new_ufo_data);







    });



});
