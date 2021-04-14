var gumb_prof_asist = document.querySelector("#objavi-prof-asist");
var gumb_predmeti = document.querySelector("#objavi-predmeti");
var gumb_modul = document.querySelector("#objavi-modul");


// PROFESORJI IN ASISTENTI
gumb_prof_asist.addEventListener("click", function(dogodek) {
    
    var vnosAkademskiNaziv = document.getElementById("formAkademskiNazivInput").value;
    var vnosIzobrazba = document.getElementById("formIzobrazbaCustomInput").value;
    var vnosImeInPriimek = document.getElementById("formImeInPriimekInput").value;
    var vnosOpis = document.getElementById("formOpis").value;
    
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
    var riImePriimek = /\b([A-Ž][-,a-ž. ']+[ ]*)+/;
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

var deleteOsebjeButtons = null;
$(document).ready(function(){
    // Polinka trash can icon z funkcijo za delete in ji passa id osebja
    deleteOsebjeButtons = document.getElementsByName("deleteOsebje");
    for (var i = 0; i < deleteOsebjeButtons.length ; i++) {
        deleteOsebjeButtons[i].addEventListener('click', function(event) {
            deleteOsebjeById(this.id.substr(3));
        });
    }
});

function deleteOsebjeById(id) {
    var deleteRequest = new XMLHttpRequest();
    deleteRequest.open('POST', '/admin/osebje/izbrisi/' + id, true);
    deleteRequest.send(null);
}

// PREDMETI
gumb_predmeti.addEventListener("click", function(dogodek) {
    var vnosImePredmeta = document.getElementById("formImePredmetaInput").value;
    var vnosOpisPredmeta = document.getElementById("formOpisPredmetaInput").value;
    //var vnosProfesor = document.getElementById("formPredmetProfesorInput").value;
    var vnosProfesorjiID = document.getElementById("profInputID").value;
    var vnosAsistentiID = document.getElementById("asistentInputID").value;
    var vnosModuliID = document.getElementById("moduliInputID").value;
    
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
    if ( (vnosImePredmeta.length == 0) || (vnosOpisPredmeta.length == 0) || vnosAsistentiID.length == 0 || vnosProfesorjiID.length == 0 ) {
        var opozoriloEmptyPolja = document.getElementById("alert-predmeti");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }
});

var deletePredmetButtons = null;
$(document).ready(function(){
    // Polinka trash can icon z funkcijo za delete in ji passa id predmeta
    deletePredmetButtons = document.getElementsByName("deletePredmet");
    for (var i = 0; i < deletePredmetButtons.length ; i++) {
        deletePredmetButtons[i].addEventListener('click', function(event) {
            deletePredmetById(this.id.substr(3));
        });
    }
});

function deletePredmetById(id) {
    var deleteRequest = new XMLHttpRequest();
    deleteRequest.open('POST', '/admin/predmeti/izbrisi/' + id, true);
    deleteRequest.send(null);
}


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

var deleteModulButtons = null;
//var modifyModulButtons = null;
$(document).ready(function(){

    // Polinka trash can icon z funkcijo za delete in ji passa id modula
    deleteModulButtons = document.getElementsByName("deleteModul");
    for (var i = 0; i < deleteModulButtons.length ; i++) {
        deleteModulButtons[i].addEventListener('click', function(event) {
            deleteModulById(this.id.substr(3));
        });
    }
});


function deleteModulById(id) {
    var deleteRequest = new XMLHttpRequest();
    deleteRequest.open('POST', '/admin/moduli/izbrisi/' + id, true);
    /*
    deleteRequest.addEventListener('load', function(){
    });
    */
    deleteRequest.send(null);
}

// Adding names into input fields when selecting from osebje dropdowns
function dodajProf() {
    const profInput = document.getElementById("profInput");
    const profInputID = document.getElementById("profInputID");
    var selectedProf = document.getElementById("profDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedProf) {
            profInput.value += selectedProf + '; ';
            profInputID.value += opts[i].id.substr(12) + '; ';
            break;
        }
    }
}
// Red X buttons to clear values
document.getElementById("deleteProf").addEventListener("click", function(event){
    profInput.value = '';
    profInputID.value = '';
});

function dodajAsistent() {
    const asistentInput = document.getElementById("asistentInput");
    const asistentInputID = document.getElementById("asistentInputID");
    var selectedAsistent = document.getElementById("asistentDropdown").value;
    var opts = document.getElementById('osebje').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedAsistent) {
            asistentInput.value += selectedAsistent + '; ';
            asistentInputID.value += opts[i].id.substr(12)  + '; ';
            break;
        }
    }
}

function preveriNovoImeModul(modulId) {
    console.log("id: "+modulId);
    const input = document.getElementById("novoImeModulaInput" + modulId);
    const warning = document.getElementById("alert-moduli-posodobi-" + modulId);
    console.log(input + "; " + warning);
    if (input.value === "") {
        warning.style.display = "block";
        setTimeout(function() {    
            warning.style.display = "none";
        }, 5000);
        //prevent default
        return false;
    }
    return true;

}
// Red X buttons to clear values
document.getElementById("deleteAsistent").addEventListener("click", function(event){
    asistentInput.value = '';
    asistentInputID.value = '';
});

function dodajModul() {
    const moduliInput = document.getElementById("moduliInput");
    const moduliInputID = document.getElementById("moduliInputID");
    var selectedModul = document.getElementById("moduliDropdown").value;
    var opts = document.getElementById('moduli').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === selectedModul) {
            moduliInput.value += selectedModul + '; ';
            moduliInputID.value += opts[i].id.substr(13)  + '; ';
            break;
        }
    }
}
// Red X buttons to clear values
document.getElementById("deleteModuli").addEventListener("click", function(event){
    moduliInput.value = '';
    moduliInputID.value = '';
});