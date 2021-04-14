"use strict";

$(document).ready(function(){
    $("form[data-form=komentarForm]").on("submit", function(event){
        var komentar = $(this).find("[name=komentar]");
        var emptyAlert = $(this).find("[data-alert=commentEmpty]");

        if (!komentar.val() || komentar.val() == '') {
            showAlertFor3sec(emptyAlert[0]);
            event.preventDefault();
        }
        
    });

    $("form[data-form=uploadForm]").on("submit", upload);
});

const emptyFileAlert = document.getElementById("fileEmpty");
const cantHaveBothAlert = document.getElementById("fileCantHaveBoth");
const tooManyfilesAlert = document.getElementById("tooManyfiles");
const tooBigFileAlert = document.getElementById("tooBigFile");
const invalidUrlAlert = document.getElementById("invalidUrl");
const textField = document.getElementById("fileName");

var fileSize = 0;

// Povej uporabniku katera datoteka je pripravljena na upload in njena velikost.
// Ce Poizkusa dodati vec kot eno datoteko ga obvesti
function getFile() {
    const dokumenti = document.getElementById("inputFile").files;

    if (dokumenti.length > 1) {
        showAlertFor3sec(tooManyfilesAlert);
    } else {
        if (dokumenti == undefined || dokumenti[0] == undefined) return;
        var file = dokumenti[0];
        fileSize = bytesToMBytes(file.size);
        textField.innerHTML = file.name +', '+ fileSize +'Mb';
    }
    
}

function upload(event) {
    const dokumenti = document.getElementById("inputFile").files;
    const link = document.getElementById("link").value;

    // Oboje prazno
    if (dokumenti.length == 0 && link == '') {
        showAlertFor3sec(emptyFileAlert);
        event.preventDefault();
        return;
    }
    // Poskusa uploadat oboje hkrati
    if (dokumenti.length != 0 && link != '') {
        showAlertFor3sec(cantHaveBothAlert);
        event.preventDefault();
        return;
    }
    
    // podan je link
    if (link != '') {
        if (!isValidHttpUrl(link)) {
            showAlertFor3sec(invalidUrlAlert);
            event.preventDefault();
        }
    } else {
        // Prevelika datoteka
        if (bytesToMBytes(dokumenti[0].size) > 16){
            showAlertFor3sec(tooBigFileAlert);
            event.preventDefault();
            return;
        }
    }
   
}


function bytesToMBytes(bytes) { 
    return Math.round((bytes / (1024**2)) * 100) / 100 
}

function showAlertFor3sec(alert) {
    alert.style.display = "block";
    setTimeout(function(){    
        alert.style.display = "none";
    },3000);
}

function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
 