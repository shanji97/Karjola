# Spletno programiranje 2020/2021

Lastni projekt pri predmetu **Spletno programiranje** v študijskem letu **2020/2021**. Repozitoriji ostalih članov, ki so k projektu prispevali: [Jure Pustoslemšek](https://github.com/jurepustos), [Evita Podobnikar](https://github.com/evitapodobnikar), [Eva Gaberšek](https://github.com/gabers-e) in [Jan Krivec](https://github.com/JKrivec).


## 1. LP

Študenti Fakultete za računalništvo in informatiko imamo vedno težave z iskanjem zapiskov in drugega gradiva za učenje. Tovrstno gradivo je včasih težko najti, ali pa je treba iskati na več mestih hkrati. Nekaj gradiva najdemo na spletnih učilnicah, spet drugo gradivo na osebnih straneh profesorjev, nekaj gradiva pa se nahaja v raznih oblačnih storitvah in se izroča tako rekoč iz roke v roko. Zato smo prišli na idejo, da bi postavili spletno stran, ki bo služila kot centralna baza učnega gradiva. Stran bo omogočala nalaganje gradiva v obliki datotek in nalaganja povezav do zunanjih spletnih strani, to gradivo pa bodo drugi lahko komentirali. Tako gradivo kot komentarji bodo moderirani.

Gradivo je kategorizirano po predmetih. Gradivo lahko tudi iščemo po imenih datotek, spletnih naslovih, predmetih ter imenih profesorjev in asistentov.

Če študent želi nalagati gradivo ali ga hoče komentirati, se mora pred tem registrirati. Registrira se lahko izključno z e-poštnim naslovom Univerze v Ljubljani. Ta omejitev je na mestu zaradi potrebe po čim manjši količini neželene vsebine. Za registracijo mora podati še uporabniško ime in geslo.
Po registraciji bo po e-pošti prejel povezavo za potrditev računa. Če je pozabil svoje geslo, lahko klikne na relevantno povezavo, vpiše svoj e-poštni naslov in preko povezave, poslane po e-pošti, nastavi novo geslo. Novo geslo ali uporabniško ime lahko nastavi tudi po prijavi v uporabniških nastavitvah.

Administrator lahko gradivo in sporne komentarje na gradivu briše. Administrator lahko dodaja, ureja in briše vse podatke o predmetih, osebju in modulih.


## 2. LP

Dinamična spletna aplikacija z logiko na strani strežnika


## 3. LP

Dinamična spletna aplikacija s podatkovno bazo

### Povezava do aplikacije v produkcijskem okolju na platformi Heroku

https://sp-lp24-karjola.herokuapp.com/

### Navodila za namestitev in zagon aplikacije v lokalnem okolju s pomočjo orodja Docker

Za zagon aplikacije v okolju Docker je potrebno standardno orodje ``docker-compose``. Za zagon aplikacije se moramo z ukazno vrstico premakniti v korensko mapo repozitorija, nato pa poženemo ukaz `docker-compose up --build` in počakamo, da se avtomatsko izvede izgradnja ter zagon aplikacije in podatkovne baze.


## 4. LP in 5.LP

SPA aplikacija na eni strani

### Povezava do aplikacije v produkcijskem okolju na platformi Heroku

https://sp-lp24-karjola.herokuapp.com/

### Navodila za namestitev in zagon aplikacije v lokalnem okolju s pomočjo orodja Docker

Za zagon aplikacije v okolju Docker je potrebno standardno orodje ``docker-compose`` in ``ng``, orodje za delo z ogrodjem Angular.
Angular aplikacija v repozitoriju je zgrajena za produkcijski strežnik na platformi Heroku, zato jo je pred uporabo v okolju Docker zgraditi za primerno okolje. Zgradimo jo znotraj mape `app_public`, z ukazoma `npm install` in `ng build --configuration docker --output-path build`.
Za zagon aplikacije se moramo z ukazno vrstico premakniti v korensko mapo repozitorija, nato pa poženemo ukaz `docker-compose up --build` in počakamo, da se avtomatsko izvede izgradnja ter zagon aplikacije in podatkovne baze. 
Za uvoz začetnih podatkov v podatkovno bazo navigiramo na naslov `http://localhost:3000/db` in kliknemo na gumb "Uvoz začetnih podatkov". Nato osvežimo stran - stranska vrstica se sicer ne bo osvežila. 
Za brisanje vseh podatkov iz podatkovne baze moramo biti prijavljeni kot administrator, ki ima privzeto uporabniško ime `ad1234@student.uni-lj.si` in geslo `Admin1234#`. Na voljo je tudi eden navaden uporabniški račun z uporabniškim imenom `nu1234@student.uni-lj.si` in geslom `Uporabnik1234#`.


## 5. LP

Varnostno zaščitena progresivna aplikacija

### Vloge uporabnikov

Aplikacija ima poleg stanja neprijavljenega uporabnika dve vrsti prijavljenega uporabnika: navadnega uporabnik in administratorja.
Neprijavljen uporabnik lahko zgolj prijavi posamezna gradiva in komentarje kot neprimerne, lahko pa vidi vse predmetov (ter preko predmetov profesorje in asistente) in vsa vidna gradiva.
Navaden prijavljen uporabnik lahko prijavlja neprimerna gradiva in komentarje, lahko pa tudi objavlja nova gradiva in komentarje na obstoječa gradiva. Svoje lastne komentarje lahko briše (tudi če ga je objavil anonimno), lastnih objavljenih gradiv pa ne more brisati.
Administrator lahko dodaja, spreminja in briše predmete, module in profile osebja (tj. profesorjev in asistentov). Lahko skriva in briše gradiva. Lahko tudi briše komentarje na gradivih. Za posamezna gradiva in komentarje vidi število prijav, vidi pa tudi avtorje komentarjev, tudi če so bili objavljeni anonimno - avtor komentarja je torej skrit pred drugimi uporabniki, ni pa skrit pred administratorjem.

### OWASP ZAP ranljivosti

Skeniranje z OWASP ZAP je odkrilo ranljivosti, za katere smo se odločili, da jih ni smiselno popravljati. Najdene ranljivosti, ki niso navedene tukaj, niso vezane na spletno aplikacijo, ampak na zunanje vire, na katere nimamo vpliva.
- SQL injection: najdena je bila potencialna ranljivost, ki bi omogočala izvajanje poljubnih SQL ukazov v podatkovni bazi. Ta ranljivost v našem primeru ni aktualna - uporabljamo namreč MongoDB, ki ne uporablja jezika SQL.
- Cross-Domain Misconfiguration: ranljivost se navezuje na konfiguracijo API strežnika, ki dovoljuje dostop iz poljubnih virov. Ta konfiguracija je za rabo v našem primeru popolnoma potrebna, saj spletna aplikacija potrebuje dostop do strežnika za opravljanje svoje funkcije.

### Lighthouse priporočila in optimizacija

Analiza orodja Lighthouse je pokazala, da aplikacija sledi dobrim praksam in deluje zadovoljivo hitro.
