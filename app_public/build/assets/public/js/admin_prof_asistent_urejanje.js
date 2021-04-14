var zelen_gumb = document.querySelector("#zelen-gumb");
var rdec_gumb = document.querySelector("#rdec-gumb");

// ZELEN GUMB: POSODOBITEV PODATKOV ZA OSEBO
zelen_gumb.addEventListener("click", function(dogodek) {
    var allSuccessful = true;

    var vnosAkademskiNaziv = document.getElementById("formAkademskiNazivInput").value;
    var vnosIzobrazba = document.getElementById("formIzobrazbaInput").value;
    var vnosImeInPriimek = document.getElementById("formImeInPriimekInput").value;
    var vnosOpis = document.getElementById("textAreaOpis").value;

    // preveri ustreznost izobrazbe
    var riIzobrazba = /(dipl|mag|dr)\.\s(([a-zčšž]+\.|[a-zčšž]+)\s?)+/;
    var preveriIzobrazbo = riIzobrazba.test(vnosIzobrazba);
    if (!preveriIzobrazbo) {
        allSuccessful = false;
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
        allSuccessful = false;
        var opozoriloImePriimek = document.getElementById("alert-ime-priimek");
        opozoriloImePriimek.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {
            opozoriloImePriimek.style.display = "none";
        }, 5000);
    }

    // preveri, ali so izpolnjena vsa polja
    if ( (vnosAkademskiNaziv.length == 0) || (vnosIzobrazba.length == 0) || (vnosImeInPriimek.length == 0) || (vnosOpis.length == 0) ) {
        allSuccessful = false;
        var opozoriloEmptyPolja = document.getElementById("alert-empty-polja");
        opozoriloEmptyPolja.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {
            opozoriloEmptyPolja.style.display = "none";
        }, 5000);
    }

    /*
    // preveri, ali je slika nalozena
    if (slika_input.files.length == 0) {
        allSuccessful = false;
        var opozoriloNiSlike = document.getElementById("alert-ni-slike");
        opozoriloNiSlike.style.display = "block";
        dogodek.preventDefault();
        setTimeout(function() {
            opozoriloNiSlike.style.display = "none";
        }, 5000);
    }
    */

    if (allSuccessful) {
        posodobiOsebo();
        // dodaj opozorilo, da je oseba uspesno spremenjena
        var opozoriloUspesnaPosodobitev = document.getElementById("alert-oseba-posodobljena");
        opozoriloUspesnaPosodobitev.style.display = "block";
        setTimeout(function() {
            opozoriloUspesnaPosodobitev.style.display = "none";
        }, 5000);
    }

});

function posodobiOsebo() {
    const idOseba = document.getElementById("idOseba").innerHTML;
    const akademskiNaziv = document.getElementById("formAkademskiNazivInput").value;
    const izobrazba = document.getElementById("formIzobrazbaInput").value;
    const imePriimek = document.getElementById("formImeInPriimekInput").value;
    const opis = document.getElementById("textAreaOpis").value;

    var data = {
        id: idOseba,
        akademskiNaziv: akademskiNaziv,
        izobrazba: izobrazba,
        ime_priimek: imePriimek,
        opis: opis
    };
    var dataString = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/osebje/' + idOseba + '/nastavitve', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(dataString);
}

// RDEC GUMB: IZBRIS OSEBE
rdec_gumb.addEventListener("click", function(dogodek) {

    //pridobi id osebe
    const osebaId = document.getElementById("idOseba").innerHTML;
    var imeOsebe = document.getElementById("formImeInPriimekInput").value;

    const confirmNiz = "Ali ste prepričani, da želite izbrisati osebo "+imeOsebe+"?";
    if (confirm(confirmNiz)) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/osebje/' + osebaId + '/izbrisi', true);
        xhr.onreadystatechange = function () {
            if (xhr.status === 201) {
                window.location = "/admin";
            }
        };
        xhr.send(null);
    }
});


// PREVERI, ALI JE NALOZENA SLIKA V USTREZNEM FORMATU!
/*
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
*/
