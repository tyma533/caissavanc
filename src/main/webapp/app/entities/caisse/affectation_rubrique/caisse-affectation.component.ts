import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICaisse } from '../caisse.model';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';
import { CaisseService } from '../service/caisse.service';
import { forkJoin } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-caisse-affectation',
  templateUrl: './caisse-affectation.component.html',
  styleUrls: ['./caisse-affectation.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CaisseAffectationComponent implements OnInit {
  caisse: ICaisse | null = null;
  rubriquesAffectees: IRubrique[] = [];
  rubriquesNonAffectees: IRubrique[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private caisseService: CaisseService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const caisseId = +params['id'];
      this.loadCaisse(caisseId);
      this.loadRubriques(caisseId);
    });
  }

  loadCaisse(caisseId: number): void {
    this.caisseService.getCaisse(caisseId).subscribe(caisse => (this.caisse = caisse));
  }

  loadRubriques(caisseId: number): void {
    this.caisseService.getRubriquesAffectees(caisseId).subscribe(data => {
      this.rubriquesAffectees = data.map(r => ({ ...r, selected: false }));
    });
    this.caisseService.getRubriquesNonAffectees(caisseId).subscribe(data => {
      this.rubriquesNonAffectees = data.map(r => ({ ...r, selected: false }));
    });
  }

  affecterSelected(): void {
    const selected = this.rubriquesNonAffectees.filter(r => r.selected);

    if (selected.length === 0) return; // rien à affecter

    // Crée un tableau d'observables pour chaque requête
    const requests = selected.map(r => this.caisseService.affecterRubrique(this.caisse!.id!, r.id!));
    console.log('Caisse ID:', this.caisse!.id);
    // Attendre que toutes les requêtes soient terminées
    forkJoin(requests).subscribe(() => {
      this.loadRubriques(this.caisse!.id!); // recharge les rubriques après l'affectation
    });
  }

  desaffecterSelected(): void {
    const selected = this.rubriquesAffectees.filter(r => r.selected);

    if (selected.length === 0) return;

    const requests = selected.map(r => this.caisseService.desaffecterRubrique(this.caisse!.id!, r.id!));
    console.log('Caisse ID:', this.caisse!.id);
    forkJoin(requests).subscribe(() => {
      this.loadRubriques(this.caisse!.id!); // recharge les rubriques après désaffectation
    });
  }

  previousState(): void {
    this.router.navigate(['/caisse']);
  }
}
