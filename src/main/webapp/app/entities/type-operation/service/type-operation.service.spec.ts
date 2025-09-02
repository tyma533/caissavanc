import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeOperation } from '../type-operation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type-operation.test-samples';

import { TypeOperationService, RestTypeOperation } from './type-operation.service';

const requireRestSample: RestTypeOperation = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('TypeOperation Service', () => {
  let service: TypeOperationService;
  let httpMock: HttpTestingController;
  let expectedResult: ITypeOperation | ITypeOperation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeOperationService);
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

    it('should create a TypeOperation', () => {
      const typeOperation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(typeOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeOperation', () => {
      const typeOperation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(typeOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeOperation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeOperation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TypeOperation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypeOperationToCollectionIfMissing', () => {
      it('should add a TypeOperation to an empty array', () => {
        const typeOperation: ITypeOperation = sampleWithRequiredData;
        expectedResult = service.addTypeOperationToCollectionIfMissing([], typeOperation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeOperation);
      });

      it('should not add a TypeOperation to an array that contains it', () => {
        const typeOperation: ITypeOperation = sampleWithRequiredData;
        const typeOperationCollection: ITypeOperation[] = [
          {
            ...typeOperation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypeOperationToCollectionIfMissing(typeOperationCollection, typeOperation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeOperation to an array that doesn't contain it", () => {
        const typeOperation: ITypeOperation = sampleWithRequiredData;
        const typeOperationCollection: ITypeOperation[] = [sampleWithPartialData];
        expectedResult = service.addTypeOperationToCollectionIfMissing(typeOperationCollection, typeOperation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeOperation);
      });

      it('should add only unique TypeOperation to an array', () => {
        const typeOperationArray: ITypeOperation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typeOperationCollection: ITypeOperation[] = [sampleWithRequiredData];
        expectedResult = service.addTypeOperationToCollectionIfMissing(typeOperationCollection, ...typeOperationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeOperation: ITypeOperation = sampleWithRequiredData;
        const typeOperation2: ITypeOperation = sampleWithPartialData;
        expectedResult = service.addTypeOperationToCollectionIfMissing([], typeOperation, typeOperation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeOperation);
        expect(expectedResult).toContain(typeOperation2);
      });

      it('should accept null and undefined values', () => {
        const typeOperation: ITypeOperation = sampleWithRequiredData;
        expectedResult = service.addTypeOperationToCollectionIfMissing([], null, typeOperation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeOperation);
      });

      it('should return initial array if no TypeOperation is added', () => {
        const typeOperationCollection: ITypeOperation[] = [sampleWithRequiredData];
        expectedResult = service.addTypeOperationToCollectionIfMissing(typeOperationCollection, undefined, null);
        expect(expectedResult).toEqual(typeOperationCollection);
      });
    });

    describe('compareTypeOperation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTypeOperation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTypeOperation(entity1, entity2);
        const compareResult2 = service.compareTypeOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTypeOperation(entity1, entity2);
        const compareResult2 = service.compareTypeOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTypeOperation(entity1, entity2);
        const compareResult2 = service.compareTypeOperation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
