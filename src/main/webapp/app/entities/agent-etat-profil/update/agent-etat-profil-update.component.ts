import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAgent } from 'app/entities/agent/agent.model';
import { AgentService } from 'app/entities/agent/service/agent.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { AgentEtatProfilService } from '../service/agent-etat-profil.service';
import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { AgentEtatProfilFormService, AgentEtatProfilFormGroup } from './agent-etat-profil-form.service';

@Component({
  standalone: true,
  selector: 'jhi-agent-etat-profil-update',
  templateUrl: './agent-etat-profil-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AgentEtatProfilUpdateComponent implements OnInit {
  isSaving = false;
  agentEtatProfil: IAgentEtatProfil | null = null;

  agentsSharedCollection: IAgent[] = [];
  etablissementsSharedCollection: IEtablissement[] = [];

  editForm: AgentEtatProfilFormGroup = this.agentEtatProfilFormService.createAgentEtatProfilFormGroup();

  constructor(
    protected agentEtatProfilService: AgentEtatProfilService,
    protected agentEtatProfilFormService: AgentEtatProfilFormService,
    protected agentService: AgentService,
    protected etablissementService: EtablissementService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAgent = (o1: IAgent | null, o2: IAgent | null): boolean => this.agentService.compareAgent(o1, o2);

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agentEtatProfil }) => {
      this.agentEtatProfil = agentEtatProfil;
      if (agentEtatProfil) {
        this.updateForm(agentEtatProfil);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agentEtatProfil = this.agentEtatProfilFormService.getAgentEtatProfil(this.editForm);
    if (agentEtatProfil.id !== null) {
      this.subscribeToSaveResponse(this.agentEtatProfilService.update(agentEtatProfil));
    } else {
      this.subscribeToSaveResponse(this.agentEtatProfilService.create(agentEtatProfil));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgentEtatProfil>>): void {
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

  protected updateForm(agentEtatProfil: IAgentEtatProfil): void {
    this.agentEtatProfil = agentEtatProfil;
    this.agentEtatProfilFormService.resetForm(this.editForm, agentEtatProfil);

    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing<IAgent>(
      this.agentsSharedCollection,
      agentEtatProfil.agent,
    );
    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
      this.etablissementsSharedCollection,
      agentEtatProfil.etablissement,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.agentService
      .query()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agents: IAgent[]) => this.agentService.addAgentToCollectionIfMissing<IAgent>(agents, this.agentEtatProfil?.agent)))
      .subscribe((agents: IAgent[]) => (this.agentsSharedCollection = agents));

    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
            etablissements,
            this.agentEtatProfil?.etablissement,
          ),
        ),
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));
  }
}
