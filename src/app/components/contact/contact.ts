import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  currentYear = new Date().getFullYear();

  socials = [
    { icon: 'GH', label: 'GitHub', url: 'https://github.com/AlexTS21' },
    { icon: 'LI', label: 'LinkedIn', url: 'https://www.linkedin.com/in/tejeda-s%C3%A1nchez-jos%C3%A9-alejandro-6a2901280/' },
  ];
}
