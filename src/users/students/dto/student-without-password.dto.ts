
// TODO mejorar esto para exluir completamente el campo de password 
// y no unicamente asignarle una cadena vacía
class UserWithoutPassword {
    id: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: Date;
    deletedAt: Date;
    password?: string
    // Excluimos password aquí
}