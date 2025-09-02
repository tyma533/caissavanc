import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGerant } from '../gerant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../gerant.test-samples';

import { GerantService, RestGerant } from './gerant.service';

const requireRestSample: RestGerant = {
  ...sampleWithRequiredData,
  dateNomination: sampleWithRequiredData.dateNomination?.toJSON(),
  dateFin: sampleWithRequiredData.dateFin?.toJSON(),
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('Gerant Service', () => {
  let service: GerantService;
  let httpMock: HttpTestingController;
  let expectedResult: IGerant | IGerant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GerantService);
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

    it('should create a Gerant', () => {
      const gerant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gerant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Gerant', () => {
      const gerant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gerant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Gerant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Gerant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Gerant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGerantToCollectionIfMissing', () => {
      it('should add a Gerant to an empty array', () => {
        const gerant: IGerant = sampleWithRequiredData;
        expectedResult = service.addGerantToCollectionIfMissing([], gerant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerant);
      });

      it('should not add a Gerant to an array that contains it', () => {
        const gerant: IGerant = sampleWithRequiredData;
        const gerantCollection: IGerant[] = [
          {
            ...gerant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGerantToCollectionIfMissing(gerantCollection, gerant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Gerant to an array that doesn't contain it", () => {
        const gerant: IGerant = sampleWithRequiredData;
        const gerantCollection: IGerant[] = [sampleWithPartialData];
        expectedResult = service.addGerantToCollectionIfMissing(gerantCollection, gerant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerant);
      });

      it('should add only unique Gerant to an array', () => {
        const gerantArray: IGerant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gerantCollection: IGerant[] = [sampleWithRequiredData];
        expectedResult = service.addGerantToCollectionIfMissing(gerantCollection, ...gerantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gerant: IGerant = sampleWithRequiredData;
        const gerant2: IGerant = sampleWithPartialData;
        expectedResult = service.addGerantToCollectionIfMissing([], gerant, gerant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerant);
        expect(expectedResult).toContain(gerant2);
      });

      it('should accept null and undefined values', () => {
        const gerant: IGerant = sampleWithRequiredData;
        expectedResult = service.addGerantToCollectionIfMissing([], null, gerant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerant);
      });

      it('should return initial array if no Gerant is added', () => {
        const gerantCollection: IGerant[] = [sampleWithRequiredData];
        expectedResult = service.addGerantToCollectionIfMissing(gerantCollection, undefined, null);
        expect(expectedResult).toEqual(gerantCollection);
      });
    });

    describe('compareGerant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGerant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGerant(entity1, entity2);
        const compareResult2 = service.compareGerant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGerant(entity1, entity2);
        const compareResult2 = service.compareGerant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGerant(entity1, entity2);
        const compareResult2 = service.compareGerant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
