import dayjs from 'dayjs/esm';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { ITypeOperation } from 'app/entities/type-operation/type-operation.model';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';

export interface IOperation {
  id: number;
  numero?: string | null;
  commentaire?: string | null;
  montant?: number | null;
  dateOperation?: dayjs.Dayjs | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  caisse?: Pick<ICaisse, 'id' | 'libelle'> | null;
  typeOperation?: Pick<ITypeOperation, 'id' | 'libelle'> | null;
  modeOperation?: Pick<IModeOperation, 'id' | 'libelle'> | null;
  numeroVC?: string | null;
  banque?: string | null;
  beneficiaire?: string | null;
  crediteur?: string | null;
}

export type NewOperation = Omit<IOperation, 'id'> & { id: null };
