import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-performance-chart',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.scss']
})
export class PerformanceChartComponent implements OnInit {
  @Input() stakeRating = 97;
  public lineChartData: ChartDataSets[] = [
    {data: [65, 66, 67, 70, 59, 80, 81, 56, 55]},
  ];
  public lineChartLabels: Label[] = ['January', '', '', '', 'February', '', '', '', 'March'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    elements: {
      line: {cubicInterpolationMode: 'monotone', tension: 0}
    },
    maintainAspectRatio: false
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#945CE5',
    },
  ];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
  rangeDates: FormGroup;


  constructor() {
  }

  ngOnInit() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.rangeDates = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });
  }

}
