import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {
  scrolled = false;
  menuOpen = false;
  links = ['About', 'Projects', 'Skills', 'Contact'];

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 60; }

  scrollTo(section: string) {
    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }
}
