'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../../constants/endpoints';
import { useConsultationsStore } from '../../store/consultationStore';
import type { CreateConsultationFormData, MedicalEstablishment, EmployerInfo, Appointment } from '@/shared/types/patients.types';

// Schema de validación
const createConsultationSchema = z.object({
  consultationReason: z.string().min(1, 'El motivo de consulta es requerido'),
  diagnosis: z.string().min(1, 'El diagnóstico es requerido'),
  medicalIndications: z.string().min(1, 'Las indicaciones médicas son requeridas'),
  medicalEstablishmentId: z.string().min(1, 'Debe seleccionar un establecimiento médico'),
  isArtCase: z.boolean(),
  employerId: z.string().optional(),
  nextAppointmentDate: z.string().optional(),
  fromAppointmentId: z.string().optional(),
  consultationType: z.string().optional(),
  // Campos opcionales para ART
  medicalAssistancePlace: z.string().optional(),
  medicalAssistanceDate: z.string().optional(),
  patientSignature: z.string().optional(),
  doctorSignature: z.string().optional(),
}).refine((data) => {
  // Si es caso ART, employerId es obligatorio
  if (data.isArtCase && !data.employerId) {
    return false;
  }
  // Si no es caso ART, no debería tener employerId
  if (!data.isArtCase && data.employerId) {
    return false;
  }
  return true;
}, {
  message: 'Para casos ART debe seleccionar un empleador, para casos normales no debe tener empleador',
  path: ['employerId'],
});

interface CreateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  isArtCase: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  fromAppointmentId?: string;
  defaultConsultationType?: string;
  siniestroData?: any;
}

export function CreateConsultationModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  isArtCase,
  onSuccess,
  onError,
  fromAppointmentId,
  defaultConsultationType,
  siniestroData,
}: CreateConsultationModalProps) {
  const [medicalEstablishments, setMedicalEstablishments] = useState<MedicalEstablishment[]>([]);
  const [employers, setEmployers] = useState<EmployerInfo[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const { createConsultation, loading } = useConsultationsStore();

  const form = useForm<CreateConsultationFormData>({
    resolver: zodResolver(createConsultationSchema),
    defaultValues: {
      consultationReason: '',
      diagnosis: '',
      medicalIndications: '',
      medicalEstablishmentId: '',
      isArtCase,
      employerId: '',
      nextAppointmentDate: '',
      fromAppointmentId: fromAppointmentId || '',
      consultationType: defaultConsultationType || 'INGRESO',
    },
  });

  const isArtCaseValue = form.watch('isArtCase');

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    console.log('🔍 Cargando datos iniciales para modal de consulta...');
    setLoadingData(true);
    try {
      // Cargar establecimientos médicos
      console.log('📡 Llamando a /catalogs/establecimientos');
      const establishmentsResponse = await api<{ 
        success: boolean;
        statusCode: number;
        timestamp: string;
        path: string;
        data: {
          statusCode: number;
          message: string;
          data: MedicalEstablishment[];
          meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>('/catalogs/establecimientos');
      if (establishmentsResponse.data?.data) {
        console.log('✅ Establecimientos cargados:', establishmentsResponse.data.data);
        setMedicalEstablishments(establishmentsResponse.data.data);
      }

      // Cargar empleadores solo si es caso ART
      if (isArtCase) {
        console.log('📡 Llamando a /catalogs/empleadores');
        const employersResponse = await api<{ 
          success: boolean;
          statusCode: number;
          timestamp: string;
          path: string;
          data: {
            statusCode: number;
            message: string;
            data: EmployerInfo[];
            meta: {
              total: number;
              page: number;
              limit: number;
              totalPages: number;
            };
          };
        }>('/catalogs/empleadores');
        if (employersResponse.data?.data) {
          console.log('✅ Empleadores cargados:', employersResponse.data.data);
          setEmployers(employersResponse.data.data);
        }
      }

      // Cargar turnos pendientes del paciente
      const appointmentsResponse = await api<{ data: { appointments: Appointment[] } }>(
        `${DOCTOR_ENDPOINTS.patientAppointments(patientId)}?status=SCHEDULED`
      );
      if (appointmentsResponse.data) {
        setAppointments(appointmentsResponse.data.appointments);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: CreateConsultationFormData) => {
    try {
      console.log('📦 Datos del formulario:', data);
      
      const payload = {
        patientId: patientId,
        medicalEstablishmentId: data.medicalEstablishmentId,
        type: data.consultationType || 'INGRESO',
        consultationReason: data.consultationReason,
        diagnosis: data.diagnosis,
        medicalIndications: data.medicalIndications,
        ...(data.nextAppointmentDate && { nextAppointmentDate: data.nextAppointmentDate }),
        ...(data.fromAppointmentId && { fromAppointmentId: data.fromAppointmentId }),
        // Para casos ART, incluir artDetails
        ...(isArtCase && data.employerId && {
          artDetails: {
            employerId: data.employerId,
            // TODO: Agregar otros campos de artDetails cuando estén disponibles en el formulario
          }
        }),
      };

      console.log('📦 Payload enviado:', payload);
      await createConsultation(patientId, payload);

      onSuccess?.();
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error creating consultation:', error);
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (!isOpen) {
    console.log('🔍 CreateConsultationModal: Modal cerrado');
    return null;
  }
  
  console.log('🔍 CreateConsultationModal: Modal abierto, renderizando...');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Nueva Consulta - {patientName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información del caso ART */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isArtCase"
                    checked={isArtCaseValue}
                    onCheckedChange={(checked: boolean) => {
                      form.setValue('isArtCase', checked);
                      if (!checked) {
                        form.setValue('employerId', '');
                      }
                    }}
                  />
                  <label htmlFor="isArtCase" className="text-sm font-medium">
                    Es un caso ART (Accidente de Trabajo)
                  </label>
                </div>

                {/* Motivo de consulta */}
                <FormField
                  control={form.control}
                  name="consultationReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de Consulta *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el motivo de la consulta..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Diagnóstico */}
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el diagnóstico..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Indicaciones médicas */}
                <FormField
                  control={form.control}
                  name="medicalIndications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicaciones Médicas *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa las indicaciones médicas..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Establecimiento médico */}
                <FormField
                  control={form.control}
                  name="medicalEstablishmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establecimiento Médico *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un establecimiento médico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicalEstablishments.map((establishment) => (
                            <SelectItem key={establishment.id} value={establishment.id}>
                              {establishment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Empleador (solo para casos ART) */}
                {isArtCaseValue && (
                  <FormField
                    control={form.control}
                    name="employerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empleador *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un empleador" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employers.map((employer) => (
                              <SelectItem key={employer.id} value={employer.id}>
                                {employer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Turno origen (opcional) */}
                {appointments && appointments.length > 0 && (
                  <FormField
                    control={form.control}
                    name="fromAppointmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turno Origen (opcional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un turno pendiente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Sin turno origen</SelectItem>
                            {appointments?.map((appointment) => (
                              <SelectItem key={appointment.id} value={appointment.id}>
                                {format(new Date(appointment.scheduledDateTime), 'dd/MM/yyyy HH:mm', { locale: es })} - {appointment.notes || 'Sin notas'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Próximo turno (opcional) */}
                <FormField
                  control={form.control}
                  name="nextAppointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Próximo Turno (opcional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'dd/MM/yyyy HH:mm', { locale: es })
                              ) : (
                                'Seleccionar fecha y hora'
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date: Date | undefined) => {
                              if (date) {
                                field.onChange(date.toISOString());
                              }
                            }}
                            disabled={(date: Date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botones */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Consulta
                  </Button>
                </div>
              </form>
            </Form>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
