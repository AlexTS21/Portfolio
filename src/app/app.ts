import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Nav } from './components/nav/nav';
import { About } from './components/about/about';
import { Projects } from "./components/projects/projects";
import { Skills } from "./components/skills/skills";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hero, Nav, About, Projects, Skills],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements  OnInit, OnDestroy {
  cursorX = 0; cursorY = 0;
  ringX = 0; ringY = 0;
  animFrame: any;

  ngOnInit() {
    this.animateCursor();
    setTimeout(() => this.initScrollObserver(), 600);
  }

  ngOnDestroy() { cancelAnimationFrame(this.animFrame); }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) { this.cursorX = e.clientX; this.cursorY = e.clientY; }

  animateCursor() {
    this.ringX += (this.cursorX - this.ringX) * 0.12;
    this.ringY += (this.cursorY - this.ringY) * 0.12;
    const dot = document.querySelector('.cursor__dot') as HTMLElement;
    const ring = document.querySelector('.cursor__ring') as HTMLElement;
    if (dot) { dot.style.left = this.cursorX + 'px'; dot.style.top = this.cursorY + 'px'; }
    if (ring) { ring.style.left = this.ringX + 'px'; ring.style.top = this.ringY + 'px'; }
    this.animFrame = requestAnimationFrame(() => this.animateCursor());
  }

  initScrollObserver() {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }
}
