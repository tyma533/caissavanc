import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaisse } from '../caisse.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../caisse.test-samples';

import { CaisseService, RestCaisse } from './caisse.service';

const requireRestSample: RestCaisse = {
  ...sampleWithRequiredData,
  dateCreationCaisse: sampleWithRequiredData.dateCreationCaisse?.toJSON(),
  dateFermiture: sampleWithRequiredData.dateFermiture?.toJSON(),
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('Caisse Service', () => {
  let service: CaisseService;
  let httpMock: HttpTestingController;
  let expectedResult: ICaisse | ICaisse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CaisseService);
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

    it('should create a Caisse', () => {
      const caisse = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(caisse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caisse', () => {
      const caisse = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(caisse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caisse', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caisse', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Caisse', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCaisseToCollectionIfMissing', () => {
      it('should add a Caisse to an empty array', () => {
        const caisse: ICaisse = sampleWithRequiredData;
        expectedResult = service.addCaisseToCollectionIfMissing([], caisse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caisse);
      });

      it('should not add a Caisse to an array that contains it', () => {
        const caisse: ICaisse = sampleWithRequiredData;
        const caisseCollection: ICaisse[] = [
          {
            ...caisse,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCaisseToCollectionIfMissing(caisseCollection, caisse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caisse to an array that doesn't contain it", () => {
        const caisse: ICaisse = sampleWithRequiredData;
        const caisseCollection: ICaisse[] = [sampleWithPartialData];
        expectedResult = service.addCaisseToCollectionIfMissing(caisseCollection, caisse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caisse);
      });

      it('should add only unique Caisse to an array', () => {
        const caisseArray: ICaisse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const caisseCollection: ICaisse[] = [sampleWithRequiredData];
        expectedResult = service.addCaisseToCollectionIfMissing(caisseCollection, ...caisseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caisse: ICaisse = sampleWithRequiredData;
        const caisse2: ICaisse = sampleWithPartialData;
        expectedResult = service.addCaisseToCollectionIfMissing([], caisse, caisse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caisse);
        expect(expectedResult).toContain(caisse2);
      });

      it('should accept null and undefined values', () => {
        const caisse: ICaisse = sampleWithRequiredData;
        expectedResult = service.addCaisseToCollectionIfMissing([], null, caisse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caisse);
      });

      it('should return initial array if no Caisse is added', () => {
        const caisseCollection: ICaisse[] = [sampleWithRequiredData];
        expectedResult = service.addCaisseToCollectionIfMissing(caisseCollection, undefined, null);
        expect(expectedResult).toEqual(caisseCollection);
      });
    });

    describe('compareCaisse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCaisse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCaisse(entity1, entity2);
        const compareResult2 = service.compareCaisse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCaisse(entity1, entity2);
        const compareResult2 = service.compareCaisse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCaisse(entity1, entity2);
        const compareResult2 = service.compareCaisse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
