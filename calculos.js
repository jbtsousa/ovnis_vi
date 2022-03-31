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

    var dict = {};

    data.forEach(function (d) {
        dict[d.shape] = [];
    });

    Object.keys(dict).forEach(key_forma => {
        for (var i = 0; i < data.length; i++) {
            if (key_forma == data[i].shape) {
                dict[key_forma].push(data[i].duration);
            }
        }
    })
    console.log(dict);


    /*NOVO ARRAY COM FORMAS AGRUPADAS e DADOS NECESSARIOS PARA ENVIAR PARA GRÁFICO*/
    let new_freqformas = {};
    //console.log(dict);

    //////////////////////////////////////////////////////////////////////////////////arrays padeiros
    var arr_teste_change = [];
    arr_teste_change= dict["changing"].concat(dict["changed"]);
    
    var arr_teste_cil = [];
    arr_teste_cil= dict["cylinder"].concat(dict["cigar"]);

    var arr_teste_cir = [];
    arr_teste_cir=dict["circle"].concat(dict["sphere"], dict["round"]);

    var arr_teste_desconhecido = [];
    arr_teste_desconhecido=dict["unknown"];

    var arr_teste_diamond = [];
    arr_teste_diamond=dict["diamond"];

    var arr_teste_elipse = [];
    arr_teste_elipse=dict["disk"].concat(dict["egg"], dict["oval"]);

    var arr_teste_fireball = [];
    arr_teste_fireball=dict["fireball"];

    var arr_teste_formation = [];
    arr_teste_formation=dict["formation"];

    var arr_teste_luz = [];
    arr_teste_luz=dict["flash"].concat(dict["flare"], dict["light"]);

    var arr_teste_outro = [];
    arr_teste_outro=dict["other"].concat(dict["pyramid"], dict["hexagon"], dict["crescent"], dict["dome"], dict["teardrop"], dict["cone"], dict["cross"]);

    var arr_teste_rect = [];
    arr_teste_rect=dict["rectangle"];

    var arr_teste_triang = [];
    arr_teste_triang=dict["chevron"].concat(dict["triangle"], dict["delta"]);








    Object.keys(freq_formas).forEach(key => {
        Object.keys(dict).forEach(key2 => {
            var arr_aux = [];
            

            //CIL
            new_freqformas["cil"] = {};
            new_freqformas["cil"]["abs"] = freq_formas["cylinder"] + freq_formas["cigar"];
            //min e max
            arr_aux = dict["cylinder"].concat(dict["cigar"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["cil"]["max"] = max;
            new_freqformas["cil"]["min"] = min;
            new_freqformas["cil"]["tempos"]= arr_aux;

            //CIRCULO
            new_freqformas["circulo"] = {};
            new_freqformas["circulo"]["abs"] = freq_formas["circle"] + freq_formas["sphere"] + freq_formas["round"];
            //min e max
            arr_aux = dict["circle"].concat(dict["sphere"], dict["round"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["circulo"]["max"] = max;
            new_freqformas["circulo"]["min"] = min;
            new_freqformas["circulo"]["tempos"] = arr_aux;


            //LUZ
            new_freqformas["luz"] = {};
            new_freqformas["luz"]["abs"] = freq_formas["flash"] + freq_formas["flare"] + freq_formas["light"];
            //min e max
            arr_aux = dict["flash"].concat(dict["flare"], dict["light"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["luz"]["max"] = max;
            new_freqformas["luz"]["min"] = min;
            new_freqformas["luz"]["tempos"]=arr_aux;

            //FIREBALL
            new_freqformas["fireball"] = {};
            new_freqformas["fireball"]["abs"] = freq_formas["fireball"];
            //min e max
            var min = d3.min(dict["fireball"]);
            var max = d3.max(dict["fireball"]);
            new_freqformas["fireball"]["max"] = max;
            new_freqformas["fireball"]["min"] = min;
            new_freqformas["fireball"]["tempos"]=dict["fireball"];

            //ELIPSE
            new_freqformas["elipse"] = {};
            new_freqformas["elipse"]["abs"] = freq_formas["disk"] + freq_formas["egg"] + freq_formas["oval"];
            //min e max
            arr_aux = dict["disk"].concat(dict["egg"], dict["oval"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["elipse"]["min"] = min;
            new_freqformas["elipse"]["max"] = max;
            new_freqformas["elipse"]["tempos"]=arr_aux;


            //RECT
            new_freqformas["rect"] = {};
            new_freqformas["rect"]["abs"] = freq_formas["rectangle"];
            //min e max
            var min = d3.min(dict["rectangle"]);
            var max = d3.max(dict["rectangle"]);
            new_freqformas["rect"]["max"] = max;
            new_freqformas["rect"]["min"] = min;
            new_freqformas["rect"]["tempos"]=arr_aux;



            //TRIAG
            new_freqformas["triang"] = {};
            new_freqformas["triang"]["abs"] = freq_formas["chevron"] + freq_formas["triangle"] + freq_formas["delta"];
            //min e max
            arr_aux = dict["chevron"].concat(dict["triangle"], dict["delta"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["triang"]["min"] = min;
            new_freqformas["triang"]["max"] = max;
            new_freqformas["triang"]["tempos"]=arr_aux;


            //FORMATION
            new_freqformas["formation"]={};
            new_freqformas["formation"]["abs"] = freq_formas["formation"];
            //min e max
            var min = d3.min(dict["formation"]);
            var max = d3.max(dict["formation"]);
            new_freqformas["formation"]["min"] = min;
            new_freqformas["formation"]["max"] = max;
            new_freqformas["formation"]["tempos"]=dict["formation"];


            //CHANGE
            new_freqformas["change"]={};
            new_freqformas["change"]["abs"] = freq_formas["changing"] + freq_formas["changed"];
            //min e max
            arr_aux=dict["changing"].concat( dict["changed"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["change"]["min"] = min;
            new_freqformas["change"]["max"] = max;
            new_freqformas["change"]["tempos"]=arr_aux;


            //DIAMANTE
            new_freqformas["diamond"]={};
            new_freqformas["diamond"]["abs"] = freq_formas["diamond"];
            //min e max
            var min = d3.min(dict["diamond"]);
            var max = d3.max(dict["diamond"]);
            new_freqformas["diamond"]["min"] = min;
            new_freqformas["diamond"]["max"] = max;
            new_freqformas["diamond"]["tempos"]=dict["diamond"];


            //DESCONHECIDO
            new_freqformas["desconhecido"]={}
            new_freqformas["desconhecido"]["abs"] = freq_formas["unknown"];
            //min e max
            var min = d3.min(dict["unknown"]);
            var max = d3.max(dict["unknown"]);
            new_freqformas["desconhecido"]["min"] = min;
            new_freqformas["desconhecido"]["max"] = max;
            new_freqformas["desconhecido"]["tempos"]=dict["unknown"];


            //OUTRO
            new_freqformas["outro"]={};
            new_freqformas["outro"]["abs"] = freq_formas["other"] + freq_formas["pyramid"] + freq_formas["hexagon"] + freq_formas["crescent"] + freq_formas["dome"] + freq_formas["teardrop"] + freq_formas["cone"] + freq_formas["cross"];
            //min e max
            arr_aux=dict["other"].concat(dict["pyramid"], dict["hexagon"], dict["crescent"], dict["dome"], dict["teardrop"], dict["cone"], dict["cross"]);
            var min = d3.min(arr_aux);
            var max = d3.max(arr_aux);
            new_freqformas["outro"]["min"] = min;
            new_freqformas["outro"]["max"] = max;
            new_freqformas["outro"]["tempos"]=arr_aux;


        });
    });

    console.log("arr_teste_cil");   
    console.log(arr_teste_cil);

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
   
    //console.log("valores relativos ordenados");
    //console.log(sorted);
    console.log("Valor absoluto,max,min, valor relativo");
    console.log(new_freqformas);
     
    /*START ANGLE*/
    Object.keys(new_freqformas).forEach(key=>{
        new_freqformas["change"]["startAngle"]=0;
        new_freqformas["cil"]["startAngle"] = new_freqformas["change"]["pp"];
        new_freqformas["circulo"]["startAngle"]= new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"];
        new_freqformas["desconhecido"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"];
        new_freqformas["diamond"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"];
        new_freqformas["elipse"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"];
        new_freqformas["fireball"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"];
        new_freqformas["formation"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"]+new_freqformas["fireball"]["pp"];
        new_freqformas["luz"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"]+new_freqformas["fireball"]["pp"]+new_freqformas["formation"]["pp"];
        new_freqformas["outro"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"]+new_freqformas["fireball"]["pp"]+new_freqformas["formation"]["pp"]+new_freqformas["luz"]["pp"];
        new_freqformas["rect"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"]+new_freqformas["fireball"]["pp"]+new_freqformas["formation"]["pp"]+new_freqformas["luz"]["pp"]+new_freqformas["outro"]["pp"];
        new_freqformas["triang"]["startAngle"]=new_freqformas["change"]["pp"]+ new_freqformas["cil"]["pp"]+new_freqformas["circulo"]["pp"]+new_freqformas["desconhecido"]["pp"]+new_freqformas["diamond"]["pp"]+new_freqformas["elipse"]["pp"]+new_freqformas["fireball"]["pp"]+new_freqformas["formation"]["pp"]+new_freqformas["luz"]["pp"]+new_freqformas["outro"]["pp"]+new_freqformas["rect"]["pp"];


       /*  for(var i=0; i<new_freqformas[key]["tempos"].length;i++){
            console.log (new_freqformas["tempos"]);

        } */

    })



    /*DESENHAR ARCOS*/
    //let teste [] simula as frequencias relativas

   
        /*Object.keys(new_freqformas).forEach(key=>{
            for(var i=0; i<(new_freqformas[key]["tempos"]).length;i++){ 
                var _pp= new_freqformas[key]["pp"];
                var _sum= new_freqformas[key]["pp"]+new_freqformas[key]["pp"];
                var _tmp= new_freqformas[key]["tempos"][i];

                //return _pp, _sum, _tmp;

    
            };
        });*/


        



  
      //margem entre fatias da tarte
      let margem=0.008*Math.PI*2;
  
      //espessura linhas. PROBLEMA: está a ser aplicada uma escala logarítmica a este valor
      var espess=0.6;
  
      var arcGenerator = d3.arc();
      var eixoRadial =d3.scaleLog().domain([0.01,9900]).range([30, 270]);
  
      //testando
      //console.log("oi");
      //console.log(eixoRadial(0.01));
  
      var svg = d3.select('#lol').append('svg')
          .attr('width', '100vw')
          .attr('height', '100vh')
          .append('g') //tentar alterar posição do arco com o contentor g (resultou)
          .attr('transform', 'translate(300,500)');
  
////////////////////////////////////////////////////////////////////////////////////////CHANGE
svg.selectAll('path')
.data(arr_teste_change) //dados aos quais vamos associar formas/paths
.enter()
.append('path').attr('d', function (d, i) {

    
      return arcGenerator({
      startAngle: 0,
      endAngle:  0.025038265306122447 * Math.PI*2,
      /*innerRadius: d.tmp,
      outerRadius: d.tmp+2*/
      innerRadius: eixoRadial(d),
      outerRadius: eixoRadial(d) + espess
      })
})  

.style("fill","green")


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
                startAngle: 0.025038265306122447*Math.PI*2,
                endAngle: 0.025038265306122447*Math.PI*2+ 0.04260204081632653*Math.PI*2,
                innerRadius: eixoRadial(d),
                outerRadius: eixoRadial(d) + espess
                })
          })  
          
          .style("fill","pink")
 

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

////////////////////////////////////////////////////////////////////////////////////////CIRCULO
          svg.selectAll('path')
          .data(arr_teste_cir) //dados aos quais vamos associar formas/paths
          .enter()
          .append('path').attr('d', function (d, i) {
            //CIRC
              return arcGenerator({
              startAngle: 0.025038265306122447*Math.PI*2+ 0.04260204081632653*Math.PI*2 ,
              endAngle: (0.025038265306122447+ 0.04260204081632653+ 0.1657780612244898)*Math.PI*2,
              innerRadius: eixoRadial(d),
              outerRadius: eixoRadial(d) + espess
              })
        })
        .style("fill","blue");
        
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
            //CIRC
              return arcGenerator({
              startAngle: (0.025038265306122447+ 0.04260204081632653+ 0.1657780612244898)*Math.PI*2,
              endAngle: (0.025038265306122447+ 0.04260204081632653+ 0.1657780612244898 + 0.1657780612244898)*Math.PI*2,
              innerRadius: eixoRadial(d),
              outerRadius: eixoRadial(d) + espess
              })
        })
        .style("fill","black");

          ////////////////////////////////////////////////////////////////////////////////////////DIAMOND

          svg.selectAll('path')
          .data(arr_teste_diamond) //dados aos quais vamos associar formas/paths
          .enter()
          .append('path').attr('d', function (d, i) {
            //CIRC
              return arcGenerator({
              startAngle: 0.025038265306122447*Math.PI*2+ 0.04260204081632653*Math.PI*2+ 0.1657780612244898*Math.PI*2+ 0.07122448979591836*Math.PI*2,
              endAngle: 0.025038265306122447*Math.PI*2+ 0.04260204081632653*Math.PI*2+ 0.1657780612244898*Math.PI*2+ 0.07122448979591836*Math.PI*2+ 0.015025510204081632*Math.PI*2,
              /*innerRadius: d.tmp,
              outerRadius: d.tmp+2*/
              innerRadius: eixoRadial(d),
              outerRadius: eixoRadial(d) + espess
              })
        })
        .style("fill","pink");


          ////////////////////////////////////////////////////////////////////////////////////////ELLIPSE

          ////////////////////////////////////////////////////////////////////////////////////////FIREBALL

          ////////////////////////////////////////////////////////////////////////////////////////FORMATION

////////////////////////////////////////////////////////////////////////////////////////LUZ

          ////////////////////////////////////////////////////////////////////////////////////////OUTRO

          ////////////////////////////////////////////////////////////////////////////////////////RECT

          ////////////////////////////////////////////////////////////////////////////////////////TRIANG






          ////////////////////////////////////////////////////////////////////////////////////////LUZ
          /*svg.selectAll('path')
          .data(arr_teste_luz) //dados aos quais vamos associar formas/paths
          .enter()
          .append('path').attr('d', function (d, i) {
            //CIRC
              return arcGenerator({
              startAngle: 0.1657780612244898*Math.PI*2,
              endAngle: 0.1657780612244898*Math.PI*2 + 0.22823979591836735*Math.PI*2,
              /*innerRadius: d.tmp,
              outerRadius: d.tmp+2*/
              /*innerRadius: eixoRadial(d),
              outerRadius: eixoRadial(d) + espess
              })
        })
        .style("fill","green");*/
        
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



  
  });




