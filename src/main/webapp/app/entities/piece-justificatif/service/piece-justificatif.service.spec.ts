import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPieceJustificatif } from '../piece-justificatif.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../piece-justificatif.test-samples';

import { PieceJustificatifService, RestPieceJustificatif } from './piece-justificatif.service';

const requireRestSample: RestPieceJustificatif = {
  ...sampleWithRequiredData,
  dateHeureModification: sampleWithRequiredData.dateHeureModification?.toJSON(),
  dateHeureCreation: sampleWithRequiredData.dateHeureCreation?.toJSON(),
};

describe('PieceJustificatif Service', () => {
  let service: PieceJustificatifService;
  let httpMock: HttpTestingController;
  let expectedResult: IPieceJustificatif | IPieceJustificatif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PieceJustificatifService);
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

    it('should create a PieceJustificatif', () => {
      const pieceJustificatif = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pieceJustificatif).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PieceJustificatif', () => {
      const pieceJustificatif = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pieceJustificatif).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PieceJustificatif', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PieceJustificatif', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PieceJustificatif', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPieceJustificatifToCollectionIfMissing', () => {
      it('should add a PieceJustificatif to an empty array', () => {
        const pieceJustificatif: IPieceJustificatif = sampleWithRequiredData;
        expectedResult = service.addPieceJustificatifToCollectionIfMissing([], pieceJustificatif);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pieceJustificatif);
      });

      it('should not add a PieceJustificatif to an array that contains it', () => {
        const pieceJustificatif: IPieceJustificatif = sampleWithRequiredData;
        const pieceJustificatifCollection: IPieceJustificatif[] = [
          {
            ...pieceJustificatif,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPieceJustificatifToCollectionIfMissing(pieceJustificatifCollection, pieceJustificatif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PieceJustificatif to an array that doesn't contain it", () => {
        const pieceJustificatif: IPieceJustificatif = sampleWithRequiredData;
        const pieceJustificatifCollection: IPieceJustificatif[] = [sampleWithPartialData];
        expectedResult = service.addPieceJustificatifToCollectionIfMissing(pieceJustificatifCollection, pieceJustificatif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pieceJustificatif);
      });

      it('should add only unique PieceJustificatif to an array', () => {
        const pieceJustificatifArray: IPieceJustificatif[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pieceJustificatifCollection: IPieceJustificatif[] = [sampleWithRequiredData];
        expectedResult = service.addPieceJustificatifToCollectionIfMissing(pieceJustificatifCollection, ...pieceJustificatifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pieceJustificatif: IPieceJustificatif = sampleWithRequiredData;
        const pieceJustificatif2: IPieceJustificatif = sampleWithPartialData;
        expectedResult = service.addPieceJustificatifToCollectionIfMissing([], pieceJustificatif, pieceJustificatif2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pieceJustificatif);
        expect(expectedResult).toContain(pieceJustificatif2);
      });

      it('should accept null and undefined values', () => {
        const pieceJustificatif: IPieceJustificatif = sampleWithRequiredData;
        expectedResult = service.addPieceJustificatifToCollectionIfMissing([], null, pieceJustificatif, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pieceJustificatif);
      });

      it('should return initial array if no PieceJustificatif is added', () => {
        const pieceJustificatifCollection: IPieceJustificatif[] = [sampleWithRequiredData];
        expectedResult = service.addPieceJustificatifToCollectionIfMissing(pieceJustificatifCollection, undefined, null);
        expect(expectedResult).toEqual(pieceJustificatifCollection);
      });
    });

    describe('comparePieceJustificatif', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePieceJustificatif(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePieceJustificatif(entity1, entity2);
        const compareResult2 = service.comparePieceJustificatif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePieceJustificatif(entity1, entity2);
        const compareResult2 = service.comparePieceJustificatif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePieceJustificatif(entity1, entity2);
        const compareResult2 = service.comparePieceJustificatif(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
