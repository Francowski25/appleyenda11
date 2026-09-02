export interface DesafioNombre {
    firstName: string | null;
    lastName: string | null;
    firstNameLength: number | null;
    lastNameLength: number | null;
}

export function resolverNombreObjetivo(desafio: DesafioNombre): { nombre: string; longitud: number } {
    const usaApellido = desafio.lastName != null;
    const nombre = desafio.lastName ?? desafio.firstName ?? '';
    const longitud = (usaApellido ? desafio.lastNameLength : desafio.firstNameLength) ?? nombre.length;

    return { nombre, longitud };
}