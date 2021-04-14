"use strict";

$(document).ready(function(){

   const emptyAlert = document.getElementById("commentEmpty");
   const successAlert = document.getElementById("commentSuccess");
   emptyAlert.style.display = "none";
   successAlert.style.display = "none";

   // Pred oddajo komentarja poglej ce je polje za komentar prazno
   document.getElementById("submitComment").addEventListener("click", function(event){
        var komentar = document.getElementById("komentar");
        if (komentar.value === '' || komentar.value === null) {
            emptyAlert.style.display = "block";
            setTimeout(function(){    
               emptyAlert.style.display = "none";
            },3000);

        } else {
            successAlert.style.display = "block";
            komentar.value = '';
            setTimeout(function(){    
                successAlert.style.display = "none";
             },3000);
            console.log("Comment sent to server");
        }
        
    });

});
