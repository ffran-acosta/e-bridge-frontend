# Hooks del Doctor

Esta carpeta contiene los hooks personalizados para la funcionalidad del doctor.

## `useCreatePatient`

Hook para crear nuevos pacientes con validación completa.

### Características:
- ✅ Validación con Zod
- ✅ Manejo de estado del formulario
- ✅ Integración con API
- ✅ Callbacks de éxito y error

## `useInsurances`

Hook para cargar las obras sociales desde el catálogo.

### Estado Actual:
**✅ USANDO DATOS REALES DEL BACKEND**

El endpoint `/catalogs/obras-sociales` está funcionando correctamente.

### Endpoint Implementado:
```typescript
GET /catalogs/obras-sociales
Response: {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: Insurance[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

### Obras Sociales Disponibles:
- GALENO - Plan Azul
- MEDICUS - Plan Verde
- OBRA SOCIAL ACEROS ZAPLA - Plan Básico
- OSDE - Plan 210
- SWISS MEDICAL - SMG1

### Logs de Debug:
El hook incluye logs detallados para debuggear:
- 🔍 Iniciando carga de obras sociales
- 📡 Llamando a /catalogs/obras-sociales
- ✅ Obras sociales cargadas
- ❌ Error al cargar obras sociales

## Uso

```tsx
import { useCreatePatient, useInsurances } from '@/features/doctor/hooks/useCreatePatient';

function MyComponent() {
  const { form, handleSubmit, isSubmitting } = useCreatePatient({
    defaultType: 'NORMAL',
    onSuccess: (patient) => console.log('Paciente creado:', patient),
    onError: (error) => console.error('Error:', error)
  });

  const { insurances, loading, error } = useInsurances();

  return (
    // Usar el formulario...
  );
}
```
