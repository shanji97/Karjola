var prvi_form_prof_asist = document.querySelector("form");
var gumb_prof_asist = document.querySelector("#objavi-prof-asist");
var gumb_predmeti = document.querySelector("#objavi-predmeti");
var gumb_modul = document.querySelector("#objavi-modul");

// PROFESORJI IN ASISTENTI
gumb_prof_asist.addEventListener("click", function(dogodek) {
    var vnosAkademskiNaziv = prvi_form_prof_asist.elements.formAkademskiNazivInput.value;
    var vnosIzobrazba = prvi_form_prof_asist.elements.formIzobrazbaCustomInput.value;
    var vnosImeInPriimek = prvi_form_prof_asist.elements.formImeInPriimekInput.value;
    var vnosOpis = prvi_form_prof_asist.elements.formOpis.value;
    
    
    // preveri ustreznost izobrazbe
    var riIzobrazba = /(dipl|mag|dr)\.\s(([a-zčšž]+\.|[a-zčšž]+)\s?)+/;
    var preveriIzobrazbo = riIzobrazba.test(vnosIzobrazba);
    if (!preveriIzobrazbo) {
        var opozoriloIzobrazba = document.getElementById("alert-izobrazba");
        opozoriloIzobrazba.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloIzobrazba.style.display = "none";
        }, 5000);
    }
    
    
    // preveri ustreznost imena in priimka
    var riImePriimek = /\b([A-Z][-,a-z. ']+[ ]*)+/;
    var preveriImePriimek = riImePriimek.test(vnosImeInPriimek);
    if(!preveriImePriimek) {
        var opozoriloImePriimek = document.getElementById("alert-ime-priimek");
        opozoriloImePriimek.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloImePriimek.style.display = "none";
        }, 5000);
    }
    

    // preveri, ali so izpolnjena vsa polja
    if ( (vnosAkademskiNaziv.length == 0) || (vnosIzobrazba.length == 0) || (vnosImeInPriimek.length == 0) || (vnosOpis.length == 0) ) {
        var opozoriloEmptyPolja = document.getElementById("alert-prof-asist");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }
});

// PREDMETI
gumb_predmeti.addEventListener("click", function(dogodek) {
    var vnosImePredmeta = document.getElementById("formImePredmetaInput").value;
    var vnosOpisPredmeta = document.getElementById("formOpisPredmetaInput").value;
    //var vnosProfesor = document.getElementById("formPredmetProfesorInput").value;
    
    var vsiAsistenti = document.getElementsByClassName("form-check-input");
    var asistentChecked = false;
    for (var i=0; i<vsiAsistenti.length; i++) {
        var vnosPosamezenAsistent = vsiAsistenti[i].id;
        if (document.getElementById(vnosPosamezenAsistent).checked) {
            asistentChecked = true;
        }
    }
    
    /*
    var vnosLetnik = document.getElementById("formLetnikInput").value;
    var vnosModul = document.getElementById("formModulInput").value;
    var vnosVrstaIzbirnegaPredmeta = document.getElementById("formVrstaIzbirnegaInput").value;
    var vnosSemester = document.getElementById("formSemesterInput").value;
    */

    // preveri, ali so izpolnjena vsa polja
    if ( (vnosImePredmeta.length == 0) || (vnosOpisPredmeta.length == 0) || (asistentChecked == false) ) {
        var opozoriloEmptyPolja = document.getElementById("alert-predmeti");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }
});


// MODULI
gumb_modul.addEventListener("click", function(dogodek) {
    var vnosModul = document.getElementById("formImeModulaInput").value;
    
    // preveri, ali je polje izpolnjeno
    if (vnosModul.length == 0) {
        var opozoriloEmptyPolja = document.getElementById("alert-moduli");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }
});