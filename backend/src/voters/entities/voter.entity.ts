export class Voter {
  id: number;
  name: string;
  dni: string;
  role: 'admin' | 'operador' | 'votar';
  createdAt: Date;
  updatedAt: Date;
}
