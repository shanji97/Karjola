

$(document).ready(function () {
     $('#changeUsernameForm').submit(function (event) {
         var formData = new FormData(this);

         var username = formData.get('username');
         console.log(username);
         if(username == ""){
             prikaziObvestilo("Uporabniško ime je obvezen parameter!"," Uporabniško ime mora biti izpolnjeno","danger");event.preventDefault();
         }
    
     });
   $('#changePasswordForm').submit(function (event) {
        var formData = new FormData(this);

        var trenutnoGeslo = formData.get('trenutnoGeslo');
        var novoGeslo = formData.get('novoGeslo');
        var potrdiNovoGeslo = formData.get('potrdiNovoGeslo');

        if(trenutnoGeslo == "" || novoGeslo =="" || potrdiNovoGeslo ==""){
            prikaziObvestilo("Izpolni vsa polja!", " Vsa polja morajo biti izpolnjena!","danger"); event.preventDefault();
        } 
        
        if (!validatePassword(novoGeslo)) {
            prikaziObvestilo('Uredi geslo po zahtevah!', 'Geslo mora biti sestavljeno iz najmanj 8 znakov - vsaj ene velike in ene male tiskane črke, ene številke ter enega posebnega znaka.', 'danger');
            event.preventDefault();
        }
        else if (novoGeslo != potrdiNovoGeslo) {
            prikaziObvestilo('Gesli nista enaki!', 'Potrditev gesla mora biti enako kot novo geslo', 'danger');
            event.preventDefault();
        }
    });
});

function validatePassword(password) {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}/;
    if (regex.test(password)) {
        return true;
    }

    return false;
}

function contains(password, chars) {
    for (i = 0; i < password.length; i++) {
        var char = password.charAt(i);

        if (allowedChars.indexOf(char) >= 0) return true;
    }
 
    return false;
}

function prikaziObvestilo(opozornilnoBesediloStrong, opozorilnoBesedilo = "",tipOpozorila){

    //tipi opozoril so danger, warning, succes, info -> od vsakega je v htmlju en primerek
    document.getElementsByClassName("alert-" + tipOpozorila)[0].style.display="block";
    document.getElementById(tipOpozorila + "-strong").innerHTML = opozornilnoBesediloStrong;
    document.getElementById(tipOpozorila + "-navadno").innerHTML = opozorilnoBesedilo;

    setTimeout(function(){    
        document.getElementsByClassName("alert-"+tipOpozorila)[0].style.display = "none";
    },5000);

}
