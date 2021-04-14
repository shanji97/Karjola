// nekje beleži downloade vključno z mesecem in letom
//seštej downloade za tam kjer je enak mesec in leto
Chart.defaults.global.defaultFontColor = "white";
Chart.defaults.global.defaultFontSize =  (window.innerHeight > window.innerWidth && !['iPad Simulator','iPad'].includes(navigator.platform))? 10 : 20;

var context1 = document.getElementById("steviloPrenosov").getContext("2d")
var chart1 = new Chart(document.getElementById("steviloPrenosov").getContext("2d"),{
    type: 'bar',
    data: {
        labels: ['November 2020', 'December 2020', 'Januar 2020', 'Februar 2020'],
        datasets: [{
            label: ' število prenosov datotek',
            data: [100, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#83D856',
                '#D9D74C',
                '#D94141',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                '#83D856',
                '#D9D74C',
                '#D94141',
                'rgba(75, 192, 192, 1)',      
            ],
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
//chart2
//gremo čez vse userje in preverimo njihov kraj, če kraja še ni v tabeli povečamo counter v i-tem mesto v arrayju.
//za vsak label generiraj color in ga daj v string.
var char2= new Chart(document.getElementById("razporeditevUporabnikov").getContext("2d"),{
    type: 'pie',
    data: {
        labels: ['Ljubljana', 'Maribor', 'Lendava', 'Murska Sobota'],
        datasets: [{
            label: ' število prenosov datotek',
            data: [100, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#83D856',
                '#D9D74C',
                '#D94141',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                '#83D856',
                '#D9D74C',
                '#D94141',
                'rgba(75, 192, 192, 1)',      
            ],
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