import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAgentEtatProfil } from 'app/entities/agent-etat-profil/agent-etat-profil.model';
import { AgentEtatProfilService } from 'app/entities/agent-etat-profil/service/agent-etat-profil.service';
import { IGerant } from '../gerant.model';
import { GerantService } from '../service/gerant.service';
import { GerantFormService, GerantFormGroup } from './gerant-form.service';

@Component({
  standalone: true,
  selector: 'jhi-gerant-update',
  templateUrl: './gerant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GerantUpdateComponent implements OnInit {
  isSaving = false;
  gerant: IGerant | null = null;

  agentEtatProfilsSharedCollection: IAgentEtatProfil[] = [];

  editForm: GerantFormGroup = this.gerantFormService.createGerantFormGroup();

  constructor(
    protected gerantService: GerantService,
    protected gerantFormService: GerantFormService,
    protected agentEtatProfilService: AgentEtatProfilService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAgentEtatProfil = (o1: IAgentEtatProfil | null, o2: IAgentEtatProfil | null): boolean =>
    this.agentEtatProfilService.compareAgentEtatProfil(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gerant }) => {
      this.gerant = gerant;
      if (gerant) {
        this.updateForm(gerant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gerant = this.gerantFormService.getGerant(this.editForm);
    if (gerant.id !== null) {
      this.subscribeToSaveResponse(this.gerantService.update(gerant));
    } else {
      this.subscribeToSaveResponse(this.gerantService.create(gerant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGerant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(gerant: IGerant): void {
    this.gerant = gerant;
    this.gerantFormService.resetForm(this.editForm, gerant);

    this.agentEtatProfilsSharedCollection = this.agentEtatProfilService.addAgentEtatProfilToCollectionIfMissing<IAgentEtatProfil>(
      this.agentEtatProfilsSharedCollection,
      gerant.agentEtatProfil,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.agentEtatProfilService
      .query()
      .pipe(map((res: HttpResponse<IAgentEtatProfil[]>) => res.body ?? []))
      .pipe(
        map((agentEtatProfils: IAgentEtatProfil[]) =>
          this.agentEtatProfilService.addAgentEtatProfilToCollectionIfMissing<IAgentEtatProfil>(
            agentEtatProfils,
            this.gerant?.agentEtatProfil,
          ),
        ),
      )
      .subscribe((agentEtatProfils: IAgentEtatProfil[]) => (this.agentEtatProfilsSharedCollection = agentEtatProfils));
  }
}
