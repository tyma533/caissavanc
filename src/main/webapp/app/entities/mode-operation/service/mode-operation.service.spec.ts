import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IModeOperation } from '../mode-operation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mode-operation.test-samples';

import { ModeOperationService, RestModeOperation } from './mode-operation.service';

const requireRestSample: RestModeOperation = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('ModeOperation Service', () => {
  let service: ModeOperationService;
  let httpMock: HttpTestingController;
  let expectedResult: IModeOperation | IModeOperation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ModeOperationService);
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

    it('should create a ModeOperation', () => {
      const modeOperation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(modeOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ModeOperation', () => {
      const modeOperation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(modeOperation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ModeOperation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ModeOperation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ModeOperation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addModeOperationToCollectionIfMissing', () => {
      it('should add a ModeOperation to an empty array', () => {
        const modeOperation: IModeOperation = sampleWithRequiredData;
        expectedResult = service.addModeOperationToCollectionIfMissing([], modeOperation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(modeOperation);
      });

      it('should not add a ModeOperation to an array that contains it', () => {
        const modeOperation: IModeOperation = sampleWithRequiredData;
        const modeOperationCollection: IModeOperation[] = [
          {
            ...modeOperation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addModeOperationToCollectionIfMissing(modeOperationCollection, modeOperation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ModeOperation to an array that doesn't contain it", () => {
        const modeOperation: IModeOperation = sampleWithRequiredData;
        const modeOperationCollection: IModeOperation[] = [sampleWithPartialData];
        expectedResult = service.addModeOperationToCollectionIfMissing(modeOperationCollection, modeOperation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(modeOperation);
      });

      it('should add only unique ModeOperation to an array', () => {
        const modeOperationArray: IModeOperation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const modeOperationCollection: IModeOperation[] = [sampleWithRequiredData];
        expectedResult = service.addModeOperationToCollectionIfMissing(modeOperationCollection, ...modeOperationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const modeOperation: IModeOperation = sampleWithRequiredData;
        const modeOperation2: IModeOperation = sampleWithPartialData;
        expectedResult = service.addModeOperationToCollectionIfMissing([], modeOperation, modeOperation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(modeOperation);
        expect(expectedResult).toContain(modeOperation2);
      });

      it('should accept null and undefined values', () => {
        const modeOperation: IModeOperation = sampleWithRequiredData;
        expectedResult = service.addModeOperationToCollectionIfMissing([], null, modeOperation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(modeOperation);
      });

      it('should return initial array if no ModeOperation is added', () => {
        const modeOperationCollection: IModeOperation[] = [sampleWithRequiredData];
        expectedResult = service.addModeOperationToCollectionIfMissing(modeOperationCollection, undefined, null);
        expect(expectedResult).toEqual(modeOperationCollection);
      });
    });

    describe('compareModeOperation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareModeOperation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareModeOperation(entity1, entity2);
        const compareResult2 = service.compareModeOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareModeOperation(entity1, entity2);
        const compareResult2 = service.compareModeOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareModeOperation(entity1, entity2);
        const compareResult2 = service.compareModeOperation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
