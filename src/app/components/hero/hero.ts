import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animId!: number;
  private clock = new THREE.Clock();


  private surfaceMesh!: THREE.Mesh;
  private wireframeMesh!: THREE.Mesh;
  private ballMesh!: THREE.Mesh;
  private trailPoints: THREE.Vector3[] = [];
  private trailLine!: THREE.Line;
  private particles!: THREE.Points;


  private ballX = 2.8;
  private ballZ = 2.2;
  private ballVX = 0;
  private ballVZ = 0;
  private descPhase = 0; 
  private phaseTimer = 0;
  private lr = 0.05;
  private momentum = 0.88;
  private gradAccX = 0;
  private gradAccZ = 0;

  mouseX = 0; 
  mouseY = 0;

  ngAfterViewInit() {
    this.initScene();
    this.animate();
    window.addEventListener('mousemove', this.onMouse.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    this.renderer?.dispose();
    window.removeEventListener('mousemove', this.onMouse.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onMouse(e: MouseEvent) {
    this.mouseX = (e.clientX / window.innerWidth - 0.5);
    this.mouseY = -(e.clientY / window.innerHeight - 0.5);
  }

  
  lossFunc(x: number, z: number): number {
    const r2 = x * x + z * z;
    const base = 0.18 * r2;
    const ripple = 0.55 * Math.sin(x * 1.1) * Math.cos(z * 1.1) * Math.exp(-0.08 * r2);
    const valley = 0.3 * Math.cos(x * 0.7 + z * 0.5) * Math.exp(-0.06 * r2);
    const saddle = 0.15 * Math.sin(x * 2.2) * Math.sin(z * 1.8) * Math.exp(-0.15 * r2);
    return base + ripple + valley + saddle;
  }

  gradient(x: number, z: number) {
    const h = 0.001;
    return {
      gx: (this.lossFunc(x + h, z) - this.lossFunc(x - h, z)) / (2 * h),
      gz: (this.lossFunc(x, z + h) - this.lossFunc(x, z - h)) / (2 * h)
    };
  }

  initScene() {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(7, 10.5, 9);
    this.camera.lookAt(0, 0, 0);


    const res = 80;
    const size = 6;
    const geo = new THREE.PlaneGeometry(size * 2, size * 2, res, res);
    const pos = geo.attributes['position'];


    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); 
      const y = this.lossFunc(x, z);
      pos.setZ(i, y); 

    
      const t = Math.min(y / 2.5, 1);
      const r = 0.88 - t * 0.35;
      const g = 0.96 - t * 0.18;
      const b = 0.88 - t * 0.38;
      colors[i * 3]     = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.55,
      metalness: 0.1,
      side: THREE.FrontSide,
    });

    this.surfaceMesh = new THREE.Mesh(geo, mat);
    this.surfaceMesh.rotation.x = -Math.PI / 2;
    this.surfaceMesh.receiveShadow = true;
    this.scene.add(this.surfaceMesh);

    const wGeo = new THREE.PlaneGeometry(size * 2, size * 2, 28, 28);
    const wPos = wGeo.attributes['position'];
    for (let i = 0; i < wPos.count; i++) {
      wPos.setZ(i, this.lossFunc(wPos.getX(i), wPos.getY(i)));
    }
    wGeo.computeVertexNormals();
    const wMat = new THREE.MeshBasicMaterial({
      color: 0x5ec87a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    this.wireframeMesh = new THREE.Mesh(wGeo, wMat);
    this.wireframeMesh.rotation.x = -Math.PI / 2;
    this.wireframeMesh.position.y = 0.005;
    this.scene.add(this.wireframeMesh);

    const ballGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x289445,
      emissive: 0x38b25a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.5,
    });
    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.scene.add(this.ballMesh);

    const haloGeo = new THREE.TorusGeometry(0.22, 0.015, 8, 40);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xbda6ce, transparent: true, opacity: 0.55 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.ballMesh.add(halo);

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(300 * 3), 3));
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x289445,
      transparent: true,
      opacity: 0.65,
      linewidth: 2,
    });
    this.trailLine = new THREE.Line(trailGeo, trailMat);
    this.scene.add(this.trailLine);

    const pGeo = new THREE.BufferGeometry();
    const pCount = 600;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = Math.random() * 8 - 1;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x8ddba0,
      size: 0.07,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(4, 10, 6);
    sun.castShadow = true;
    const fill = new THREE.PointLight(0xb8eac5, 2.5, 20);
    fill.position.set(-4, 4, -4);
    const ballLight = new THREE.PointLight(0x38b25a, 3, 4);
    this.ballMesh.add(ballLight);
    this.scene.add(ambient, sun, fill);
  }

  updateBall() {
    if (this.descPhase === 0) {
      const { gx, gz } = this.gradient(this.ballX, this.ballZ);

      const noise = 0.04;
      const noisyGx = gx + (Math.random() - 0.5) * noise;
      const noisyGz = gz + (Math.random() - 0.5) * noise;

      this.gradAccX = this.momentum * this.gradAccX + this.lr * noisyGx;
      this.gradAccZ = this.momentum * this.gradAccZ + this.lr * noisyGz;

      this.ballX -= this.gradAccX;
      this.ballZ -= this.gradAccZ;

      const bound = 5.5;
      this.ballX = Math.max(-bound, Math.min(bound, this.ballX));
      this.ballZ = Math.max(-bound, Math.min(bound, this.ballZ));

      const y = this.lossFunc(this.ballX, this.ballZ);
      this.ballMesh.position.set(this.ballX, y + 0.16, this.ballZ);

      if (this.trailPoints.length === 0 ||
          this.trailPoints[this.trailPoints.length-1].distanceTo(this.ballMesh.position) > 0.06) {
        this.trailPoints.push(this.ballMesh.position.clone());
        if (this.trailPoints.length > 100) this.trailPoints.shift();
        this.updateTrail();
      }

      const gradMag = Math.sqrt(gx * gx + gz * gz);
      if (gradMag < 0.008) {
        this.descPhase = 1;
        this.phaseTimer = 0;
      }
    } else if (this.descPhase === 1) {
      // Pause at minimum — ball pulses
      this.phaseTimer++;
      if (this.phaseTimer > 140) {
        this.descPhase = 2;
      }
    } else {
      this.ballX = (Math.random() - 0.5) * 5 + (Math.random() > 0.5 ? 3.5 : -2.5);
      this.ballZ = (Math.random() - 0.5) * 5 + (Math.random() > 0.5 ? 3 : -2);
      this.gradAccX = 0; this.gradAccZ = 0;
      this.trailPoints = [];
      this.updateTrail();
      this.descPhase = 0;
    }
  }

  updateTrail() {
    const pts = this.trailPoints;
    const bufAttr = this.trailLine.geometry.attributes['position'] as THREE.BufferAttribute;
    const arr = bufAttr.array as Float32Array;
    arr.fill(0);
    pts.forEach((p, i) => {
      arr[i * 3]     = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    bufAttr.needsUpdate = true;
    this.trailLine.geometry.setDrawRange(0, pts.length);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    this.updateBall();

    if (this.descPhase === 1) {
      const s = 1 + 0.12 * Math.sin(t * 8);
      this.ballMesh.scale.setScalar(s);
    } else {
      this.ballMesh.scale.setScalar(1);
    }

    const orbitAngle = t * 0.06;
    const baseX = Math.sin(orbitAngle) * 1.5 + this.mouseX * 1.2;
    const baseZ = Math.cos(orbitAngle) * 1.5 + 9;
    this.camera.position.x += (baseX - this.camera.position.x) * 0.025 ;
    this.camera.position.y += (5.5 + this.mouseY * 1.5 - this.camera.position.y) * 0.025 ;
    this.camera.position.z += (baseZ - this.camera.position.z) * 0.025;
    this.camera.lookAt(0, 0.5, 0);

    const pPos = this.particles.geometry.attributes['position'] as THREE.BufferAttribute;
    const arr = pPos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += 0.005;
      if (arr[i + 1] > 7) arr[i + 1] = -1;
    }
    pPos.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }
}

