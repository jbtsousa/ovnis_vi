   
   /*CÁLCULO QUARTIS (das durações dos avistamentos)*/

   d3.csv("/data/ufo_sights.csv").then(function (data) {

    let duracoes = [];
    for (var i = 0; i < data.length; i++) {

        duracoes.push(data[i].duration);
    }
    let p25 = d3.quantile(duracoes, 0.25);
    let p50 = d3.quantile(duracoes, 0.5);
    let p75 = d3.quantile(duracoes, 0.75);

       console.log(duracoes);
       console.log(p25);
       console.log(p50);
       console.log(p75); 
    }
)