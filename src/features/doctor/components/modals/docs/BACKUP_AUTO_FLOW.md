# BACKUP - Flujo Automático Siniestro → Consulta

## Flujo Actual Preservado:
```typescript
// En CreateSiniestroModal.tsx líneas 39-44
onSuccess: (siniestro) => {
  console.log('🎯 Siniestro creado exitosamente:', siniestro);
  console.log('🔍 Abriendo modal de consulta...');
  setCreatedSiniestro(siniestro);
  setIsConsultationModalOpen(true);
  console.log('✅ Modal de consulta debería estar abierto ahora');
},

// En CreateSiniestroModal.tsx líneas 161-173
{createdSiniestro && (
  <CreateConsultationModal
    isOpen={isConsultationModalOpen}
    onClose={handleConsultationClose}
    patientId={patientId}
    patientName={patientName}
    isArtCase={true}
    onSuccess={handleConsultationSuccess}
    onError={handleConsultationError}
    defaultConsultationType="INGRESO"
    siniestroData={createdSiniestro}
  />
)}
```

## Estados Necesarios:
- `isConsultationModalOpen: boolean`
- `createdSiniestro: any`

## Handlers Necesarios:
- `handleConsultationClose()`
- `handleConsultationSuccess()`
- `handleConsultationError(error: string)`

## Props del Modal de Consulta:
- `isOpen={isConsultationModalOpen}`
- `onClose={handleConsultationClose}`
- `patientId={patientId}`
- `patientName={patientName}`
- `isArtCase={true}`
- `onSuccess={handleConsultationSuccess}`
- `onError={handleConsultationError}`
- `defaultConsultationType="INGRESO"`
- `siniestroData={createdSiniestro}`
