// ===================== MOCK DATA =====================
const MOCK_DATA = {
  usuarios: [
    { id: 1, nombre: "Admin Principal", email: "admin@academia.edu", password: "admin123", rol: "admin", avatar: "AP", activo: true },
    { id: 2, nombre: "Carlos Mendoza", email: "carlos@academia.edu", password: "prof123", rol: "profesor", avatar: "CM", activo: true, materias: [1, 2, 3] },
    { id: 3, nombre: "Ana García", email: "ana@academia.edu", password: "prof123", rol: "profesor", avatar: "AG", activo: true, materias: [4, 5] },
    { id: 4, nombre: "Luis Ramírez", email: "luis@academia.edu", password: "prof123", rol: "profesor", avatar: "LR", activo: true, materias: [6, 7] },
    { id: 5, nombre: "María Torres", email: "maria@academia.edu", password: "est123", rol: "estudiante", avatar: "MT", activo: true, grado: "10A", codigo: "EST001" },
    { id: 6, nombre: "Pedro Jiménez", email: "pedro@academia.edu", password: "est123", rol: "estudiante", avatar: "PJ", activo: true, grado: "10A", codigo: "EST002" },
    { id: 7, nombre: "Laura Sánchez", email: "laura@academia.edu", password: "est123", rol: "estudiante", avatar: "LS", activo: true, grado: "10B", codigo: "EST003" },
    { id: 8, nombre: "Diego Flores", email: "diego@academia.edu", password: "est123", rol: "estudiante", avatar: "DF", activo: true, grado: "10B", codigo: "EST004" },
    { id: 9, nombre: "Sofía Martínez", email: "sofia@academia.edu", password: "est123", rol: "estudiante", avatar: "SM", activo: true, grado: "11A", codigo: "EST005" },
    { id: 10, nombre: "Andrés López", email: "andres@academia.edu", password: "est123", rol: "estudiante", avatar: "AL", activo: true, grado: "11A", codigo: "EST006" },
    { id: 11, nombre: "Valentina Cruz", email: "valentina@academia.edu", password: "est123", rol: "estudiante", avatar: "VC", activo: true, grado: "11B", codigo: "EST007" },
    { id: 12, nombre: "Sebastián Ruiz", email: "sebastian@academia.edu", password: "est123", rol: "estudiante", avatar: "SR", activo: true, grado: "11B", codigo: "EST008" },
  ],
  materias: [
    { id: 1, nombre: "Matemáticas", codigo: "MAT101", descripcion: "Álgebra, geometría y cálculo básico", creditosHoras: 4, profesorId: 2, grados: ["10A", "10B"], color: "#6366f1" },
    { id: 2, nombre: "Física", codigo: "FIS101", descripcion: "Mecánica clásica y termodinámica", creditosHoras: 4, profesorId: 2, grados: ["11A", "11B"], color: "#8b5cf6" },
    { id: 3, nombre: "Química", codigo: "QUI101", descripcion: "Química orgánica e inorgánica", creditosHoras: 3, profesorId: 2, grados: ["10A", "10B"], color: "#06b6d4" },
    { id: 4, nombre: "Lenguaje", codigo: "LEN101", descripcion: "Literatura y comunicación escrita", creditosHoras: 4, profesorId: 3, grados: ["10A", "10B", "11A", "11B"], color: "#f59e0b" },
    { id: 5, nombre: "Historia", codigo: "HIS101", descripcion: "Historia universal y de Colombia", creditosHoras: 3, profesorId: 3, grados: ["10A", "10B"], color: "#ef4444" },
    { id: 6, nombre: "Inglés", codigo: "ING101", descripcion: "Inglés nivel intermedio B1-B2", creditosHoras: 4, profesorId: 4, grados: ["10A", "10B", "11A", "11B"], color: "#10b981" },
    { id: 7, nombre: "Educación Física", codigo: "EDF101", descripcion: "Deportes y salud corporal", creditosHoras: 2, profesorId: 4, grados: ["10A", "10B", "11A", "11B"], color: "#f97316" },
  ],
  notas: [
    // María Torres (10A) - EST001
    { id: 1, estudianteId: 5, materiaId: 1, periodo: 1, nota1: 4.2, nota2: 3.8, nota3: 4.5, definitiva: 4.17 },
    { id: 2, estudianteId: 5, materiaId: 3, periodo: 1, nota1: 3.5, nota2: 4.0, nota3: 3.8, definitiva: 3.77 },
    { id: 3, estudianteId: 5, materiaId: 4, periodo: 1, nota1: 4.8, nota2: 4.5, nota3: 4.9, definitiva: 4.73 },
    { id: 4, estudianteId: 5, materiaId: 5, periodo: 1, nota1: 2.8, nota2: 3.2, nota3: 2.5, definitiva: 2.83 },
    { id: 5, estudianteId: 5, materiaId: 6, periodo: 1, nota1: 4.0, nota2: 4.2, nota3: 4.1, definitiva: 4.1 },
    { id: 6, estudianteId: 5, materiaId: 7, periodo: 1, nota1: 4.5, nota2: 4.8, nota3: 5.0, definitiva: 4.77 },
    // Pedro Jiménez (10A) - EST002
    { id: 7, estudianteId: 6, materiaId: 1, periodo: 1, nota1: 2.5, nota2: 2.8, nota3: 3.0, definitiva: 2.77 },
    { id: 8, estudianteId: 6, materiaId: 3, periodo: 1, nota1: 3.8, nota2: 3.5, nota3: 4.0, definitiva: 3.77 },
    { id: 9, estudianteId: 6, materiaId: 4, periodo: 1, nota1: 3.2, nota2: 3.0, nota3: 3.5, definitiva: 3.23 },
    { id: 10, estudianteId: 6, materiaId: 5, periodo: 1, nota1: 2.0, nota2: 1.8, nota3: 2.2, definitiva: 2.0 },
    { id: 11, estudianteId: 6, materiaId: 6, periodo: 1, nota1: 3.5, nota2: 3.8, nota3: 3.6, definitiva: 3.63 },
    { id: 12, estudianteId: 6, materiaId: 7, periodo: 1, nota1: 4.0, nota2: 4.2, nota3: 4.5, definitiva: 4.23 },
    // Laura Sánchez (10B) - EST003
    { id: 13, estudianteId: 7, materiaId: 1, periodo: 1, nota1: 4.5, nota2: 4.8, nota3: 4.6, definitiva: 4.63 },
    { id: 14, estudianteId: 7, materiaId: 3, periodo: 1, nota1: 4.2, nota2: 4.5, nota3: 4.3, definitiva: 4.33 },
    { id: 15, estudianteId: 7, materiaId: 4, periodo: 1, nota1: 5.0, nota2: 4.8, nota3: 4.9, definitiva: 4.9 },
    { id: 16, estudianteId: 7, materiaId: 5, periodo: 1, nota1: 4.0, nota2: 4.2, nota3: 4.1, definitiva: 4.1 },
    { id: 17, estudianteId: 7, materiaId: 6, periodo: 1, nota1: 4.8, nota2: 4.9, nota3: 5.0, definitiva: 4.9 },
    { id: 18, estudianteId: 7, materiaId: 7, periodo: 1, nota1: 3.8, nota2: 4.0, nota3: 3.9, definitiva: 3.9 },
    // Diego Flores (10B) - EST004
    { id: 19, estudianteId: 8, materiaId: 1, periodo: 1, nota1: 1.8, nota2: 2.0, nota3: 2.2, definitiva: 2.0 },
    { id: 20, estudianteId: 8, materiaId: 3, periodo: 1, nota1: 2.5, nota2: 2.8, nota3: 2.3, definitiva: 2.53 },
    { id: 21, estudianteId: 8, materiaId: 4, periodo: 1, nota1: 3.0, nota2: 3.2, nota3: 3.1, definitiva: 3.1 },
    { id: 22, estudianteId: 8, materiaId: 5, periodo: 1, nota1: 3.5, nota2: 3.8, nota3: 3.6, definitiva: 3.63 },
    { id: 23, estudianteId: 8, materiaId: 6, periodo: 1, nota1: 2.8, nota2: 3.0, nota3: 2.9, definitiva: 2.9 },
    { id: 24, estudianteId: 8, materiaId: 7, periodo: 1, nota1: 4.2, nota2: 4.5, nota3: 4.3, definitiva: 4.33 },
    // Sofía Martínez (11A) - EST005
    { id: 25, estudianteId: 9, materiaId: 2, periodo: 1, nota1: 4.5, nota2: 4.8, nota3: 4.7, definitiva: 4.67 },
    { id: 26, estudianteId: 9, materiaId: 4, periodo: 1, nota1: 4.2, nota2: 4.5, nota3: 4.3, definitiva: 4.33 },
    { id: 27, estudianteId: 9, materiaId: 6, periodo: 1, nota1: 3.8, nota2: 4.0, nota3: 3.9, definitiva: 3.9 },
    { id: 28, estudianteId: 9, materiaId: 7, periodo: 1, nota1: 4.0, nota2: 4.2, nota3: 4.1, definitiva: 4.1 },
    // Andrés López (11A) - EST006
    { id: 29, estudianteId: 10, materiaId: 2, periodo: 1, nota1: 2.8, nota2: 2.5, nota3: 2.9, definitiva: 2.73 },
    { id: 30, estudianteId: 10, materiaId: 4, periodo: 1, nota1: 3.5, nota2: 3.8, nota3: 3.6, definitiva: 3.63 },
    { id: 31, estudianteId: 10, materiaId: 6, periodo: 1, nota1: 4.2, nota2: 4.5, nota3: 4.3, definitiva: 4.33 },
    { id: 32, estudianteId: 10, materiaId: 7, periodo: 1, nota1: 3.5, nota2: 3.8, nota3: 3.6, definitiva: 3.63 },
    // Valentina Cruz (11B) - EST007
    { id: 33, estudianteId: 11, materiaId: 2, periodo: 1, nota1: 5.0, nota2: 4.8, nota3: 4.9, definitiva: 4.9 },
    { id: 34, estudianteId: 11, materiaId: 4, periodo: 1, nota1: 4.8, nota2: 5.0, nota3: 4.9, definitiva: 4.9 },
    { id: 35, estudianteId: 11, materiaId: 6, periodo: 1, nota1: 4.5, nota2: 4.8, nota3: 4.7, definitiva: 4.67 },
    { id: 36, estudianteId: 11, materiaId: 7, periodo: 1, nota1: 4.2, nota2: 4.5, nota3: 4.3, definitiva: 4.33 },
    // Sebastián Ruiz (11B) - EST008
    { id: 37, estudianteId: 12, materiaId: 2, periodo: 1, nota1: 1.5, nota2: 2.0, nota3: 1.8, definitiva: 1.77 },
    { id: 38, estudianteId: 12, materiaId: 4, periodo: 1, nota1: 2.8, nota2: 3.0, nota3: 2.9, definitiva: 2.9 },
    { id: 39, estudianteId: 12, materiaId: 6, periodo: 1, nota1: 3.2, nota2: 3.5, nota3: 3.3, definitiva: 3.33 },
    { id: 40, estudianteId: 12, materiaId: 7, periodo: 1, nota1: 3.8, nota2: 4.0, nota3: 3.9, definitiva: 3.9 },
  ],
  asistencias: [
    // María Torres
    { id: 1, estudianteId: 5, materiaId: 1, fecha: "2024-03-04", estado: "presente" },
    { id: 2, estudianteId: 5, materiaId: 1, fecha: "2024-03-11", estado: "presente" },
    { id: 3, estudianteId: 5, materiaId: 1, fecha: "2024-03-18", estado: "ausente" },
    { id: 4, estudianteId: 5, materiaId: 1, fecha: "2024-03-25", estado: "presente" },
    { id: 5, estudianteId: 5, materiaId: 1, fecha: "2024-04-01", estado: "tardanza" },
    { id: 6, estudianteId: 5, materiaId: 4, fecha: "2024-03-04", estado: "presente" },
    { id: 7, estudianteId: 5, materiaId: 4, fecha: "2024-03-11", estado: "presente" },
    { id: 8, estudianteId: 5, materiaId: 4, fecha: "2024-03-18", estado: "presente" },
    // Pedro Jiménez
    { id: 9, estudianteId: 6, materiaId: 1, fecha: "2024-03-04", estado: "ausente" },
    { id: 10, estudianteId: 6, materiaId: 1, fecha: "2024-03-11", estado: "ausente" },
    { id: 11, estudianteId: 6, materiaId: 1, fecha: "2024-03-18", estado: "presente" },
    { id: 12, estudianteId: 6, materiaId: 1, fecha: "2024-03-25", estado: "tardanza" },
    { id: 13, estudianteId: 6, materiaId: 4, fecha: "2024-03-04", estado: "presente" },
    { id: 14, estudianteId: 6, materiaId: 4, fecha: "2024-03-11", estado: "ausente" },
    // Laura Sánchez
    { id: 15, estudianteId: 7, materiaId: 1, fecha: "2024-03-04", estado: "presente" },
    { id: 16, estudianteId: 7, materiaId: 1, fecha: "2024-03-11", estado: "presente" },
    { id: 17, estudianteId: 7, materiaId: 1, fecha: "2024-03-18", estado: "presente" },
    { id: 18, estudianteId: 7, materiaId: 1, fecha: "2024-03-25", estado: "presente" },
    // Diego Flores
    { id: 19, estudianteId: 8, materiaId: 1, fecha: "2024-03-04", estado: "ausente" },
    { id: 20, estudianteId: 8, materiaId: 1, fecha: "2024-03-11", estado: "tardanza" },
    { id: 21, estudianteId: 8, materiaId: 1, fecha: "2024-03-18", estado: "ausente" },
    { id: 22, estudianteId: 8, materiaId: 1, fecha: "2024-03-25", estado: "presente" },
  ]
};

// ===================== APP STATE =====================
const AppState = {
  currentUser: null,
  data: JSON.parse(JSON.stringify(MOCK_DATA)),
  currentSection: 'dashboard',
  nextId: { usuarios: 13, materias: 8, notas: 41, asistencias: 23 },

  save() { /* In-memory only */ },

  login(email, password) {
    const user = this.data.usuarios.find(u => u.email === email && u.password === password && u.activo);
    if (user) { this.currentUser = user; return true; }
    return false;
  },

  logout() { this.currentUser = null; this.currentSection = 'dashboard'; },

  getEstudiantes() { return this.data.usuarios.filter(u => u.rol === 'estudiante'); },
  getProfesores() { return this.data.usuarios.filter(u => u.rol === 'profesor'); },
  getMaterias() { return this.data.materias; },

  getNotasEstudiante(estudianteId) {
    return this.data.notas.filter(n => n.estudianteId === estudianteId);
  },

  getAsistenciaEstudiante(estudianteId, materiaId = null) {
    let result = this.data.asistencias.filter(a => a.estudianteId === estudianteId);
    if (materiaId) result = result.filter(a => a.materiaId === materiaId);
    return result;
  },

  getProfesorById(id) { return this.data.usuarios.find(u => u.id === id); },
  getMateriaById(id) { return this.data.materias.find(m => m.id === id); },
  getEstudianteById(id) { return this.data.usuarios.find(u => u.id === id && u.rol === 'estudiante'); },

  isAprobado(nota) { return nota >= 3.0; },

  getPromedio(estudianteId) {
    const notas = this.getNotasEstudiante(estudianteId);
    if (!notas.length) return 0;
    return (notas.reduce((s, n) => s + n.definitiva, 0) / notas.length).toFixed(2);
  },

  getPorcentajeAsistencia(estudianteId, materiaId = null) {
    const asistencias = this.getAsistenciaEstudiante(estudianteId, materiaId);
    if (!asistencias.length) return 100;
    const presentes = asistencias.filter(a => a.estado === 'presente' || a.estado === 'tardanza').length;
    return Math.round((presentes / asistencias.length) * 100);
  },

  addNota(data) {
    const id = this.nextId.notas++;
    const nota = { id, ...data };
    this.data.notas.push(nota);
    return nota;
  },

  updateNota(id, data) {
    const idx = this.data.notas.findIndex(n => n.id === id);
    if (idx >= 0) { this.data.notas[idx] = { ...this.data.notas[idx], ...data }; }
  },

  addAsistencia(data) {
    const id = this.nextId.asistencias++;
    this.data.asistencias.push({ id, ...data });
  },

  addEstudiante(data) {
    const id = this.nextId.usuarios++;
    const est = { id, rol: 'estudiante', activo: true, ...data };
    this.data.usuarios.push(est);
    return est;
  },

  addProfesor(data) {
    const id = this.nextId.usuarios++;
    const prof = { id, rol: 'profesor', activo: true, materias: [], ...data };
    this.data.usuarios.push(prof);
    return prof;
  },

  addMateria(data) {
    const id = this.nextId.materias++;
    const mat = { id, ...data };
    this.data.materias.push(mat);
    return mat;
  },

  deleteUsuario(id) {
    const idx = this.data.usuarios.findIndex(u => u.id === id);
    if (idx >= 0) this.data.usuarios[idx].activo = false;
  },

  getEstadisticasGenerales() {
    const estudiantes = this.getEstudiantes();
    const aprobados = estudiantes.filter(e => parseFloat(this.getPromedio(e.id)) >= 3.0).length;
    return {
      totalEstudiantes: estudiantes.length,
      totalProfesores: this.getProfesores().length,
      totalMaterias: this.getMaterias().length,
      aprobados,
      reprobados: estudiantes.length - aprobados,
      promedioGeneral: estudiantes.length ? (estudiantes.reduce((s, e) => s + parseFloat(this.getPromedio(e.id)), 0) / estudiantes.length).toFixed(2) : 0
    };
  }
};
