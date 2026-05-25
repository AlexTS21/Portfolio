import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  categories = [
    {
      name: 'Web Development',
      skills: [
        { name: 'Angular', level: 70 },
        { name: 'Three.js', level: 65 },
        { name: 'TS/JS', level: 70 },
        { name: 'Blazor', level: 70 },
        { name: 'Django', level: 75 },
        { name: '.Net', level: 65 },
        { name: '.Cypress', level: 65 },
        { name: 'Jasmine', level: 60 },
        { name: 'XUnit', level: 60 },
      ]
    },
    {
      name: 'Machine Learning/Data',
      skills: [
        { name: 'Python', level: 85 },
        { name: 'SQL', level: 70 },
        { name: 'TensorFlow', level: 70 },
        { name: 'Scikit-learn', level: 65 },
        { name: 'MatPlotLib', level: 60 },
        { name: 'Numpy', level: 65 },
        { name: 'Docker', level: 65 },
      ]
    },
  ];
}
