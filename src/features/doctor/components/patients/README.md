# Componentes de Pacientes

Esta carpeta contiene todos los componentes relacionados con la gestión de pacientes.

## Componentes Disponibles

### `PatientList`
Componente principal que muestra la lista de pacientes con tabs para ART y Obra Social/Particulares. Incluye:
- ✅ **Búsqueda y filtrado** de pacientes
- ✅ **Paginación** completa
- ✅ **Tabs** para separar tipos de pacientes
- ✅ **Modal integrado** para crear nuevos pacientes
- ✅ **Botón "Agregar Paciente"** funcional

### `CreatePatientButton`
Botón reutilizable para abrir el modal de creación de pacientes:

```tsx
import { CreatePatientButton } from '@/features/doctor/components/patients';

// Botón para paciente normal
<CreatePatientButton
  defaultType="NORMAL"
  onPatientCreated={(patient) => {
    console.log('Paciente creado:', patient);
  }}
/>

// Botón para paciente ART
<CreatePatientButton
  defaultType="ART"
  onPatientCreated={(patient) => {
    // Continuar con flujo de siniestro
  }}
/>
```

### `CreatePatientModal`
Modal completo para crear pacientes (ya integrado en PatientList):

```tsx
import { CreatePatientModal } from '@/features/doctor/components/modals';

<CreatePatientModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultType="NORMAL" // o "ART"
  onSuccess={(patient) => {
    console.log('Paciente creado:', patient);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
/>
```

## Integración Actual

El modal ya está **completamente integrado** en `PatientList.tsx`:

1. **Botón funcional**: El botón "Agregar Paciente" ahora abre el modal
2. **Tipo dinámico**: El modal se abre con el tipo correcto (NORMAL o ART) según el tab activo
3. **Actualización automática**: Al crear un paciente, la lista se refresca automáticamente
4. **Manejo de errores**: Errores se muestran en consola y en el modal

## Flujo de Trabajo

### Para Pacientes Normales:
1. Usuario hace clic en tab "Obra Social/Particulares"
2. Hace clic en "Agregar Paciente"
3. Completa el formulario
4. Paciente se crea y lista se actualiza

### Para Pacientes ART:
1. Usuario hace clic en tab "Pacientes ART"
2. Hace clic en "Agregar Paciente ART"
3. Completa el formulario (type preestablecido como ART)
4. Paciente se crea y lista se actualiza
5. **Próximo paso**: Crear siniestro y consulta INGRESO

## Campos del Formulario

- **Requeridos**: Nombre, Apellido, DNI, Género, Fecha Nacimiento, Obra Social
- **Opcionales**: Dirección completa, contactos, historia médica
- **Dinámicos**: Arrays para medicamentos, alergias, historial médico

## Validaciones

- DNI: 7-8 dígitos
- Email: Formato válido
- Teléfonos: Formato flexible
- Arrays: No elementos vacíos
- Campos requeridos: Validación en tiempo real
