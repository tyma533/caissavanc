import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../agent-etat-profil.test-samples';

import { AgentEtatProfilService, RestAgentEtatProfil } from './agent-etat-profil.service';

const requireRestSample: RestAgentEtatProfil = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('AgentEtatProfil Service', () => {
  let service: AgentEtatProfilService;
  let httpMock: HttpTestingController;
  let expectedResult: IAgentEtatProfil | IAgentEtatProfil[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AgentEtatProfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AgentEtatProfil', () => {
      const agentEtatProfil = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(agentEtatProfil).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AgentEtatProfil', () => {
      const agentEtatProfil = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(agentEtatProfil).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AgentEtatProfil', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AgentEtatProfil', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AgentEtatProfil', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAgentEtatProfilToCollectionIfMissing', () => {
      it('should add a AgentEtatProfil to an empty array', () => {
        const agentEtatProfil: IAgentEtatProfil = sampleWithRequiredData;
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing([], agentEtatProfil);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agentEtatProfil);
      });

      it('should not add a AgentEtatProfil to an array that contains it', () => {
        const agentEtatProfil: IAgentEtatProfil = sampleWithRequiredData;
        const agentEtatProfilCollection: IAgentEtatProfil[] = [
          {
            ...agentEtatProfil,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing(agentEtatProfilCollection, agentEtatProfil);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AgentEtatProfil to an array that doesn't contain it", () => {
        const agentEtatProfil: IAgentEtatProfil = sampleWithRequiredData;
        const agentEtatProfilCollection: IAgentEtatProfil[] = [sampleWithPartialData];
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing(agentEtatProfilCollection, agentEtatProfil);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agentEtatProfil);
      });

      it('should add only unique AgentEtatProfil to an array', () => {
        const agentEtatProfilArray: IAgentEtatProfil[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const agentEtatProfilCollection: IAgentEtatProfil[] = [sampleWithRequiredData];
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing(agentEtatProfilCollection, ...agentEtatProfilArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const agentEtatProfil: IAgentEtatProfil = sampleWithRequiredData;
        const agentEtatProfil2: IAgentEtatProfil = sampleWithPartialData;
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing([], agentEtatProfil, agentEtatProfil2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agentEtatProfil);
        expect(expectedResult).toContain(agentEtatProfil2);
      });

      it('should accept null and undefined values', () => {
        const agentEtatProfil: IAgentEtatProfil = sampleWithRequiredData;
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing([], null, agentEtatProfil, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agentEtatProfil);
      });

      it('should return initial array if no AgentEtatProfil is added', () => {
        const agentEtatProfilCollection: IAgentEtatProfil[] = [sampleWithRequiredData];
        expectedResult = service.addAgentEtatProfilToCollectionIfMissing(agentEtatProfilCollection, undefined, null);
        expect(expectedResult).toEqual(agentEtatProfilCollection);
      });
    });

    describe('compareAgentEtatProfil', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAgentEtatProfil(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAgentEtatProfil(entity1, entity2);
        const compareResult2 = service.compareAgentEtatProfil(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAgentEtatProfil(entity1, entity2);
        const compareResult2 = service.compareAgentEtatProfil(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAgentEtatProfil(entity1, entity2);
        const compareResult2 = service.compareAgentEtatProfil(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
