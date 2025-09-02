import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IControle } from '../controle.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../controle.test-samples';

import { ControleService, RestControle } from './controle.service';

const requireRestSample: RestControle = {
  ...sampleWithRequiredData,
  dateControle: sampleWithRequiredData.dateControle?.toJSON(),
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('Controle Service', () => {
  let service: ControleService;
  let httpMock: HttpTestingController;
  let expectedResult: IControle | IControle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ControleService);
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

    it('should create a Controle', () => {
      const controle = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(controle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Controle', () => {
      const controle = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(controle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Controle', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Controle', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Controle', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addControleToCollectionIfMissing', () => {
      it('should add a Controle to an empty array', () => {
        const controle: IControle = sampleWithRequiredData;
        expectedResult = service.addControleToCollectionIfMissing([], controle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(controle);
      });

      it('should not add a Controle to an array that contains it', () => {
        const controle: IControle = sampleWithRequiredData;
        const controleCollection: IControle[] = [
          {
            ...controle,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addControleToCollectionIfMissing(controleCollection, controle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Controle to an array that doesn't contain it", () => {
        const controle: IControle = sampleWithRequiredData;
        const controleCollection: IControle[] = [sampleWithPartialData];
        expectedResult = service.addControleToCollectionIfMissing(controleCollection, controle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(controle);
      });

      it('should add only unique Controle to an array', () => {
        const controleArray: IControle[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const controleCollection: IControle[] = [sampleWithRequiredData];
        expectedResult = service.addControleToCollectionIfMissing(controleCollection, ...controleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const controle: IControle = sampleWithRequiredData;
        const controle2: IControle = sampleWithPartialData;
        expectedResult = service.addControleToCollectionIfMissing([], controle, controle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(controle);
        expect(expectedResult).toContain(controle2);
      });

      it('should accept null and undefined values', () => {
        const controle: IControle = sampleWithRequiredData;
        expectedResult = service.addControleToCollectionIfMissing([], null, controle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(controle);
      });

      it('should return initial array if no Controle is added', () => {
        const controleCollection: IControle[] = [sampleWithRequiredData];
        expectedResult = service.addControleToCollectionIfMissing(controleCollection, undefined, null);
        expect(expectedResult).toEqual(controleCollection);
      });
    });

    describe('compareControle', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareControle(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareControle(entity1, entity2);
        const compareResult2 = service.compareControle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareControle(entity1, entity2);
        const compareResult2 = service.compareControle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareControle(entity1, entity2);
        const compareResult2 = service.compareControle(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
