// features/doctor/components/modals/ConsultationModal.tsx
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Button,
    Card,
    CardContent,
    Badge,
    Label
} from '@/shared';
import { Calendar, Stethoscope, Building, User, FileText, Save, X } from 'lucide-react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../../constants/endpoints';
import type { Consultation, PatientProfile } from '@/shared/types/patients.types';
import { useConsultationsStore } from '../../store/consultationStore';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    patient: PatientProfile;
    initialData?: Consultation;
    onSuccess?: () => void;
}

interface FormData {
    consultationReason: string;
    diagnosis: string;
    nextAppointmentDate: string;
    isArtCase: boolean;
    medicalEstablishmentId: string;
    employerId: string;
    notes: string;
}

const initialFormData: FormData = {
    consultationReason: '',
    diagnosis: '',
    nextAppointmentDate: '',
    isArtCase: false,
    medicalEstablishmentId: '',
    employerId: '',
    notes: ''
};

export const ConsultationModal = ({
    isOpen,
    onClose,
    mode,
    patient,
    initialData,
    onSuccess
}: ConsultationModalProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Store para refrescar datos
    const { fetchConsultations } = useConsultationsStore();

    const isEditing = mode === 'edit';
    const title = isEditing ? 'Editar Consulta' : 'Nueva Consulta';
    const submitText = isEditing ? 'Actualizar Consulta' : 'Crear Consulta';

    // Cargar datos iniciales cuando es edición
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                consultationReason: initialData.consultationReason || '',
                diagnosis: initialData.diagnosis || '',
                nextAppointmentDate: initialData.nextAppointmentDate
                    ? new Date(initialData.nextAppointmentDate).toISOString().slice(0, 16)
                    : '',
                isArtCase: initialData.isArtCase || false,
                medicalEstablishmentId: initialData.medicalEstablishment?.id || '',
                employerId: initialData.employer?.id || '',
                notes: '' // Las notas no vienen en la respuesta actual
            });
        } else {
            setFormData({
                ...initialFormData,
                isArtCase: patient.siniestro !== null // Auto-detectar si es paciente ART
            });
        }
    }, [isEditing, initialData, patient]);

    // Limpiar estado al cerrar
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormData);
            setError(null);
        }
    }, [isOpen]);

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error al empezar a escribir
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.consultationReason.trim()) {
            return 'El motivo de consulta es obligatorio';
        }
        if (!formData.diagnosis.trim()) {
            return 'El diagnóstico es obligatorio';
        }
        if (formData.isArtCase && !formData.employerId) {
            return 'Para casos ART es obligatorio seleccionar el empleador';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const endpoint = isEditing
                ? `${DOCTOR_ENDPOINTS.patientConsultations(patient.id)}/${initialData!.id}`
                : DOCTOR_ENDPOINTS.patientConsultations(patient.id);

            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                consultationReason: formData.consultationReason.trim(),
                diagnosis: formData.diagnosis.trim(),
                nextAppointmentDate: formData.nextAppointmentDate || null,
                isArtCase: formData.isArtCase,
                medicalEstablishmentId: formData.medicalEstablishmentId || null,
                employerId: formData.isArtCase ? formData.employerId : null,
                notes: formData.notes.trim() || null
            };

            if (method === 'PUT') {
                await api(endpoint, { method: 'PUT', body: payload });
            } else {
                await api(endpoint, { method: 'POST', body: payload });
            }

            // Refrescar datos
            await fetchConsultations(patient.id);

            // Callback de éxito
            onSuccess?.();

            // Cerrar modal
            onClose();

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la consulta: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        {title}
                        <Badge variant="outline" className="ml-auto">
                            {patient.firstName} {patient.lastName}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error general */}
                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-4">
                                <p className="text-red-600 text-sm flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    {error}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Motivo de consulta */}
                    <div className="space-y-2">
                        <Label htmlFor="consultationReason" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Motivo de consulta *
                        </Label>
                        <textarea
                            id="consultationReason"
                            className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                            placeholder="Ej: Dolor en rodilla derecha, Control post-operatorio..."
                            value={formData.consultationReason}
                            onChange={(e) => handleInputChange('consultationReason', e.target.value)}
                            required
                        />
                    </div>

                    {/* Diagnóstico */}
                    <div className="space-y-2">
                        <Label htmlFor="diagnosis" className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Diagnóstico *
                        </Label>
                        <textarea
                            id="diagnosis"
                            className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Descripción del diagnóstico médico..."
                            value={formData.diagnosis}
                            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                            required
                        />
                    </div>

                    {/* Próxima cita */}
                    <div className="space-y-2">
                        <Label htmlFor="nextAppointmentDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Próxima cita programada
                        </Label>
                        <input
                            id="nextAppointmentDate"
                            type="datetime-local"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.nextAppointmentDate}
                            onChange={(e) => handleInputChange('nextAppointmentDate', e.target.value)}
                        />
                    </div>

                    {/* Caso ART */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={formData.isArtCase}
                                onChange={(e) => handleInputChange('isArtCase', e.target.checked)}
                                disabled={patient.siniestro !== null} // Si ya es paciente ART, no se puede cambiar
                            />
                            Es un caso ART (Accidente de Trabajo)
                            {patient.siniestro && (
                                <Badge variant="secondary" className="ml-2">
                                    Paciente ART
                                </Badge>
                            )}
                        </Label>
                    </div>

                    {/* Establecimiento médico - Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="medicalEstablishment" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Establecimiento médico
                        </Label>
                        <select
                            id="medicalEstablishment"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.medicalEstablishmentId}
                            onChange={(e) => handleInputChange('medicalEstablishmentId', e.target.value)}
                        >
                            <option value="">Seleccionar establecimiento...</option>
                            {/* TODO: Cargar desde API */}
                            <option value="bf640aca-c433-4b21-aa28-d1c1e192f75f">CONSULTORIOS WINTER</option>
                            <option value="9e62800c-af10-4702-99ad-a9b39321d0bc">CLINICA CENTRO MEDICO PRIVADO</option>
                        </select>
                    </div>

                    {/* Empleador (solo si es ART) */}
                    {formData.isArtCase && (
                        <div className="space-y-2">
                            <Label htmlFor="employer" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Empleador *
                            </Label>
                            <select
                                id="employer"
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.employerId}
                                onChange={(e) => handleInputChange('employerId', e.target.value)}
                                required={formData.isArtCase}
                            >
                                <option value="">Seleccionar empleador...</option>
                                {/* TODO: Cargar desde API */}
                                <option value="employer-1">Empresa ABC S.A.</option>
                                <option value="employer-2">Fábrica XYZ Ltda.</option>
                            </select>
                        </div>
                    )}

                    {/* Notas adicionales */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Notas adicionales
                        </Label>
                        <textarea
                            id="notes"
                            className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Observaciones, instrucciones, comentarios..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Guardando...' : submitText}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
