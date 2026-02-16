export class CreateVoterDto {
  name: string;
  dni: string;
  role?: 'admin' | 'operador' | 'votar';
}
