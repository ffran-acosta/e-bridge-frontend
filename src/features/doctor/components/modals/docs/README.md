# Modal de Creación de Pacientes

Este modal permite crear nuevos pacientes con dos variantes: **Paciente Normal** (obra social/particular) y **Paciente ART** (Aseguradora de Riesgos del Trabajo).

## Características

- ✅ **Formulario completo** con validación en tiempo real
- ✅ **Campos requeridos y opcionales** claramente diferenciados
- ✅ **Validación con Zod** para todos los campos
- ✅ **Integración con API** para crear pacientes
- ✅ **Carga automática** de obras sociales desde catálogo
- ✅ **Arrays dinámicos** para historia médica, medicamentos y alergias
- ✅ **Diseño responsive** con grid adaptativo
- ✅ **Manejo de errores** completo

## Uso Básico

### Crear Paciente Normal

```tsx
import { CreatePatientModal } from '@/features/doctor/components/modals';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CreatePatientModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      defaultType="NORMAL"
      onSuccess={(patient) => {
        console.log('Paciente creado:', patient);
        // Actualizar lista de pacientes
      }}
      onError={(error) => {
        console.error('Error:', error);
      }}
    />
  );
}
```

### Crear Paciente ART

```tsx
<CreatePatientModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultType="ART"
  onSuccess={(patient) => {
    console.log('Paciente ART creado:', patient);
    // Aquí se puede continuar con la creación del siniestro
  }}
/>
```

## Uso con Botón Integrado

### Botón Simple

```tsx
import { CreatePatientButton } from '@/features/doctor/components/patients';

function PatientsPage() {
  return (
    <CreatePatientButton
      defaultType="NORMAL"
      onPatientCreated={(patient) => {
        console.log('Nuevo paciente:', patient);
        // Refrescar lista
      }}
    />
  );
}
```

### Botón para ART

```tsx
<CreatePatientButton
  defaultType="ART"
  onPatientCreated={(patient) => {
    // Continuar con flujo de siniestro
    handleCreateSiniestro(patient.id);
  }}
/>
```

## Campos del Formulario

### 🔴 Campos Requeridos
- **Nombre**: Texto, mínimo 2 caracteres
- **Apellido**: Texto, mínimo 2 caracteres  
- **DNI**: Numérico, 7-8 dígitos
- **Género**: Select (Masculino, Femenino, Otro)
- **Fecha de Nacimiento**: Date picker
- **Obra Social**: Select (cargado desde API)

### 🟡 Campos Opcionales con Default
- **Tipo de Paciente**: Select (Normal/ART), default: "NORMAL"
- **Historial Médico**: Array dinámico, default: []
- **Medicamentos Actuales**: Array dinámico, default: []
- **Alergias**: Array dinámico, default: []

### 🟢 Campos Opcionales Sin Default
- **Dirección**: Calle, número, piso, departamento, ciudad, provincia, código postal
- **Contacto**: Teléfono principal, teléfono secundario, email
- **Contacto de Emergencia**: Nombre, teléfono, relación

## Validaciones

- **DNI**: Solo números, entre 7-8 dígitos
- **Email**: Formato válido si se proporciona
- **Teléfonos**: Formato flexible (+54911234567)
- **Código Postal**: 4-8 dígitos
- **Arrays**: No pueden tener elementos vacíos

## Endpoints Utilizados

- `GET /catalogs/insurances` - Cargar obras sociales
- `POST /doctor/patients` - Crear paciente

## Próximos Pasos

Una vez creado el paciente ART, se debe continuar con:
1. Crear siniestro (`POST /siniestros`)
2. Crear consulta de INGRESO (`POST /doctor/consultations`)

## Estructura de Archivos

```
src/features/doctor/
├── components/
│   ├── modals/
│   │   ├── CreatePatientModal.tsx      # Modal principal
│   │   ├── CreatePatientForm.tsx       # Formulario completo
│   │   └── README.md                   # Esta documentación
│   └── patients/
│       └── CreatePatientButton.tsx     # Botón de ejemplo
├── hooks/
│   └── useCreatePatient.ts             # Hook con lógica
├── lib/
│   └── patient-form.schema.ts          # Validación Zod
└── types/
    └── patient-form.types.ts           # Tipos TypeScript
```
