import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtatOperation } from '../etat-operation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../etat-operation.test-samples';

import { EtatOperationService, RestEtatOperation } from './etat-operation.service';

const requireRestSample: RestEtatOperation = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('EtatOperation Service', () => {
  let service: EtatOperationService;
  let httpMock: HttpTestingController;
  let expectedResult: IEtatOperation | IEtatOperation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtatOperationService);
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

    it('should create a EtatOperation', () => {
      const etatOperation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(etatOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EtatOperation', () => {
      const etatOperation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(etatOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EtatOperation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EtatOperation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EtatOperation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEtatOperationToCollectionIfMissing', () => {
      it('should add a EtatOperation to an empty array', () => {
        const etatOperation: IEtatOperation = sampleWithRequiredData;
        expectedResult = service.addEtatOperationToCollectionIfMissing([], etatOperation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etatOperation);
      });

      it('should not add a EtatOperation to an array that contains it', () => {
        const etatOperation: IEtatOperation = sampleWithRequiredData;
        const etatOperationCollection: IEtatOperation[] = [
          {
            ...etatOperation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEtatOperationToCollectionIfMissing(etatOperationCollection, etatOperation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EtatOperation to an array that doesn't contain it", () => {
        const etatOperation: IEtatOperation = sampleWithRequiredData;
        const etatOperationCollection: IEtatOperation[] = [sampleWithPartialData];
        expectedResult = service.addEtatOperationToCollectionIfMissing(etatOperationCollection, etatOperation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etatOperation);
      });

      it('should add only unique EtatOperation to an array', () => {
        const etatOperationArray: IEtatOperation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const etatOperationCollection: IEtatOperation[] = [sampleWithRequiredData];
        expectedResult = service.addEtatOperationToCollectionIfMissing(etatOperationCollection, ...etatOperationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etatOperation: IEtatOperation = sampleWithRequiredData;
        const etatOperation2: IEtatOperation = sampleWithPartialData;
        expectedResult = service.addEtatOperationToCollectionIfMissing([], etatOperation, etatOperation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etatOperation);
        expect(expectedResult).toContain(etatOperation2);
      });

      it('should accept null and undefined values', () => {
        const etatOperation: IEtatOperation = sampleWithRequiredData;
        expectedResult = service.addEtatOperationToCollectionIfMissing([], null, etatOperation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etatOperation);
      });

      it('should return initial array if no EtatOperation is added', () => {
        const etatOperationCollection: IEtatOperation[] = [sampleWithRequiredData];
        expectedResult = service.addEtatOperationToCollectionIfMissing(etatOperationCollection, undefined, null);
        expect(expectedResult).toEqual(etatOperationCollection);
      });
    });

    describe('compareEtatOperation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEtatOperation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEtatOperation(entity1, entity2);
        const compareResult2 = service.compareEtatOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEtatOperation(entity1, entity2);
        const compareResult2 = service.compareEtatOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEtatOperation(entity1, entity2);
        const compareResult2 = service.compareEtatOperation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
