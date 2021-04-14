"use strict";

Chart.defaults.global.defaultFontColor = "white";
Chart.defaults.global.defaultFontSize =  (window.innerHeight > window.innerWidth && !['iPad Simulator','iPad'].includes(navigator.platform))? 10 : 20;
var barve = [],barve2 = [], oznake = [], vrednostiOznak = [], oznake2 = [], vrednostiOznak2 = [];

function generirajBarve(podatki){
    var crke  = '0123456789ABCDEF';
    var barva = '#';
    var barve = [];
    for(var i = 0; i < podatki;i++){

        do{
            barva = '#';
            for(var j = 0; j<6; j++){
                barva += crke[Math.floor(Math.random()*16)];
            }
           
        }while (barve.includes(barva))
      
        barve.push(barva);    
    }
    return barve;
}

function vrniJSON(url) {
    return new Promise(function(uspesno, napaka) {
      var zahteva = new XMLHttpRequest();
      zahteva.open("GET", url, true);
      zahteva.addEventListener("load", function() {
        if (zahteva.status < 400){            
          uspesno(zahteva.responseText);
        }
        else
          napaka(new Error("Napačna zahteva"));
      });
      zahteva.addEventListener("error", function() {
        napaka(new Error("Neuspešna povezava"));
      });
      zahteva.send(null);
    });
  }

  vrniJSON("/api/uporabniki").then(function(besedilo) {
   
    var uporabniki = JSON.parse(besedilo);
    for(var i = 0; i < uporabniki.length; i++){
        var kraj = uporabniki[i].kraj;
        if(!oznake.includes(kraj)){
            oznake.push(kraj);
            vrednostiOznak.push(0);
        }
        vrednostiOznak[oznake.indexOf(kraj)]++;
    }
        barve = generirajBarve(oznake.length);
        console.log(barve);
        var chart2 = new Chart(document.getElementById("razporeditevUporabnikov").getContext("2d"),{
            type: 'pie',
            data: {
                labels: oznake,
                datasets: [{
                    label: 'razporeditev uporabnikov po obcinah',
                    data: vrednostiOznak,
                    backgroundColor: barve,
                    borderColor: barve,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
  }, function(napaka) {
    console.log("Napaka pri pridobivanju podatkov: " + napaka);
  });
  vrniJSON("/api/predmeti").then(function(besedilo) {
   
    var predmeti = JSON.parse(besedilo);

    for(var i = 0; i < predmeti.length; i++){

            oznake2.push(predmeti[i].ime);
            vrednostiOznak2.push(predmeti[i].stGradiv);
       
    }
        barve2 = generirajBarve(oznake2.length);
        console.log(barve);
        var chart3 = new Chart(document.getElementById("steviloGradiv").getContext("2d"),{
            type: 'pie',
            data: {
                labels: oznake2,
                datasets: [{
                    label: 'razporeditev uporabnikov po obcinah',
                    data: vrednostiOznak2,
                    backgroundColor: barve,
                    borderColor: barve,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
  }, function(napaka) {
    console.log("Napaka pri pridobivanju podatkov: " + napaka);
  });
