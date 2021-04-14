var form_prof_asist = document.querySelector("form");
var zelen_gumb = document.querySelector("#zelen-gumb");
var rdec_gumb = document.querySelector("#rdec-gumb");


zelen_gumb.addEventListener("click", function(dogodek) {
    //console.log(slika_input.files);
    
    var vnosAkademskiNaziv = form_prof_asist.elements.formAkademskiNazivInput.value;
    var vnosIzobrazba = form_prof_asist.elements.formIzobrazbaInput.value;
    var vnosImeInPriimek = form_prof_asist.elements.formImeInPriimekInput.value;
    var vnosOpis = form_prof_asist.elements.textAreaOpis.value;
    
    
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
        var opozoriloEmptyPolja = document.getElementById("alert-empty-polja");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {    
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }
    
    
    // preveri, ali je slika nalozena
    if (slika_input.files.length == 0) {
        var opozoriloNiSlike = document.getElementById("alert-ni-slike");
        opozoriloNiSlike.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {
            opozoriloNiSlike.style.display = "none";
        }, 5000);
    }
});


// IZBRISI VSE VNOSE
rdec_gumb.addEventListener("click", function(dogodek) {
    form_prof_asist.elements.formAkademskiNazivInput.value = "";
    form_prof_asist.elements.formIzobrazbaInput.value = "";
    form_prof_asist.elements.formImeInPriimekInput.value = "";
    form_prof_asist.elements.textAreaOpis.value = "";
    document.getElementById("slika-input").value = null;
});


// PREVERI, ALI JE NALOZENA SLIKA V USTREZNEM FORMATU!
var slika_input = document.querySelector("#slika-input");
var dovoljeni_tipi_slik = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

slika_input.addEventListener("change", function(dogodek) {
    var dovoljen_tip = false;
    if (slika_input.files.length > 0) {
        var datoteka = slika_input.files[0];
        if (datoteka.type) {
            for (var i = 0; i < dovoljeni_tipi_slik.length; i++) {
                if (datoteka.type == dovoljeni_tipi_slik[i]) {
                    dovoljen_tip = true;
                }
            }
        }
    }
    if (!dovoljen_tip) {
        var opozoriloNapacnaSlika = document.getElementById("alert-napacna-slika");
        opozoriloNapacnaSlika.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {
            opozoriloNapacnaSlika.style.display = "none";
        }, 5000);
    }
});