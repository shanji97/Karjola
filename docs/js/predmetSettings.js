"use strict";

$(document).ready(function(){

    const emptyNameAlert = document.getElementById("emptyNameAlert");
    const emptyProfAlert = document.getElementById("emptyProfAlert");
    const emptyDescAlert = document.getElementById("emptyDescAlert");
    const successAlert = document.getElementById("successAlert");

    const predmetNameInput = document.getElementById("predmetNameInput");
    const descInput = document.getElementById("descInput");
    const profInput = document.getElementById("profInput");
    const asistentInput = document.getElementById("asistentInput");
    const modulInput = document.getElementById("modulInput");
    // hide alerts
    emptyNameAlert.style.display = "none";
    emptyProfAlert.style.display = "none";
    emptyDescAlert.style.display = "none";
    successAlert.style.display = "none";

    // Red X buttons to clear values
    document.getElementById("deleteProf").addEventListener("click", function(event){
        profInput.value = '';
    });

    document.getElementById("deleteAsistent").addEventListener("click", function(event){
        asistentInput.value = '';
    });
    
    document.getElementById("deleteModul").addEventListener("click", function(event){
        modulInput.value = '';
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
            alert(successAlert, 3000);
        }
    
    });

    // When clicking delete
    document.getElementById("izbrisiPredmet").addEventListener("click", function(event){
        if (confirm('Are you sure?\nOnce deleted, you can\'t go back.')) {
            console.log('predmet izbrisan :(');
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
    var selectedProf = document.getElementById("profDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedProf) {
            profInput.value += selectedProf + '; ';
            break;
        }
    }
}
function dodajAsistent() {
    var selectedAsistent = document.getElementById("asistentDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedAsistent) {
            asistentInput.value += selectedAsistent + '; ';
            break;
        }
    }
}

function dodajModul() {
    var selectedModul = document.getElementById("modulDropdown").value;
    var opts = document.getElementById('moduli').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedModul) {
            modulInput.value += selectedModul + '; ';
            break;
        }
    }
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
