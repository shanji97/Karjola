import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartFontOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { PovezavaService } from '../../storitve/povezava.service';
import { UporabnikPodatkiStoritev } from '../../storitve/uporabnik-podatki.service';


import { UporabnikPodrobnosti } from '../../razredi/uporabnik';
@Component({
  selector: 'app-statistike',
  templateUrl: './statistike.component.html',
  styleUrls: ['./statistike.component.css']
})
export class StatistikeComponent implements OnInit {

  public sporocilo: string;
  public uporabniki: UporabnikPodrobnosti[];

  //Naše spremenljivke
  public barve: string[];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      labels:{
          fontColor: '#FFF',
          fontSize: (window.innerHeight > window.innerWidth && !['iPad Simulator','iPad'].includes(navigator.platform))? 10 : 20
      },
    },
    defaultColor:'#FFF',
    
    tooltips:{
      backgroundColor:'white',
      callbacks:{
        labelTextColor:function(tooltipItem, chart) { 
          return "black";
        }
      }
    },
    
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      }
    }
  };
  public pieChartFontOptions: ChartFontOptions = {
    defaultFontColor: '#FFF'
  }
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [];
  constructor(
    private povezavaStoritev: PovezavaService,
    private uporabnikPodatkiStoritev: UporabnikPodatkiStoritev
  ) { }

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public pridobiUporabnike = (): void => {
    this.sporocilo = "Nalagam grafikone....";
    this.uporabnikPodatkiStoritev
      .pridobiUporabnike()
      .then(najdeniUporabniki => {
        this.sporocilo = najdeniUporabniki.length > 0 ? "Izrisujem graf...." : "Ni informacij o uporabnikih. Posledično ne morem prikazati tega grafa.";
        this.uporabniki = najdeniUporabniki;
        
        //generiramo barve za pieChart colors
        this.barve = this.generirajBarve(this.uporabniki.length);
 
        for (var i = 0; i < this.uporabniki.length; i++) {
            console.log(this.barve[i]);
          
          var kraj = this.uporabniki[i].kraj;
          if (!this.pieChartLabels.includes(kraj)) {
            this.pieChartLabels.push(kraj);
            this.pieChartData.push(0);
          }
          this.pieChartData[this.pieChartLabels.indexOf(kraj)]++;
        }
  
        this.pieChartColors =[
          {backgroundColor: this.barve},
      ];
        this.sporocilo ="";

      });
  }
  ngOnInit() {

    while(!this.jePovezava())
    this.sporocilo = "Čakam na internetno povezavo....";
    this.pridobiUporabnike();
  }

  private generirajBarve(steviloPodatkov: number): string[] {

    var crke = '0123456789ABCDEF';
    var barva = '#';
    var barve = [];
    for (var i = 0; i < steviloPodatkov; i++) {

      do {
        barva = '#';
        for (var j = 0; j < 6; j++) {
          barva += crke[Math.floor(Math.random() * 16)];
        }

      } while (barve.includes(barva))

      barve.push(barva);
    }
    return barve;
  }


}
