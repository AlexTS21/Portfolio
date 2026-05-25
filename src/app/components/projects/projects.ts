import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  active = 0;
  projects = [
    {
      title: 'WITEMA',
      tag: 'ML Web',
      year: '2025',
      desc: 'Web app tool to classify emotions and key topics',
      tech: ['Django', 'Transformers', 'HTML/Css'],
      color: '#22c55e',
      link: 'https://witema.onrender.com/'
    },
    {
      title: 'Article publication',
      tag: 'AI',
      year: '2025',
      desc: 'Publication on Computing Science: Pix2Pix Architecture Optimization: A Study of Layer Reduction and Image Quality ” Received: March 14, 2025 ',
      tech: ['Tensorflow', 'Python', 'Jupyter'],
      color: '#4ade80',
      link: 'https://rcs.cic.ipn.mx/2025_154_7/Optimizacion%20de%20la%20arquitectura%20Pix2Pix_%20Un%20estudio%20de%20reduccion%20de%20capas%20y%20calidad%20de%20imagen.pdf'
    },
    {
      title: 'Numerical Analysis App',
      tag: 'Web',
      year: '2025',
      desc: 'Web application for solving mathematical and numerical analysis problems, including integration methods, interpolation, equation systems, root-finding algorithms, and function visualization',
      tech: ['.Net', 'Blazor', 'js', 'HTML/Css'],
      color: '#86efac',
      link: 'https://iblastm.github.io/MetodosNumericosPage/'
    },
    {
      title: 'Predictive Analytics SaaS',
      tag: 'Web ML',
      year: '2024',
      desc: 'Web-based test for the preliminary detection of diabetes using supervised learning (decision trees) with 94% accuracy',
      tech: ['Django', 'Html/Css'],
      color: '#16a34a',
      link: 'https://test-diabetes.netlify.app/'
    },
  ];
}
