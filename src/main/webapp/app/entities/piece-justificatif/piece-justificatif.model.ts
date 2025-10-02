import dayjs from 'dayjs/esm';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IPieceJustificatif {
  id: number;
  libelle?: string | null;
  piece?: string | null;
  pieceContentType?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  operation?: Pick<IOperation, 'id' | 'numero'> | null;
}

export type NewPieceJustificatif = Omit<IPieceJustificatif, 'id'> & { id: null };
