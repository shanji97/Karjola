/**
 * Funkcionalni testi
 */
(async function EduGeoCache() {
  // Knjižnice
  const { exec } = require("child_process");
  const { describe, it, after, before } = require("mocha");
  const { Builder, By, until } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const expect = require("chai").expect;
  
  // Parametri
  let aplikacijaUrl = "https://sp-lp24-karjola.herokuapp.com/"
  let seleniumStreznikUrl = "http://localhost:4445/wd/hub";
  let brskalnik, jwtZeton;

  const axios = require('axios').create({
    baseURL: aplikacijaUrl + "api/",
    timeout: 5000
  });
  
  // Obvladovanje napak
  process.on("unhandledRejection", (napaka) => {
    console.log(napaka);
  });

  // Počakaj določeno število sekund na zahtevani element na strani
  let pocakajStranNalozena = async (brskalnik, casVS, xpath) => {
    await brskalnik.wait(() => {
      return brskalnik.findElements(By.xpath(xpath)).then(elementi => {
        return elementi[0];
      });
    }, casVS * 1000, `Stran se ni naložila v ${casVS} s.`);
  };

  try {
    before(() => {
      brskalnik = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options()
        .addArguments("start-maximized")
        .addArguments("disable-infobars")
        .addArguments("allow-insecure-localhost")
        .addArguments("allow-running-insecure-content")
      )
      .usingServer(seleniumStreznikUrl)
      .build();
    });

    describe("Domača stran", function() {
      this.timeout(30 * 1000);
      before(() => { brskalnik.get(aplikacijaUrl); });

      it("Besedilo dobrorodošlice", async () => {
        await pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-domaca-stran/div/h1");
        let besedilo = await brskalnik.findElement(
          By.xpath("/html/body/app-ogrodje/div/main/app-domaca-stran/div/h1")
        );
        expect(besedilo).to.not.be.empty;
        expect(await besedilo.getText()).to.have.string(
          "Dobrodošli na Karjoli!"
        );
      });

      it("Sidebar s statistikami", async () => {
        let besedilo = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Statistike')]")
        );
        expect(besedilo).to.not.be.empty;
        expect(await besedilo.getText()).to.have.string(
          "Statistike"
        );
      });

    });

    // Preverjanje prijave
    describe("Prijava", function() {
      this.timeout(30 * 1000);

      it("Izbira prijave", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//a[contains(text(), 'Prijava')]");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Prijava')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      context("ustreznost podatkov na strani za prijavo", function() {

        it("Polje za email naslov", async function() {
          await pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-prijava/div/h2");
          let eposta = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-prijava/div/form/div[1]/div[1]/label"));
          expect(eposta).to.not.be.empty;
          expect(await eposta.getText()).to.be.equal("E-POŠTA *");
        });
        it("Polje za geslo", async function() {
          let geslo = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-prijava/div/form/div[1]/div[2]/label"));
          expect(geslo).to.not.be.empty;
          expect(await geslo.getText()).to.be.equal("GESLO *");
        });
        it("Gumb za prijavo", async function() {
          let gumb = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-prijava/div/form/div[2]/button"));
          expect(gumb).to.not.be.empty;
          expect(await gumb.getText()).to.be.equal("Prijavi se");
        });
        
      });

      context("Prijava uporabnika", function() {

        it("Vnos podatkov uporabnika", async function() {

          let email = await brskalnik.findElement(
            By.xpath("//*[@id='exampleInputEmail1']"));

          expect(email).to.not.be.empty;
          email.sendKeys("nu1234@student.uni-lj.si");

          let geslo = await brskalnik.findElement(By.xpath("//*[@id='exampleInputPassword1']"));
          expect(geslo).to.not.be.empty;
          geslo.sendKeys("Uporabnik1234#");

          let gumb = await brskalnik.findElement(By.xpath("//button[contains(text(), 'Prijavi se')]"));
          expect(gumb).to.not.be.empty;
          gumb.click();
    
        });


        it("pridobi JWT žeton", async function() {
          await pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-domaca-stran/div/h1");
          jwtZeton = await brskalnik.executeScript(function() {
            return localStorage.getItem("karjola-zeton");
          });
          expect(jwtZeton).to.not.be.empty;
        });


        it("Preveri če je uporabnik prijavljen", async function() {
          await pocakajStranNalozena(brskalnik, 10, "//*[@id='toggleNavBar']/div[2]/a");
          let uporabniskaIkona = await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[2]/a"));
          expect(uporabniskaIkona).to.not.be.empty;


        });

      });

    });

    describe("Iskanje", function() {
      this.timeout(30 * 1000);

      it("Iskanje po predmetu Programiranje 1 v navBaru", async () => {
        await pocakajStranNalozena(brskalnik, 10, "//*[@id='toggleNavBar']/div[1]/form/div/input");
        let searchBar = await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[1]/form/div/input")

        );
        expect(searchBar).to.not.be.empty;
        searchBar.sendKeys("Programiranje 1");

        let gumb = await brskalnik.findElement(By.xpath("//*[@id='toggleNavBar']/div[1]/form/div/div/button"));
        expect(gumb).to.not.be.empty;
        await brskalnik.sleep(1000);
        gumb.click();

      });

      context("Prevarjanje zadetkov iskanja", function() {
        it("Programiranje 1 je prvi zadetek", async function() {
          await pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-iskanje/main/div[2]");
          let rezIskanja = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[2]"));
          expect(await rezIskanja.getText()).to.have.string("Rezultati iskanja za: \"Programiranje 1\"");
        });

        it("Najdeno osebje pri predmetu Programiranje 1", async function() {
          let luka = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[4]"));
          // let marko = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[5]"));
          expect(luka).to.not.be.empty;
          // expect(marko).to.not.be.empty;
        });
      });

      context("Filtriranje zadetkov", function() {
        it("Vklop filtrov za osebje in ponovno iskanje", async function() {
          let filtriranjeOseb = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/span/button[2]"));
          expect(filtriranjeOseb).to.not.be.empty;
          filtriranjeOseb.click();

          let searchButton = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[1]/form/div/div/button"));
          expect(searchButton).to.not.be.empty;
          searchButton.click();
        });

        it("Programiranje 1 je prvi zadetek", async function() {
          pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-iskanje/main/div[2]");
          let rezIskanja = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[2]"));
          expect(await rezIskanja.getText()).to.have.string("Rezultati iskanja za: \"Programiranje 1\"");
        });

      });
    });
    
    // Dodajanje in azuriranje elementov
    describe("Dodajanje in brisanje komentarjev", function() {
      this.timeout(30 * 1000);
    

      it("Navigiraj na stran Programiranje 1", async function() {
        await pocakajStranNalozena(brskalnik, 10, "/html/body/app-ogrodje/div/main/app-iskanje/main/div[4]/div");
        let rezIskanja = await brskalnik.findElement(By.xpath("/html/body/app-ogrodje/div/main/app-iskanje/main/div[4]/div"));
        expect(rezIskanja).to.not.be.empty;
        rezIskanja.click();
        
      });
      const gradivo1str = "/html/body/app-ogrodje/div/main/app-predmet/div/div/app-predmet-gradiva/div/app-gradivo[1]";
      context("Komentiranje na gradivo", function() {
        before(async function () {
          var buttonString = "/html/body/app-ogrodje/div/main/app-predmet/div/div/app-predmet-gradiva/div/app-gradivo-upload/button";
          var textareaString = "/html/body/app-ogrodje/div/main/app-predmet/div/div/app-predmet-gradiva/div/app-gradivo-upload/div/textarea";
          
          await pocakajStranNalozena(brskalnik, 10, buttonString);
          var textarea = await brskalnik.findElement(By.xpath(textareaString));
          textarea.sendKeys('https://example.com');
          
          var button = await brskalnik.findElement(By.xpath(buttonString));
          button.click();
        });

        it("Dodajanje komentarja", async function() {
          await pocakajStranNalozena(brskalnik, 10, gradivo1str + "/button");
          let gradivo1 = await brskalnik.findElement(By.xpath(gradivo1str + "/button"));
          expect(gradivo1).to.not.be.empty;
          gradivo1.click();

          await pocakajStranNalozena(brskalnik, 10, gradivo1str + "/div/div/app-nov-komentar/div/textarea");
          let commentBox = await brskalnik.findElement(By.xpath(gradivo1str + "/div/div/app-nov-komentar/div/textarea"));
          expect(commentBox).to.not.be.empty;
          commentBox.sendKeys("Dobro gradivo. Lep pozdrav :)");

          let submitBtn = await brskalnik.findElement(By.xpath(gradivo1str + "/div/div/app-nov-komentar/div/button"));
          expect(submitBtn).to.not.be.empty;
          submitBtn.click();
        });

        it("Preveri ce je bil komentar dodan", async function() {
          await pocakajStranNalozena(brskalnik, 10, gradivo1str + "/div/div/div/app-komentar/p[3]");
          let komentar = await brskalnik.findElement(By.xpath(gradivo1str + "/div/div/div/app-komentar/p[3]"));
          expect(await komentar.getText()).to.have.string("Dobro gradivo. Lep pozdrav :)");
        });

        it("Brisanje komentarja", async function() {
          let deleteBtn = await brskalnik.findElement(By.xpath(gradivo1str + "/div/div/div/app-komentar/button"));
          expect(deleteBtn).to.not.be.empty;
          deleteBtn.click();
        });
        
      });

    });
   
    // Preverjanje odajve
    describe("Odjava uporabnika", function() {
      this.timeout(30 * 1000);


      it("Preveri če je uporabnik prijavljen", async function() {
        let uporabniskaIkona = await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[2]"));
        expect(uporabniskaIkona).to.not.be.empty;
        
      });
      
      it("zahtevaj odjavo", async function() {
        
       await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[2]/a")).click();
        

        
        let gumbOdjava = await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[2]/div/a[2]"));
        expect(gumbOdjava).to.not.be.empty;
        await gumbOdjava.click();
         
      
      });

      it("preveri ali je uporabnik odjavljen", async function() {
        let prijava = await brskalnik.findElement(
          By.xpath("//*[@id='toggleNavBar']/div[1]/a"));
          expect(await prijava.getText()).to.be.equal("Prijava");
      });

    });
  

    after(async () => {
      brskalnik.quit();
    });

  } catch (napaka) {
    console.log("Med testom je prišlo do napake!");
  }
})();