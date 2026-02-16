# Archivos Modificados y Creados

Este archivo documenta todos los cambios realizados al backend del Sistema de Votos (eVote System).

## 📝 Resumen de Cambios

Fecha: 15 de Febrero de 2026

### 🔄 Archivos Modificados

1. **backend/prisma/schema.prisma**
   - ✅ Agregados enums: `ElectionStatus` y `UserRole`
   - ✅ Actualizado modelo `Election` con status enum y timestamps
   - ✅ Actualizado modelo `Voter` con role enum y timestamps
   - ✅ Mejorado modelo `Candidate` con timestamps y onDelete Cascade
   - ✅ Mejorado modelo `Vote` con índices y onDelete Cascade
   - ✅ Constraint único mantiene integridad: un votante solo vota una vez por elección

2. **backend/src/elections/dto/create-election.dto.ts**
   - ✅ Status actualizado a enum type: `'upcoming' | 'active' | 'closed'`
   - ✅ Status ahora es opcional con valor por defecto

3. **backend/src/elections/elections.service.ts**
   - ✅ Implementado método `findAll()` con filtros avanzados
   - ✅ Filtros disponibles: estado, nombre (búsqueda insensible a mayúsculas), rango de fechas
   - ✅ Implementado método `getResults()` para visualizar resultados
   - ✅ Solo administradores pueden ver resultados completos
   - ✅ Resultados ordenados de mayor a menor por cantidad de votos
   - ✅ Calcula porcentaje automáticamente

4. **backend/src/elections/elections.controller.ts**
   - ✅ Agregado endpoint `GET /elections/:id/results` para obtener resultados
   - ✅ Implementados query parameters para filtros en `GET /elections`
   - ✅ Validación de rol para acceso a resultados

5. **backend/src/app.module.ts**
   - ✅ Importado VotersModule
   - ✅ Importado VotesModule
   - ✅ Importado CandidatesModule

### 📁 Archivos Creados (Nuevos Módulos)

#### Módulo Voters (Votantes)
6. **backend/src/voters/voters.service.ts**
   - Gestión completa de votantes
   - Métodos: create, findAll, findOne, findByDni, update, remove

7. **backend/src/voters/voters.controller.ts**
   - Endpoints: POST/GET/PATCH/DELETE

8. **backend/src/voters/voters.module.ts**
   - Módulo NestJS configurado

9. **backend/src/voters/dto/create-voter.dto.ts**
   - DTO para crear votante

10. **backend/src/voters/dto/update-voter.dto.ts**
    - DTO para actualizar votante

11. **backend/src/voters/entities/voter.entity.ts**
    - Entidad TypeScript para Voter

#### Módulo Votes (Votos)
12. **backend/src/votes/votes.service.ts**
    - Lógica de emisión de votos con validaciones:
      - Solo rol "votar" puede votar
      - Solo en elecciones activas
      - Una sola votación por elección
      - Timestamp automático
    - Métodos: create, findAll, findOne, remove

13. **backend/src/votes/votes.controller.ts**
    - Endpoints: POST/GET/DELETE

14. **backend/src/votes/votes.module.ts**
    - Módulo NestJS configurado

15. **backend/src/votes/dto/create-vote.dto.ts**
    - DTO para crear voto

16. **backend/src/votes/entities/vote.entity.ts**
    - Entidad TypeScript para Vote

#### Módulo Candidates (Candidatos)
17. **backend/src/candidates/candidates.service.ts**
    - Gestión de candidatos
    - Métodos: create, findAll, findOne, update, remove
    - Validación de existencia de elección

18. **backend/src/candidates/candidates.controller.ts**
    - Endpoints: POST/GET/PATCH/DELETE

19. **backend/src/candidates/candidates.module.ts**
    - Módulo NestJS configurado

20. **backend/src/candidates/dto/create-candidate.dto.ts**
    - DTO para crear candidato

21. **backend/src/candidates/dto/update-candidate.dto.ts**
    - DTO para actualizar candidato

22. **backend/src/candidates/entities/candidate.entity.ts**
    - Entidad TypeScript para Candidate

## ✨ Funcionalidades Implementadas

### Caso de Uso 1: Listado de Elecciones + Filtros ✅
```
GET /elections?status=active&name=Presidenciales&startDate=2026-01-01&endDate=2026-12-31
```
- Filtro por estado: `upcoming`, `active`, `closed`
- Filtro por nombre: búsqueda parcial insensible a mayúsculas
- Filtro por fecha: rango personalizable

### Caso de Uso 2: Emisión de Voto ✅
```
POST /votes
```
- ✅ Solo usuarios con rol "votar" pueden votar
- ✅ Solo en elecciones con estado `active`
- ✅ Constraint único: una votación por votante/elección
- ✅ Timestamp registrado automáticamente

### Caso de Uso 3: Visualización de Resultados ✅
```
GET /elections/:id/results?role=admin
```
- ✅ Solo administradores pueden ver resultados
- ✅ Cantidad de votos por candidato
- ✅ Total de votos
- ✅ Porcentaje calculado automáticamente
- ✅ Ordenados de mayor a menor por cantidad de votos

## 🔒 Control de Acceso por Roles

Se implementaron tres roles principales:
- **admin**: Acceso total, puede ver resultados
- **operador**: Acceso operacional
- **votar**: Rol por defecto para votantes

## 📊 Validaciones Implementadas

1. **En Votes**:
   - Votante existe
   - Votante tiene rol permitido
   - Elección existe
   - Elección está activa
   - Candidato existe y pertenece a la elección
   - No hay votación duplicada (DB constraint)

2. **En Candidates**:
   - Elección existe antes de crear candidato

3. **En Schema**:
   - DNI de votante es único
   - Un votante solo vota una vez por elección (@@unique)
   - Foreign keys con CASCADE delete

## 🔧 Tecnologías Utilizadas

- **Framework**: NestJS 11.0.1
- **ORM**: Prisma 5.19.0
- **Base de Datos**: MySQL
- **TypeScript**: 5.7.3

## 📋 Próximos Pasos Recomendados

1. Implementar autenticación y autorización (JWT)
2. Agregar validación con decoradores de class-validator
3. Implementar rate limiting
4. Agregar logging estructurado
5. Crear más tests unitarios
6. Documentar API con Swagger

## 🚀 Instrucciones de Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
# DATABASE_URL="mysql://usuario:contraseña@localhost:3306/evote_db"

# 3. Ejecutar migraciones
npx prisma migrate dev

# 4. Iniciar servidor en desarrollo
npm run start:dev
```

## 📌 Notas Importantes

- El schema.prisma contiene nuevas migraciones que deben ejecutarse
- Los DTOs están optimizados con PartialType para actualizar
- Los servicios incluyen validaciones de negocio en la capa de aplicación
- Todos los endpoints están documentados en backend/README.md
