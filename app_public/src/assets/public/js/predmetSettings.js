"use strict";

$(document).ready(function(){

    const emptyNameAlert = document.getElementById("emptyNameAlert");
    const emptyProfAlert = document.getElementById("emptyProfAlert");
    const emptyDescAlert = document.getElementById("emptyDescAlert");
    const successAlert = document.getElementById("successAlert");

    const predmetNameInput = document.getElementById("predmetNameInput");
    const descInput = document.getElementById("descInput");
    const profInput = document.getElementById("profInput");
    const profInputId = document.getElementById("profInputId");
    const asistentInput = document.getElementById("asistentInput");
    const asistentInputId = document.getElementById("asistentInputId");
    const modulInput = document.getElementById("modulInput");
    const modulInputId = document.getElementById("modulInputId");
    // hide alerts
    emptyNameAlert.style.display = "none";
    emptyProfAlert.style.display = "none";
    emptyDescAlert.style.display = "none";
    successAlert.style.display = "none";

    // Red X buttons to clear values
    document.getElementById("deleteProf").addEventListener("click", function(event){
        profInput.value = '';
        profInputId.value = '';
    });

    document.getElementById("deleteAsistent").addEventListener("click", function(event){
        asistentInput.value = '';
        asistentInputId.value = '';
    });
    
    document.getElementById("deleteModul").addEventListener("click", function(event){
        modulInput.value = '';
        modulInputId.value = '';
    });

    // When clicking save
    document.getElementById("shraniSpremembe").addEventListener("click", function(event){
        var allSuccessful = true;
        if (predmetNameInput.value === '') {
            allSuccessful = false;
            alert(emptyNameAlert, 3000);
        }
        if (profInput.value === '') {
            allSuccessful = false;
            alert(emptyProfAlert, 3000);
        }
        if (descInput.value === '') {
            allSuccessful = false;
            alert(emptyDescAlert, 3000);
        }
        if (allSuccessful) {
            posodobiPredmet();
            alert(successAlert, 3000);
        }
    
    });

    // When clicking delete
    document.getElementById("izbrisiPredmet").addEventListener("click", function(event){
        const confirmNiz = "Ali ste prepričani da želite izbrisati predmet " + predmetNameInput.value +"?\n\nČe izbrišete predmet boste izbrisali tudi vso vsebino predmeta!";
        if (confirm(confirmNiz)) {
            const predmetId = document.getElementById("predmetId").innerHTML;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/predmeti/' + predmetId + '/izbrisi', true);
            xhr.onreadystatechange = function () {
                if (xhr.status === 201) {
                    console.log("nigger");
                    window.location = "/admin";
                }
            }
            xhr.send(null);
        }
    });

    // Functions to make code a little more readable
    function alert(alert,timeout) {
        alert.style.display = "block";
        setTimeout(function(){    
            alert.style.display = "none";
        },timeout);
    }
});

// Adding names into input fields when selecting from osebje dropdowns
function dodajProf() {
    const selectedProf = document.getElementById("profDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedProf) {
            profInput.value += selectedProf + '; ';
            profInputId.value += opts[i].id.substr(-24) + '; ';
            break;
        }
    }
}
function dodajAsistent() {
    const selectedAsistent = document.getElementById("asistentDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedAsistent) {
            asistentInput.value += selectedAsistent + '; ';
            asistentInputId.value += opts[i].id.substr(-24) + '; ';
            break;
        }
    }
}

function dodajModul() {
    const selectedModul = document.getElementById("modulDropdown").value;
    var opts = document.getElementById('moduli').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedModul) {
            modulInput.value += selectedModul + '; ';
            modulInputId.value += opts[i].id.substr(-24) + '; ';
            break;
        }
    }
}

function formatirajZaVpis(tip, niz) {
    if (tip === 'letnik') {
        switch(niz) {
            case '1. letnik':
                return 1;
            case '2. letnik':
                return 2;
            case '3. letnik':
                return 3;
            case 'Ni v letniku':
                return 0;     
        }
    } else if (tip === 'semester') {
        switch(niz) {
            case 'Zimski semester':
                return 1;
            case 'Poletni semester':
                return 2;
        }
    } else if (tip === 'vrstaIzbirnega') {
        switch(niz) {
            case 'Splošni izbirni predmet':
                return 1;
            case 'Strokovni izbirni predmet':
                return 2;
            case 'Ni izbirni predmet':
                return 0;
        }
    }
    return -1;
}

function posodobiPredmet() {
    const predmetId = document.getElementById("predmetId").innerHTML;
    const ime = document.getElementById("predmetNameInput").value;
    const letnik = document.getElementById("izberiLetnik").innerHTML;
    const semester = document.getElementById("izberiSemester").innerHTML;
    const vrstaIzbirnega = document.getElementById("izberiTip").innerHTML;
    const opis = document.getElementById("descInput").value;
    
    var data = {
        predmetId: predmetId,
        ime: ime,
        letnik: formatirajZaVpis('letnik', letnik),
        semester: formatirajZaVpis('semester', semester),
        vrstaIzbirnega: formatirajZaVpis('vrstaIzbirnega', vrstaIzbirnega),
        opis: opis,
        asistenti: asistentInputId.value,
        profesorji: profInputId.value,
        moduli: modulInputId.value
    };
    var dataString = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/predmeti/' + predmetId + '/nastavitve', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload(); 
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(dataString);

}



function izberiLetnik() {
    var selectedLetnik = document.getElementById("izberiLetnik").value;
    console.log("selected");
}

$(function(){
    $("#letnikDropdown").on('click', 'li a', function(){
      $("#izberiLetnik").text($(this).text());
      $("#izberiLetnik").val($(this).text());
   });
});

$(function(){
    $("#tipDropdown").on('click', 'li a', function(){
      $("#izberiTip").text($(this).text());
      $("#izberiTip").val($(this).text());
   });
});

$(function(){
    $("#semesterDropdown").on('click', 'li a', function(){
      $("#izberiSemester").text($(this).text());
      $("#izberiSemester").val($(this).text());
   });
});
