import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGerantCaisse } from '../gerant-caisse.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../gerant-caisse.test-samples';

import { GerantCaisseService, RestGerantCaisse } from './gerant-caisse.service';

const requireRestSample: RestGerantCaisse = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('GerantCaisse Service', () => {
  let service: GerantCaisseService;
  let httpMock: HttpTestingController;
  let expectedResult: IGerantCaisse | IGerantCaisse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GerantCaisseService);
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

    it('should create a GerantCaisse', () => {
      const gerantCaisse = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gerantCaisse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GerantCaisse', () => {
      const gerantCaisse = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gerantCaisse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GerantCaisse', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GerantCaisse', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GerantCaisse', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGerantCaisseToCollectionIfMissing', () => {
      it('should add a GerantCaisse to an empty array', () => {
        const gerantCaisse: IGerantCaisse = sampleWithRequiredData;
        expectedResult = service.addGerantCaisseToCollectionIfMissing([], gerantCaisse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerantCaisse);
      });

      it('should not add a GerantCaisse to an array that contains it', () => {
        const gerantCaisse: IGerantCaisse = sampleWithRequiredData;
        const gerantCaisseCollection: IGerantCaisse[] = [
          {
            ...gerantCaisse,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGerantCaisseToCollectionIfMissing(gerantCaisseCollection, gerantCaisse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GerantCaisse to an array that doesn't contain it", () => {
        const gerantCaisse: IGerantCaisse = sampleWithRequiredData;
        const gerantCaisseCollection: IGerantCaisse[] = [sampleWithPartialData];
        expectedResult = service.addGerantCaisseToCollectionIfMissing(gerantCaisseCollection, gerantCaisse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerantCaisse);
      });

      it('should add only unique GerantCaisse to an array', () => {
        const gerantCaisseArray: IGerantCaisse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gerantCaisseCollection: IGerantCaisse[] = [sampleWithRequiredData];
        expectedResult = service.addGerantCaisseToCollectionIfMissing(gerantCaisseCollection, ...gerantCaisseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gerantCaisse: IGerantCaisse = sampleWithRequiredData;
        const gerantCaisse2: IGerantCaisse = sampleWithPartialData;
        expectedResult = service.addGerantCaisseToCollectionIfMissing([], gerantCaisse, gerantCaisse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerantCaisse);
        expect(expectedResult).toContain(gerantCaisse2);
      });

      it('should accept null and undefined values', () => {
        const gerantCaisse: IGerantCaisse = sampleWithRequiredData;
        expectedResult = service.addGerantCaisseToCollectionIfMissing([], null, gerantCaisse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerantCaisse);
      });

      it('should return initial array if no GerantCaisse is added', () => {
        const gerantCaisseCollection: IGerantCaisse[] = [sampleWithRequiredData];
        expectedResult = service.addGerantCaisseToCollectionIfMissing(gerantCaisseCollection, undefined, null);
        expect(expectedResult).toEqual(gerantCaisseCollection);
      });
    });

    describe('compareGerantCaisse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGerantCaisse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGerantCaisse(entity1, entity2);
        const compareResult2 = service.compareGerantCaisse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGerantCaisse(entity1, entity2);
        const compareResult2 = service.compareGerantCaisse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGerantCaisse(entity1, entity2);
        const compareResult2 = service.compareGerantCaisse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
