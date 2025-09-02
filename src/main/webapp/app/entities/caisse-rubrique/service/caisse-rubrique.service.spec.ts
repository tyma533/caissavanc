import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaisseRubrique } from '../caisse-rubrique.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../caisse-rubrique.test-samples';

import { CaisseRubriqueService, RestCaisseRubrique } from './caisse-rubrique.service';

const requireRestSample: RestCaisseRubrique = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('CaisseRubrique Service', () => {
  let service: CaisseRubriqueService;
  let httpMock: HttpTestingController;
  let expectedResult: ICaisseRubrique | ICaisseRubrique[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CaisseRubriqueService);
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

    it('should create a CaisseRubrique', () => {
      const caisseRubrique = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(caisseRubrique).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CaisseRubrique', () => {
      const caisseRubrique = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(caisseRubrique).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CaisseRubrique', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CaisseRubrique', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CaisseRubrique', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCaisseRubriqueToCollectionIfMissing', () => {
      it('should add a CaisseRubrique to an empty array', () => {
        const caisseRubrique: ICaisseRubrique = sampleWithRequiredData;
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing([], caisseRubrique);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caisseRubrique);
      });

      it('should not add a CaisseRubrique to an array that contains it', () => {
        const caisseRubrique: ICaisseRubrique = sampleWithRequiredData;
        const caisseRubriqueCollection: ICaisseRubrique[] = [
          {
            ...caisseRubrique,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing(caisseRubriqueCollection, caisseRubrique);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CaisseRubrique to an array that doesn't contain it", () => {
        const caisseRubrique: ICaisseRubrique = sampleWithRequiredData;
        const caisseRubriqueCollection: ICaisseRubrique[] = [sampleWithPartialData];
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing(caisseRubriqueCollection, caisseRubrique);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caisseRubrique);
      });

      it('should add only unique CaisseRubrique to an array', () => {
        const caisseRubriqueArray: ICaisseRubrique[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const caisseRubriqueCollection: ICaisseRubrique[] = [sampleWithRequiredData];
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing(caisseRubriqueCollection, ...caisseRubriqueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caisseRubrique: ICaisseRubrique = sampleWithRequiredData;
        const caisseRubrique2: ICaisseRubrique = sampleWithPartialData;
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing([], caisseRubrique, caisseRubrique2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caisseRubrique);
        expect(expectedResult).toContain(caisseRubrique2);
      });

      it('should accept null and undefined values', () => {
        const caisseRubrique: ICaisseRubrique = sampleWithRequiredData;
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing([], null, caisseRubrique, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caisseRubrique);
      });

      it('should return initial array if no CaisseRubrique is added', () => {
        const caisseRubriqueCollection: ICaisseRubrique[] = [sampleWithRequiredData];
        expectedResult = service.addCaisseRubriqueToCollectionIfMissing(caisseRubriqueCollection, undefined, null);
        expect(expectedResult).toEqual(caisseRubriqueCollection);
      });
    });

    describe('compareCaisseRubrique', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCaisseRubrique(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCaisseRubrique(entity1, entity2);
        const compareResult2 = service.compareCaisseRubrique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCaisseRubrique(entity1, entity2);
        const compareResult2 = service.compareCaisseRubrique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCaisseRubrique(entity1, entity2);
        const compareResult2 = service.compareCaisseRubrique(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
