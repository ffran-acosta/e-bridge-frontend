// Utilidades para mapear datos de usuario a props de componentes

export interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  specialty: { name: string };
  licenseNumber: string;
}

export interface AdminData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  assignedDoctors?: string[];
}

export interface UserDisplay {
  title: string;
  subtitle: string;
  additionalInfo?: string;
}

export interface UserBadge {
  id: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  onRemove?: (id: string) => void;
}

// Mapper para Doctor
export function mapDoctorToUserDisplay(
  doctor: DoctorData, 
  patientsCount?: number
): UserDisplay {
  return {
    title: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    subtitle: `${doctor.specialty.name} • ${doctor.licenseNumber}`,
    additionalInfo: patientsCount !== undefined 
      ? `${doctor.email} • ${patientsCount} pacientes`
      : doctor.email
  };
}

// Mapper para Admin
export function mapAdminToUserDisplay(admin: AdminData): UserDisplay {
  return {
    title: `${admin.firstName} ${admin.lastName}`,
    subtitle: admin.email
  };
}

// Mapper para badges de asignaciones
export function mapAssignmentsToBadges(
  assignedIds: string[],
  getName: (id: string) => string,
  onRemove?: (id: string) => void
): UserBadge[] {
  return assignedIds.map(id => ({
    id,
    label: getName(id),
    variant: "secondary" as const,
    onRemove
  }));
}
