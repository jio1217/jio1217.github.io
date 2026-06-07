// ===================== UI HELPERS =====================
function getAvatarColors(name) {
  const colors = ['av-blue','av-purple','av-green','av-yellow','av-red'];
  return colors[(name.charCodeAt(0) + (name.charCodeAt(1)||0)) % colors.length];
}

function getNoteClass(nota) {
  if (nota >= 4.0) return 'nota-high';
  if (nota >= 3.0) return 'nota-med';
  return 'nota-low';
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showModal(html) {
  const overlay = document.getElementById('modalOverlay');
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===================== AUTH =====================
function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const err = document.getElementById('loginError');
  if (!email || !password) { err.textContent = 'Completa todos los campos.'; err.style.display = 'block'; return; }
  if (AppState.login(email, password)) {
    err.style.display = 'none';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    initApp();
  } else {
    err.textContent = 'Correo o contraseña incorrectos.';
    err.style.display = 'block';
  }
}

function quickLogin(role) {
  const map = { admin: ['admin@academia.edu','admin123'], profesor: ['carlos@academia.edu','prof123'], estudiante: ['maria@academia.edu','est123'] };
  document.getElementById('loginEmail').value = map[role][0];
  document.getElementById('loginPassword').value = map[role][1];
  login();
}

function logout() {
  AppState.logout();
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

// ===================== INIT APP =====================
function initApp() {
  const u = AppState.currentUser;
  document.getElementById('sidebarUserName').textContent = u.nombre;
  document.getElementById('sidebarUserRole').textContent = { admin: 'Administrador', profesor: 'Docente', estudiante: 'Estudiante' }[u.rol];
  document.getElementById('sidebarUserAvatar').textContent = u.avatar;
  document.getElementById('sidebarUserAvatar').className = `user-avatar ${getAvatarColors(u.nombre)}`;

  buildNav();
  navigateTo('dashboard');
}

function buildNav() {
  const u = AppState.currentUser;
  const navEl = document.getElementById('sidebarNav');
  const navItems = {
    admin: [
      { section: 'Principal', items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      ]},
      { section: 'Gestión', items: [
        { id: 'estudiantes', icon: '🎓', label: 'Estudiantes' },
        { id: 'profesores', icon: '👨‍🏫', label: 'Profesores' },
        { id: 'materias', icon: '📚', label: 'Materias' },
      ]},
      { section: 'Académico', items: [
        { id: 'notas', icon: '📝', label: 'Notas' },
        { id: 'asistencias', icon: '📅', label: 'Asistencias' },
        { id: 'reportes', icon: '📈', label: 'Reportes' },
      ]},
    ],
    profesor: [
      { section: 'Principal', items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      ]},
      { section: 'Mis Clases', items: [
        { id: 'mis-materias', icon: '📚', label: 'Mis Materias' },
        { id: 'notas', icon: '📝', label: 'Gestionar Notas' },
        { id: 'asistencias', icon: '📅', label: 'Tomar Asistencia' },
      ]},
      { section: 'Info', items: [
        { id: 'estudiantes', icon: '🎓', label: 'Mis Estudiantes' },
      ]},
    ],
    estudiante: [
      { section: 'Principal', items: [
        { id: 'dashboard', icon: '📊', label: 'Mi Dashboard' },
      ]},
      { section: 'Académico', items: [
        { id: 'mis-notas', icon: '📝', label: 'Mis Notas' },
        { id: 'mis-asistencias', icon: '📅', label: 'Mi Asistencia' },
        { id: 'mis-materias', icon: '📚', label: 'Mis Materias' },
      ]},
    ],
  };

  navEl.innerHTML = navItems[u.rol].map(sec => `
    <div class="nav-section">
      <div class="nav-section-title">${sec.section}</div>
      ${sec.items.map(item => `
        <div class="nav-item" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
          <span class="nav-icon">${item.icon}</span>
          ${item.label}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function navigateTo(section) {
  AppState.currentSection = section;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + section);
  if (navEl) navEl.classList.add('active');

  const content = document.getElementById('pageContent');
  const titles = {
    'dashboard': 'Dashboard', 'estudiantes': 'Estudiantes', 'profesores': 'Profesores',
    'materias': 'Materias', 'notas': 'Gestión de Notas', 'asistencias': 'Asistencias',
    'reportes': 'Reportes', 'mis-notas': 'Mis Notas', 'mis-asistencias': 'Mi Asistencia',
    'mis-materias': 'Mis Materias',
  };
  document.getElementById('pageTitle').textContent = titles[section] || section;

  const renders = {
    'dashboard': renderDashboard,
    'estudiantes': renderEstudiantes,
    'profesores': renderProfesores,
    'materias': renderMaterias,
    'notas': renderNotas,
    'asistencias': renderAsistencias,
    'reportes': renderReportes,
    'mis-notas': renderMisNotas,
    'mis-asistencias': renderMisAsistencias,
    'mis-materias': renderMisMaterias,
  };

  if (renders[section]) {
    content.innerHTML = '';
    renders[section](content);
  }
}

// ===================== DASHBOARD =====================
function renderDashboard(el) {
  const u = AppState.currentUser;
  if (u.rol === 'admin') renderDashboardAdmin(el);
  else if (u.rol === 'profesor') renderDashboardProfesor(el);
  else renderDashboardEstudiante(el);
}

function renderDashboardAdmin(el) {
  const stats = AppState.getEstadisticasGenerales();
  const estudiantes = AppState.getEstudiantes();

  const topEstudiantes = estudiantes
    .map(e => ({ ...e, promedio: parseFloat(AppState.getPromedio(e.id)) }))
    .sort((a, b) => b.promedio - a.promedio)
    .slice(0, 5);

  const bajoRendimiento = estudiantes
    .map(e => ({ ...e, promedio: parseFloat(AppState.getPromedio(e.id)) }))
    .filter(e => e.promedio < 3.0 && e.promedio > 0)
    .sort((a, b) => a.promedio - b.promedio);

  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🎓</div>
        <div class="stat-info">
          <div class="stat-value">${stats.totalEstudiantes}</div>
          <div class="stat-label">Estudiantes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">👨‍🏫</div>
        <div class="stat-info">
          <div class="stat-value">${stats.totalProfesores}</div>
          <div class="stat-label">Profesores</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">📚</div>
        <div class="stat-info">
          <div class="stat-value">${stats.totalMaterias}</div>
          <div class="stat-label">Materias</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-value">${stats.aprobados}</div>
          <div class="stat-label">Aprobados</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">❌</div>
        <div class="stat-info">
          <div class="stat-value">${stats.reprobados}</div>
          <div class="stat-label">Reprobados</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">⭐</div>
        <div class="stat-info">
          <div class="stat-value">${stats.promedioGeneral}</div>
          <div class="stat-label">Promedio General</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:20px">
      <div class="card">
        <div class="section-title">🏆 Top Estudiantes</div>
        ${topEstudiantes.map((e, i) => `
          <div class="flex align-center justify-between" style="margin-bottom:12px">
            <div class="flex align-center gap-8">
              <span style="font-size:18px">${['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
              <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
              <div>
                <div style="font-size:13px;font-weight:600">${e.nombre}</div>
                <div style="font-size:11px;color:var(--text3)">${e.grado} · ${e.codigo}</div>
              </div>
            </div>
            <div class="nota-chip ${getNoteClass(e.promedio)}">${e.promedio.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="section-title">⚠️ Bajo Rendimiento</div>
        ${bajoRendimiento.length ? bajoRendimiento.map(e => `
          <div class="flex align-center justify-between" style="margin-bottom:12px">
            <div class="flex align-center gap-8">
              <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
              <div>
                <div style="font-size:13px;font-weight:600">${e.nombre}</div>
                <div style="font-size:11px;color:var(--text3)">${e.grado}</div>
              </div>
            </div>
            <div class="flex align-center gap-8">
              <div class="nota-chip nota-low">${e.promedio.toFixed(2)}</div>
              <span class="badge badge-reprobado">Reprobado</span>
            </div>
          </div>
        `).join('') : '<div class="empty-state"><div class="icon">🎉</div><h3>Sin estudiantes en bajo rendimiento</h3></div>'}
      </div>
    </div>

    <div class="card mt-24">
      <div class="section-title">📊 Distribución de Notas por Materia</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:20px;margin-top:8px">
        ${AppState.getMaterias().map(m => {
          const notasMateria = AppState.data.notas.filter(n => n.materiaId === m.id);
          const prom = notasMateria.length ? (notasMateria.reduce((s,n)=>s+n.definitiva,0)/notasMateria.length).toFixed(1) : 0;
          const aprobados = notasMateria.filter(n=>n.definitiva>=3).length;
          return `
            <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px;border:1px solid var(--border)">
              <div style="width:8px;height:8px;border-radius:50%;background:${m.color};margin:0 auto 8px"></div>
              <div style="font-size:11px;color:var(--text2);margin-bottom:6px;font-weight:600">${m.nombre}</div>
              <div class="nota-chip ${getNoteClass(parseFloat(prom))}" style="display:inline-flex;margin-bottom:6px">${prom}</div>
              <div style="font-size:10px;color:var(--text3)">${aprobados}/${notasMateria.length} aprobados</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderDashboardProfesor(el) {
  const u = AppState.currentUser;
  const misMaterias = AppState.getMaterias().filter(m => m.profesorId === u.id);
  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📚</div>
        <div class="stat-info"><div class="stat-value">${misMaterias.length}</div><div class="stat-label">Mis Materias</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🎓</div>
        <div class="stat-info">
          <div class="stat-value">${[...new Set(misMaterias.flatMap(m => m.grados))].length}</div>
          <div class="stat-label">Grados</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">📚 Mis Materias</div>
      ${misMaterias.map(m => {
        const notasMateria = AppState.data.notas.filter(n => n.materiaId === m.id);
        const prom = notasMateria.length ? (notasMateria.reduce((s,n)=>s+n.definitiva,0)/notasMateria.length).toFixed(2) : '-';
        return `
          <div class="notas-materia-card" style="cursor:pointer" onclick="navigateTo('notas')">
            <div class="flex align-center justify-between">
              <div class="flex align-center gap-8">
                <div style="width:12px;height:12px;border-radius:4px;background:${m.color}"></div>
                <div>
                  <div style="font-weight:700">${m.nombre}</div>
                  <div style="font-size:12px;color:var(--text2)">${m.codigo} · Grados: ${m.grados.join(', ')}</div>
                </div>
              </div>
              <div class="nota-chip ${getNoteClass(parseFloat(prom))}">${prom}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderDashboardEstudiante(el) {
  const u = AppState.currentUser;
  const notas = AppState.getNotasEstudiante(u.id);
  const promedio = parseFloat(AppState.getPromedio(u.id));
  const asistPct = AppState.getPorcentajeAsistencia(u.id);
  const aprobadas = notas.filter(n => n.definitiva >= 3).length;
  const reprobadas = notas.filter(n => n.definitiva < 3).length;

  el.innerHTML = `
    <div class="resumen-card mb-16">
      <div class="flex align-center gap-8 mb-16">
        <div class="avatar ${getAvatarColors(u.nombre)}" style="width:56px;height:56px;font-size:18px">${u.avatar}</div>
        <div>
          <div style="font-size:22px;font-weight:800;font-family:'Sora',sans-serif">${u.nombre}</div>
          <div style="color:var(--text2);font-size:14px">Grado ${u.grado} · Código: ${u.codigo}</div>
        </div>
      </div>
      <div class="grid-3">
        <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
          <div class="nota-chip ${getNoteClass(promedio)}" style="font-size:24px;padding:8px 16px;margin-bottom:6px">${promedio > 0 ? promedio : '-'}</div>
          <div style="font-size:12px;color:var(--text2)">Promedio General</div>
          <div style="margin-top:8px">${promedio >= 3 ? '<span class="badge badge-aprobado">✓ Aprobado</span>' : '<span class="badge badge-reprobado">✕ Reprobado</span>'}</div>
        </div>
        <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
          <div style="font-size:28px;font-weight:800;font-family:'Sora',sans-serif;color:var(--primary)">${asistPct}%</div>
          <div style="font-size:12px;color:var(--text2)">Asistencia</div>
          <div class="progress-bar mt-8"><div class="progress-fill" style="width:${asistPct}%;background:var(--primary)"></div></div>
        </div>
        <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
          <div class="flex justify-between" style="margin-bottom:4px">
            <span style="font-size:20px;font-weight:800;color:var(--green)">${aprobadas}✓</span>
            <span style="font-size:20px;font-weight:800;color:var(--red)">${reprobadas}✕</span>
          </div>
          <div style="font-size:12px;color:var(--text2)">Materias Aprobadas / Reprobadas</div>
        </div>
      </div>
    </div>

    <div class="section-title">📝 Resumen de Notas</div>
    ${notas.length ? notas.map(n => {
      const m = AppState.getMateriaById(n.materiaId);
      return m ? `
        <div class="notas-materia-card">
          <div class="flex align-center justify-between mb-16">
            <div class="flex align-center gap-8">
              <div style="width:10px;height:10px;border-radius:50%;background:${m.color}"></div>
              <div style="font-weight:700">${m.nombre}</div>
              <span class="badge badge-info">${m.codigo}</span>
            </div>
            <div class="flex align-center gap-8">
              <div class="nota-chip ${getNoteClass(n.definitiva)}">${n.definitiva.toFixed(2)}</div>
              <span class="badge ${n.definitiva >= 3 ? 'badge-aprobado' : 'badge-reprobado'}">${n.definitiva >= 3 ? '✓ Aprobado' : '✕ Reprobado'}</span>
            </div>
          </div>
          <div class="notas-grid">
            ${[{l:'Nota 1',v:n.nota1},{l:'Nota 2',v:n.nota2},{l:'Nota 3',v:n.nota3},{l:'Definitiva',v:n.definitiva}].map(x=>`
              <div class="nota-item">
                <div class="nota-label">${x.l}</div>
                <div class="nota-chip ${getNoteClass(x.v)}">${x.v.toFixed(1)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '';
    }).join('') : '<div class="empty-state"><div class="icon">📝</div><h3>Sin notas registradas</h3></div>'}
  `;
}

// ===================== ESTUDIANTES =====================
function renderEstudiantes(el) {
  const u = AppState.currentUser;
  const canAdd = u.rol === 'admin';
  let estudiantes = AppState.getEstudiantes().filter(e => e.activo);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Estudiantes</div>
        <div class="page-subtitle">${estudiantes.length} estudiantes registrados</div>
      </div>
      ${canAdd ? `<button class="btn btn-primary btn-sm" onclick="modalAddEstudiante()">➕ Nuevo Estudiante</button>` : ''}
    </div>
    <div class="search-bar">
      <input type="text" class="search-input" placeholder="🔍 Buscar por nombre, código o grado..." oninput="filterEstudiantes(this.value)">
      <select class="search-input" style="max-width:160px" onchange="filterEstudiantes('', this.value)" id="gradoFilter">
        <option value="">Todos los grados</option>
        ${[...new Set(estudiantes.map(e=>e.grado))].sort().map(g=>`<option value="${g}">${g}</option>`).join('')}
      </select>
    </div>
    <div class="table-container">
      <table id="tablaEstudiantes">
        <thead><tr>
          <th>Estudiante</th><th>Código</th><th>Grado</th><th>Correo</th>
          <th>Promedio</th><th>Estado Académico</th><th>Asistencia</th><th>Acciones</th>
        </tr></thead>
        <tbody id="tbodyEstudiantes">
          ${renderFilasEstudiantes(estudiantes)}
        </tbody>
      </table>
    </div>
  `;
}

function renderFilasEstudiantes(estudiantes) {
  return estudiantes.map(e => {
    const prom = parseFloat(AppState.getPromedio(e.id));
    const asist = AppState.getPorcentajeAsistencia(e.id);
    return `
      <tr>
        <td>
          <div class="flex align-center gap-8">
            <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
            <div>
              <div style="font-weight:600;font-size:14px">${e.nombre}</div>
              <div style="font-size:11px;color:var(--text3)">${e.email}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-info">${e.codigo}</span></td>
        <td><span style="font-weight:600">${e.grado}</span></td>
        <td style="color:var(--text2);font-size:13px">${e.email}</td>
        <td><div class="nota-chip ${getNoteClass(prom)}">${prom > 0 ? prom.toFixed(2) : '-'}</div></td>
        <td>${prom > 0 ? `<span class="badge ${prom >= 3 ? 'badge-aprobado' : 'badge-reprobado'}">${prom >= 3 ? '✓ Aprobado' : '✕ Reprobado'}</span>` : '<span class="badge badge-info">Sin notas</span>'}</td>
        <td>
          <div class="flex align-center gap-8">
            <span style="font-weight:700;font-size:13px">${asist}%</span>
            <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${asist}%;background:${asist>=80?'var(--green)':asist>=60?'var(--yellow)':'var(--red)'}"></div></div>
          </div>
        </td>
        <td>
          <div class="flex gap-8">
            <button class="btn btn-secondary btn-xs" onclick="modalVerEstudiante(${e.id})">👁 Ver</button>
            ${AppState.currentUser.rol === 'admin' ? `<button class="btn btn-danger btn-xs" onclick="eliminarEstudiante(${e.id})">🗑</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="8"><div class="empty-state"><div class="icon">🎓</div><h3>No hay estudiantes</h3></div></td></tr>';
}

function filterEstudiantes(search, grado) {
  if (grado === undefined) grado = document.getElementById('gradoFilter')?.value || '';
  let est = AppState.getEstudiantes().filter(e => e.activo);
  if (search) est = est.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()) || e.codigo.toLowerCase().includes(search.toLowerCase()) || e.grado.toLowerCase().includes(search.toLowerCase()));
  if (grado) est = est.filter(e => e.grado === grado);
  document.getElementById('tbodyEstudiantes').innerHTML = renderFilasEstudiantes(est);
}

function modalVerEstudiante(id) {
  const e = AppState.getEstudianteById(id);
  if (!e) return;
  const notas = AppState.getNotasEstudiante(id);
  const prom = parseFloat(AppState.getPromedio(id));
  const asist = AppState.getPorcentajeAsistencia(id);

  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="flex align-center gap-8">
            <div class="avatar ${getAvatarColors(e.nombre)}" style="width:48px;height:48px;font-size:16px">${e.avatar}</div>
            <div>
              <h3>${e.nombre}</h3>
              <div style="font-size:12px;color:var(--text2)">${e.grado} · ${e.codigo}</div>
            </div>
          </div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>

        <div class="grid-3 mb-16">
          <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
            <div class="nota-chip ${getNoteClass(prom)}" style="font-size:22px;margin-bottom:4px">${prom > 0 ? prom.toFixed(2) : '-'}</div>
            <div style="font-size:11px;color:var(--text2)">Promedio</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
            <div style="font-size:22px;font-weight:800;color:var(--primary);margin-bottom:4px">${asist}%</div>
            <div style="font-size:11px;color:var(--text2)">Asistencia</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg3);border-radius:12px">
            <div style="font-size:22px;font-weight:800;margin-bottom:4px">${prom >= 3 ? '✅' : '❌'}</div>
            <div style="font-size:11px;color:var(--text2)">${prom >= 3 ? 'Aprobado' : 'Reprobado'}</div>
          </div>
        </div>

        <div class="section-title">Notas por Materia</div>
        ${notas.length ? notas.map(n => {
          const m = AppState.getMateriaById(n.materiaId);
          return m ? `
            <div style="background:var(--bg3);border-radius:12px;padding:16px;margin-bottom:10px;border:1px solid var(--border)">
              <div class="flex align-center justify-between mb-16">
                <div class="flex align-center gap-8">
                  <div style="width:8px;height:8px;border-radius:50%;background:${m.color}"></div>
                  <span style="font-weight:600">${m.nombre}</span>
                  <span class="badge badge-info">${m.codigo}</span>
                </div>
                <div class="flex gap-8">
                  <div class="nota-chip ${getNoteClass(n.definitiva)}">${n.definitiva.toFixed(2)}</div>
                  <span class="badge ${n.definitiva>=3?'badge-aprobado':'badge-reprobado'}">${n.definitiva>=3?'✓ Aprobado':'✕ Reprobado'}</span>
                </div>
              </div>
              <div class="notas-grid">
                ${[{l:'Nota 1',v:n.nota1},{l:'Nota 2',v:n.nota2},{l:'Nota 3',v:n.nota3},{l:'Definitiva',v:n.definitiva}].map(x=>`
                  <div class="nota-item">
                    <div class="nota-label">${x.l}</div>
                    <div class="nota-chip ${getNoteClass(x.v)}">${x.v.toFixed(1)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : '';
        }).join('') : '<div class="alert alert-info">Sin notas registradas aún.</div>'}

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `);
}

function modalAddEstudiante() {
  const grados = ['10A','10B','11A','11B','9A','9B'];
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Nuevo Estudiante</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group"><label>Nombre Completo</label><input type="text" id="f-nombre" placeholder="Ej: Juan Pérez"></div>
        <div class="grid-2">
          <div class="form-group"><label>Correo</label><input type="email" id="f-email" placeholder="juan@academia.edu"></div>
          <div class="form-group"><label>Contraseña</label><input type="password" id="f-pass" placeholder="Contraseña" value="est123"></div>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Grado</label>
            <select id="f-grado">${grados.map(g=>`<option value="${g}">${g}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Código</label><input type="text" id="f-codigo" placeholder="EST009"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarEstudiante()">Guardar</button>
        </div>
      </div>
    </div>
  `);
}

function guardarEstudiante() {
  const nombre = document.getElementById('f-nombre').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const password = document.getElementById('f-pass').value.trim();
  const grado = document.getElementById('f-grado').value;
  const codigo = document.getElementById('f-codigo').value.trim();
  if (!nombre || !email || !password || !codigo) { showToast('Completa todos los campos', 'error'); return; }
  const initials = nombre.split(' ').map(p=>p[0]).join('').substring(0,2).toUpperCase();
  AppState.addEstudiante({ nombre, email, password, grado, codigo, avatar: initials });
  closeModal();
  showToast('Estudiante registrado exitosamente');
  navigateTo('estudiantes');
}

function eliminarEstudiante(id) {
  if (confirm('¿Eliminar este estudiante?')) {
    AppState.deleteUsuario(id);
    showToast('Estudiante eliminado');
    navigateTo('estudiantes');
  }
}

// ===================== PROFESORES =====================
function renderProfesores(el) {
  const profesores = AppState.getProfesores().filter(p => p.activo);
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Profesores</div>
        <div class="page-subtitle">${profesores.length} docentes registrados</div>
      </div>
      ${AppState.currentUser.rol === 'admin' ? `<button class="btn btn-primary btn-sm" onclick="modalAddProfesor()">➕ Nuevo Profesor</button>` : ''}
    </div>
    <div class="grid-2" style="gap:20px">
      ${profesores.map(p => {
        const misMats = AppState.getMaterias().filter(m => m.profesorId === p.id);
        return `
          <div class="card" style="display:flex;gap:16px">
            <div class="avatar ${getAvatarColors(p.nombre)}" style="width:52px;height:52px;font-size:18px;flex-shrink:0">${p.avatar}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:15px">${p.nombre}</div>
              <div style="font-size:12px;color:var(--text2);margin-bottom:8px">${p.email}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${misMats.map(m=>`<span class="badge badge-info" style="border-left:2px solid ${m.color}">${m.nombre}</span>`).join('') || '<span class="text-muted text-small">Sin materias asignadas</span>'}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function modalAddProfesor() {
  const materias = AppState.getMaterias();
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Nuevo Profesor</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group"><label>Nombre Completo</label><input type="text" id="f-nombre" placeholder="Ej: Dra. Claudia Vega"></div>
        <div class="grid-2">
          <div class="form-group"><label>Correo</label><input type="email" id="f-email" placeholder="prof@academia.edu"></div>
          <div class="form-group"><label>Contraseña</label><input type="password" id="f-pass" value="prof123"></div>
        </div>
        <div class="form-group"><label>Materias a impartir</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
            ${materias.map(m=>`<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px"><input type="checkbox" value="${m.id}"> ${m.nombre}</label>`).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarProfesor()">Guardar</button>
        </div>
      </div>
    </div>
  `);
}

function guardarProfesor() {
  const nombre = document.getElementById('f-nombre').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const password = document.getElementById('f-pass').value.trim();
  if (!nombre || !email) { showToast('Completa los campos requeridos', 'error'); return; }
  const initials = nombre.split(' ').map(p=>p[0]).join('').substring(0,2).toUpperCase();
  AppState.addProfesor({ nombre, email, password, avatar: initials });
  closeModal();
  showToast('Profesor registrado exitosamente');
  navigateTo('profesores');
}

// ===================== MATERIAS =====================
function renderMaterias(el) {
  const materias = AppState.getMaterias();
  const canAdd = AppState.currentUser.rol === 'admin';
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Materias</div>
        <div class="page-subtitle">${materias.length} materias registradas</div>
      </div>
      ${canAdd ? `<button class="btn btn-primary btn-sm" onclick="modalAddMateria()">➕ Nueva Materia</button>` : ''}
    </div>
    <div class="grid-2" style="gap:20px">
      ${materias.map(m => {
        const prof = AppState.getProfesorById(m.profesorId);
        const notasM = AppState.data.notas.filter(n=>n.materiaId===m.id);
        const prom = notasM.length ? (notasM.reduce((s,n)=>s+n.definitiva,0)/notasM.length).toFixed(2) : '-';
        return `
          <div class="card" style="border-top:3px solid ${m.color}">
            <div class="flex align-center justify-between mb-16">
              <div>
                <div style="font-weight:800;font-size:16px;font-family:'Sora',sans-serif">${m.nombre}</div>
                <div style="font-size:12px;color:var(--text2)">${m.codigo} · ${m.creditosHoras} horas/semana</div>
              </div>
              <div class="nota-chip ${getNoteClass(parseFloat(prom))}">${prom}</div>
            </div>
            <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${m.descripcion}</div>
            <div class="flex align-center gap-8 mb-8">
              ${prof ? `<div class="avatar ${getAvatarColors(prof.nombre)}" style="width:28px;height:28px;font-size:11px">${prof.avatar}</div>
              <span style="font-size:13px">${prof.nombre}</span>` : ''}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${m.grados.map(g=>`<span class="badge badge-info">${g}</span>`).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function modalAddMateria() {
  const profesores = AppState.getProfesores();
  const colores = ['#6366f1','#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981','#f97316','#ec4899'];
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>📚 Nueva Materia</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Nombre</label><input type="text" id="f-nombre" placeholder="Ej: Biología"></div>
          <div class="form-group"><label>Código</label><input type="text" id="f-codigo" placeholder="BIO101"></div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea id="f-desc" rows="2" placeholder="Descripción breve..."></textarea></div>
        <div class="grid-2">
          <div class="form-group"><label>Horas/Semana</label><input type="number" id="f-horas" value="3" min="1" max="8"></div>
          <div class="form-group"><label>Profesor</label>
            <select id="f-prof">${profesores.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('')}</select>
          </div>
        </div>
        <div class="form-group"><label>Grados</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
            ${['9A','9B','10A','10B','11A','11B'].map(g=>`<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px"><input type="checkbox" value="${g}"> ${g}</label>`).join('')}
          </div>
        </div>
        <div class="form-group"><label>Color</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
            ${colores.map(c=>`<div onclick="this.parentNode.querySelectorAll('div').forEach(d=>d.style.outline='');this.style.outline='3px solid white'" style="width:28px;height:28px;border-radius:8px;background:${c};cursor:pointer;data-color='${c}'" data-color="${c}"></div>`).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarMateria()">Guardar</button>
        </div>
      </div>
    </div>
  `);
}

function guardarMateria() {
  const nombre = document.getElementById('f-nombre').value.trim();
  const codigo = document.getElementById('f-codigo').value.trim();
  const descripcion = document.getElementById('f-desc').value.trim();
  const creditosHoras = parseInt(document.getElementById('f-horas').value);
  const profesorId = parseInt(document.getElementById('f-prof').value);
  const grados = [...document.querySelectorAll('[data-color] input:checked, input[type=checkbox]:checked')].filter(c=>['9A','9B','10A','10B','11A','11B'].includes(c.value)).map(c=>c.value);
  const colorEl = document.querySelector('[data-color][style*="outline"]');
  const color = colorEl ? colorEl.dataset.color : '#6366f1';
  if (!nombre || !codigo) { showToast('Completa los campos requeridos', 'error'); return; }
  AppState.addMateria({ nombre, codigo, descripcion, creditosHoras, profesorId, grados: grados.length ? grados : ['10A'], color });
  closeModal();
  showToast('Materia registrada exitosamente');
  navigateTo('materias');
}

// ===================== NOTAS =====================
function renderNotas(el) {
  const u = AppState.currentUser;
  const materias = u.rol === 'profesor' ? AppState.getMaterias().filter(m => m.profesorId === u.id) : AppState.getMaterias();
  const estudiantes = AppState.getEstudiantes().filter(e=>e.activo);

  let selectedMateriaId = materias[0]?.id;
  let selectedGrado = null;

  function renderTable(materiaId, gradoFilter) {
    const mat = AppState.getMateriaById(materiaId);
    if (!mat) return '<div class="empty-state"><div class="icon">📚</div><h3>Selecciona una materia</h3></div>';
    let ests = estudiantes.filter(e => mat.grados.includes(e.grado));
    if (gradoFilter) ests = ests.filter(e => e.grado === gradoFilter);

    return `
      <div class="table-container">
        <table>
          <thead><tr>
            <th>Estudiante</th><th>Grado</th><th>Nota 1</th><th>Nota 2</th><th>Nota 3</th><th>Definitiva</th><th>Estado</th>
            ${u.rol !== 'estudiante' ? '<th>Acciones</th>' : ''}
          </tr></thead>
          <tbody>
            ${ests.map(e => {
              const nota = AppState.data.notas.find(n => n.estudianteId === e.id && n.materiaId === materiaId);
              return `
                <tr>
                  <td>
                    <div class="flex align-center gap-8">
                      <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
                      <div>
                        <div style="font-weight:600">${e.nombre}</div>
                        <div style="font-size:11px;color:var(--text3)">${e.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td>${e.grado}</td>
                  ${nota ? `
                    <td><div class="nota-chip ${getNoteClass(nota.nota1)}">${nota.nota1.toFixed(1)}</div></td>
                    <td><div class="nota-chip ${getNoteClass(nota.nota2)}">${nota.nota2.toFixed(1)}</div></td>
                    <td><div class="nota-chip ${getNoteClass(nota.nota3)}">${nota.nota3.toFixed(1)}</div></td>
                    <td><div class="nota-chip ${getNoteClass(nota.definitiva)}" style="font-weight:800">${nota.definitiva.toFixed(2)}</div></td>
                    <td><span class="badge ${nota.definitiva>=3?'badge-aprobado':'badge-reprobado'}">${nota.definitiva>=3?'✓ Aprobado':'✕ Reprobado'}</span></td>
                    ${u.rol !== 'estudiante' ? `<td><button class="btn btn-secondary btn-xs" onclick="modalEditarNota(${nota.id})">✏️ Editar</button></td>` : ''}
                  ` : `
                    <td colspan="4"><span style="color:var(--text3);font-size:12px">Sin notas registradas</span></td>
                    <td><span class="badge badge-info">Pendiente</span></td>
                    ${u.rol !== 'estudiante' ? `<td><button class="btn btn-success btn-xs" onclick="modalAgregarNota(${e.id}, ${materiaId})">➕ Agregar</button></td>` : ''}
                  `}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Gestión de Notas</div>
      ${u.rol !== 'estudiante' ? `<button class="btn btn-primary btn-sm" onclick="modalAgregarNotaGeneral()">➕ Agregar Nota</button>` : ''}
    </div>
    <div class="flex gap-8 mb-16" style="flex-wrap:wrap">
      ${materias.map(m=>`
        <div class="tab ${m.id===selectedMateriaId?'active':''}" onclick="selectMateriaNotas(${m.id},this)" style="border-bottom-color:${m.color}">
          ${m.nombre}
        </div>
      `).join('')}
    </div>
    <div id="notasTableContent">
      ${renderTable(selectedMateriaId, null)}
    </div>
  `;

  window.selectMateriaNotas = function(id, tab) {
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    selectedMateriaId = id;
    document.getElementById('notasTableContent').innerHTML = renderTable(id, selectedGrado);
  };
}

function modalAgregarNota(estudianteId, materiaId) {
  const e = AppState.getEstudianteById(estudianteId);
  const m = AppState.getMateriaById(materiaId);
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>📝 Agregar Nota</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="alert alert-info">${e?.nombre} · ${m?.nombre}</div>
        <div class="grid-3">
          <div class="form-group"><label>Nota 1 (0-5)</label><input type="number" id="fn-1" min="0" max="5" step="0.1" placeholder="0.0"></div>
          <div class="form-group"><label>Nota 2 (0-5)</label><input type="number" id="fn-2" min="0" max="5" step="0.1" placeholder="0.0"></div>
          <div class="form-group"><label>Nota 3 (0-5)</label><input type="number" id="fn-3" min="0" max="5" step="0.1" placeholder="0.0"></div>
        </div>
        <div id="defDisplay" class="alert alert-info hidden">Definitiva calculada: -</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarNota(${estudianteId},${materiaId})">Guardar Nota</button>
        </div>
      </div>
    </div>
  `);
  ['fn-1','fn-2','fn-3'].forEach(id=>{
    document.getElementById(id).addEventListener('input', calcularDefinitiva);
  });
}

function modalEditarNota(notaId) {
  const nota = AppState.data.notas.find(n=>n.id===notaId);
  if (!nota) return;
  const e = AppState.getEstudianteById(nota.estudianteId);
  const m = AppState.getMateriaById(nota.materiaId);
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>✏️ Editar Nota</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="alert alert-info">${e?.nombre} · ${m?.nombre}</div>
        <div class="grid-3">
          <div class="form-group"><label>Nota 1</label><input type="number" id="fn-1" min="0" max="5" step="0.1" value="${nota.nota1}"></div>
          <div class="form-group"><label>Nota 2</label><input type="number" id="fn-2" min="0" max="5" step="0.1" value="${nota.nota2}"></div>
          <div class="form-group"><label>Nota 3</label><input type="number" id="fn-3" min="0" max="5" step="0.1" value="${nota.nota3}"></div>
        </div>
        <div id="defDisplay" class="alert alert-info">Definitiva actual: ${nota.definitiva.toFixed(2)}</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="actualizarNota(${notaId})">Actualizar</button>
        </div>
      </div>
    </div>
  `);
  ['fn-1','fn-2','fn-3'].forEach(id=>{
    document.getElementById(id).addEventListener('input', calcularDefinitiva);
  });
}

function calcularDefinitiva() {
  const n1 = parseFloat(document.getElementById('fn-1').value)||0;
  const n2 = parseFloat(document.getElementById('fn-2').value)||0;
  const n3 = parseFloat(document.getElementById('fn-3').value)||0;
  const def = ((n1+n2+n3)/3).toFixed(2);
  const el = document.getElementById('defDisplay');
  el.classList.remove('hidden');
  el.className = `alert ${parseFloat(def)>=3?'alert-success':'alert-error'}`;
  el.textContent = `Definitiva calculada: ${def} (${parseFloat(def)>=3?'Aprobado':'Reprobado'})`;
}

function guardarNota(estudianteId, materiaId) {
  const n1 = parseFloat(document.getElementById('fn-1').value);
  const n2 = parseFloat(document.getElementById('fn-2').value);
  const n3 = parseFloat(document.getElementById('fn-3').value);
  if (isNaN(n1)||isNaN(n2)||isNaN(n3)) { showToast('Ingresa las 3 notas', 'error'); return; }
  const def = parseFloat(((n1+n2+n3)/3).toFixed(2));
  AppState.addNota({ estudianteId, materiaId, periodo: 1, nota1: n1, nota2: n2, nota3: n3, definitiva: def });
  closeModal();
  showToast('Nota guardada exitosamente');
  navigateTo('notas');
}

function actualizarNota(notaId) {
  const n1 = parseFloat(document.getElementById('fn-1').value);
  const n2 = parseFloat(document.getElementById('fn-2').value);
  const n3 = parseFloat(document.getElementById('fn-3').value);
  if (isNaN(n1)||isNaN(n2)||isNaN(n3)) { showToast('Ingresa las 3 notas', 'error'); return; }
  const def = parseFloat(((n1+n2+n3)/3).toFixed(2));
  AppState.updateNota(notaId, { nota1: n1, nota2: n2, nota3: n3, definitiva: def });
  closeModal();
  showToast('Nota actualizada');
  navigateTo('notas');
}

function modalAgregarNotaGeneral() {
  const materias = AppState.currentUser.rol === 'profesor' ? AppState.getMaterias().filter(m=>m.profesorId===AppState.currentUser.id) : AppState.getMaterias();
  const estudiantes = AppState.getEstudiantes().filter(e=>e.activo);
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>📝 Agregar Nota</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group"><label>Materia</label>
          <select id="fn-mat">${materias.map(m=>`<option value="${m.id}">${m.nombre}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Estudiante</label>
          <select id="fn-est">${estudiantes.map(e=>`<option value="${e.id}">${e.nombre} (${e.grado})</option>`).join('')}</select>
        </div>
        <div class="grid-3">
          <div class="form-group"><label>Nota 1</label><input type="number" id="fn-1" min="0" max="5" step="0.1" placeholder="0.0"></div>
          <div class="form-group"><label>Nota 2</label><input type="number" id="fn-2" min="0" max="5" step="0.1" placeholder="0.0"></div>
          <div class="form-group"><label>Nota 3</label><input type="number" id="fn-3" min="0" max="5" step="0.1" placeholder="0.0"></div>
        </div>
        <div id="defDisplay" class="alert alert-info hidden"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarNotaGeneral()">Guardar</button>
        </div>
      </div>
    </div>
  `);
  ['fn-1','fn-2','fn-3'].forEach(id=>{ document.getElementById(id).addEventListener('input', calcularDefinitiva); });
}

function guardarNotaGeneral() {
  const materiaId = parseInt(document.getElementById('fn-mat').value);
  const estudianteId = parseInt(document.getElementById('fn-est').value);
  const n1 = parseFloat(document.getElementById('fn-1').value);
  const n2 = parseFloat(document.getElementById('fn-2').value);
  const n3 = parseFloat(document.getElementById('fn-3').value);
  if (isNaN(n1)||isNaN(n2)||isNaN(n3)) { showToast('Ingresa las 3 notas', 'error'); return; }
  const def = parseFloat(((n1+n2+n3)/3).toFixed(2));
  AppState.addNota({ estudianteId, materiaId, periodo: 1, nota1: n1, nota2: n2, nota3: n3, definitiva: def });
  closeModal();
  showToast('Nota guardada exitosamente');
  navigateTo('notas');
}

// ===================== ASISTENCIAS =====================
function renderAsistencias(el) {
  const u = AppState.currentUser;
  const materias = u.rol === 'profesor' ? AppState.getMaterias().filter(m=>m.profesorId===u.id) : AppState.getMaterias();
  let selectedMateriaId = materias[0]?.id;

  function renderAsistTable(materiaId) {
    const mat = AppState.getMateriaById(materiaId);
    if (!mat) return '';
    const ests = AppState.getEstudiantes().filter(e=>e.activo && mat.grados.includes(e.grado));

    return `
      <div class="page-header" style="margin-bottom:16px">
        ${u.rol !== 'estudiante' ? `<button class="btn btn-primary btn-sm" onclick="modalRegistrarAsistencia(${materiaId})">📅 Registrar Clase</button>` : ''}
      </div>
      <div class="table-container">
        <table>
          <thead><tr>
            <th>Estudiante</th><th>Grado</th><th>Presentes</th><th>Ausentes</th><th>Tardanzas</th><th>Total</th><th>% Asistencia</th><th>Últimas Clases</th>
          </tr></thead>
          <tbody>
            ${ests.map(e => {
              const asists = AppState.getAsistenciaEstudiante(e.id, materiaId);
              const presentes = asists.filter(a=>a.estado==='presente').length;
              const ausentes = asists.filter(a=>a.estado==='ausente').length;
              const tardanzas = asists.filter(a=>a.estado==='tardanza').length;
              const total = asists.length;
              const pct = total ? Math.round(((presentes+tardanzas)/total)*100) : 100;
              const ultimas = asists.slice(-5);
              return `
                <tr>
                  <td>
                    <div class="flex align-center gap-8">
                      <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
                      <div>
                        <div style="font-weight:600">${e.nombre}</div>
                        <div style="font-size:11px;color:var(--text3)">${e.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td>${e.grado}</td>
                  <td><span style="color:var(--green);font-weight:700">${presentes}</span></td>
                  <td><span style="color:var(--red);font-weight:700">${ausentes}</span></td>
                  <td><span style="color:var(--yellow);font-weight:700">${tardanzas}</span></td>
                  <td>${total}</td>
                  <td>
                    <div class="flex align-center gap-8">
                      <span style="font-weight:700;color:${pct>=80?'var(--green)':pct>=60?'var(--yellow)':'var(--red)'}">${pct}%</span>
                      <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${pct}%;background:${pct>=80?'var(--green)':pct>=60?'var(--yellow)':'var(--red)'}"></div></div>
                    </div>
                  </td>
                  <td>
                    <div class="asist-dots">
                      ${ultimas.map(a=>`<div class="asist-dot dot-${a.estado}" title="${a.fecha} - ${a.estado}">${a.estado==='presente'?'P':a.estado==='ausente'?'A':'T'}</div>`).join('')}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Asistencias</div>
    </div>
    <div class="flex gap-8 mb-16" style="flex-wrap:wrap">
      ${materias.map(m=>`
        <div class="tab ${m.id===selectedMateriaId?'active':''}" onclick="selectMateriaAsist(${m.id},this)">${m.nombre}</div>
      `).join('')}
    </div>
    <div id="asistContent">${renderAsistTable(selectedMateriaId)}</div>
  `;

  window.selectMateriaAsist = function(id, tab) {
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    selectedMateriaId = id;
    document.getElementById('asistContent').innerHTML = renderAsistTable(id);
  };
}

function modalRegistrarAsistencia(materiaId) {
  const mat = AppState.getMateriaById(materiaId);
  const ests = AppState.getEstudiantes().filter(e=>e.activo && mat.grados.includes(e.grado));
  const hoy = new Date().toISOString().split('T')[0];
  showModal(`
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>📅 Registrar Asistencia · ${mat.nombre}</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group"><label>Fecha</label><input type="date" id="fa-fecha" value="${hoy}"></div>
        <div class="table-container" style="margin-bottom:16px">
          <table>
            <thead><tr><th>Estudiante</th><th>Grado</th><th>Estado</th></tr></thead>
            <tbody>
              ${ests.map(e=>`
                <tr>
                  <td>
                    <div class="flex align-center gap-8">
                      <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
                      <span style="font-weight:600">${e.nombre}</span>
                    </div>
                  </td>
                  <td>${e.grado}</td>
                  <td>
                    <div class="flex gap-8">
                      <label class="flex align-center gap-8" style="cursor:pointer;font-size:13px"><input type="radio" name="asist-${e.id}" value="presente" checked> <span style="color:var(--green)">✓ Presente</span></label>
                      <label class="flex align-center gap-8" style="cursor:pointer;font-size:13px"><input type="radio" name="asist-${e.id}" value="ausente"> <span style="color:var(--red)">✕ Ausente</span></label>
                      <label class="flex align-center gap-8" style="cursor:pointer;font-size:13px"><input type="radio" name="asist-${e.id}" value="tardanza"> <span style="color:var(--yellow)">⏰ Tardanza</span></label>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarAsistencia(${materiaId},[${ests.map(e=>e.id).join(',')}])">Guardar Asistencia</button>
        </div>
      </div>
    </div>
  `);
}

function guardarAsistencia(materiaId, estudiantesIds) {
  const fecha = document.getElementById('fa-fecha').value;
  if (!fecha) { showToast('Selecciona la fecha', 'error'); return; }
  estudiantesIds.forEach(eid => {
    const radio = document.querySelector(`input[name="asist-${eid}"]:checked`);
    if (radio) AppState.addAsistencia({ estudianteId: eid, materiaId, fecha, estado: radio.value });
  });
  closeModal();
  showToast(`Asistencia registrada para ${estudiantesIds.length} estudiantes`);
  navigateTo('asistencias');
}

// ===================== REPORTES =====================
function renderReportes(el) {
  const estudiantes = AppState.getEstudiantes().filter(e=>e.activo);
  const aprobados = estudiantes.filter(e=>parseFloat(AppState.getPromedio(e.id))>=3).length;
  const reprobados = estudiantes.length - aprobados;
  const pctAprobados = estudiantes.length ? Math.round((aprobados/estudiantes.length)*100) : 0;

  el.innerHTML = `
    <div class="page-title mb-16">📈 Reportes Académicos</div>
    <div class="grid-2" style="gap:20px;margin-bottom:24px">
      <div class="card">
        <div class="section-title">Aprobados vs Reprobados</div>
        <div class="flex align-center" style="gap:24px;margin-top:8px">
          <div style="flex:1">
            <div style="display:flex;height:120px;border-radius:12px;overflow:hidden">
              <div style="background:var(--green);width:${pctAprobados}%;display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:18px;transition:width 0.5s">${aprobados}</div>
              <div style="background:var(--red);flex:1;display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:18px">${reprobados}</div>
            </div>
            <div class="flex justify-between mt-8">
              <div class="flex align-center gap-8"><div style="width:10px;height:10px;background:var(--green);border-radius:3px"></div><span style="font-size:12px">Aprobados (${pctAprobados}%)</span></div>
              <div class="flex align-center gap-8"><div style="width:10px;height:10px;background:var(--red);border-radius:3px"></div><span style="font-size:12px">Reprobados (${100-pctAprobados}%)</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-title">Promedio por Materia</div>
        <div style="margin-top:8px">
          ${AppState.getMaterias().map(m => {
            const notas = AppState.data.notas.filter(n=>n.materiaId===m.id);
            const prom = notas.length ? parseFloat((notas.reduce((s,n)=>s+n.definitiva,0)/notas.length).toFixed(2)) : 0;
            const pct = (prom/5)*100;
            return `
              <div style="margin-bottom:12px">
                <div class="flex justify-between" style="margin-bottom:4px">
                  <div class="flex align-center gap-8">
                    <div style="width:8px;height:8px;border-radius:50%;background:${m.color}"></div>
                    <span style="font-size:13px;font-weight:600">${m.nombre}</span>
                  </div>
                  <span class="nota-chip ${getNoteClass(prom)}" style="padding:2px 8px;font-size:12px">${prom.toFixed(2)}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${m.color}"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">Reporte Detallado por Estudiante</div>
      <div class="table-container mt-16">
        <table>
          <thead><tr>
            <th>Estudiante</th><th>Grado</th>
            ${AppState.getMaterias().map(m=>`<th>${m.nombre}</th>`).join('')}
            <th>Promedio</th><th>Estado</th>
          </tr></thead>
          <tbody>
            ${estudiantes.map(e => {
              const prom = parseFloat(AppState.getPromedio(e.id));
              return `
                <tr>
                  <td>
                    <div class="flex align-center gap-8">
                      <div class="avatar ${getAvatarColors(e.nombre)}">${e.avatar}</div>
                      <span style="font-weight:600">${e.nombre}</span>
                    </div>
                  </td>
                  <td>${e.grado}</td>
                  ${AppState.getMaterias().map(m => {
                    const nota = AppState.data.notas.find(n=>n.estudianteId===e.id&&n.materiaId===m.id);
                    return nota ? `<td><div class="nota-chip ${getNoteClass(nota.definitiva)}" style="padding:3px 8px;font-size:12px">${nota.definitiva.toFixed(1)}</div></td>` : '<td><span style="color:var(--text3);font-size:12px">-</span></td>';
                  }).join('')}
                  <td><div class="nota-chip ${getNoteClass(prom)}" style="font-weight:800">${prom > 0 ? prom.toFixed(2) : '-'}</div></td>
                  <td><span class="badge ${prom>=3?'badge-aprobado':'badge-reprobado'}">${prom>=3?'✓ Aprobado':'✕ Reprobado'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ===================== VISTAS ESTUDIANTE =====================
function renderMisNotas(el) {
  const u = AppState.currentUser;
  const notas = AppState.getNotasEstudiante(u.id);
  const prom = parseFloat(AppState.getPromedio(u.id));

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Mis Notas</div>
        <div class="page-subtitle">Período 1 · ${u.grado} · ${u.codigo}</div>
      </div>
      <div class="flex align-center gap-8">
        <div class="nota-chip ${getNoteClass(prom)}" style="font-size:18px;padding:8px 16px">Promedio: ${prom > 0 ? prom.toFixed(2) : '-'}</div>
        <span class="badge ${prom>=3?'badge-aprobado':'badge-reprobado'}">${prom>=3?'✓ Promovido':'✕ En riesgo'}</span>
      </div>
    </div>

    ${notas.length === 0 ? '<div class="empty-state"><div class="icon">📝</div><h3>No tienes notas registradas aún</h3><p>Las notas serán publicadas por tus docentes.</p></div>' :
    notas.map(n => {
      const m = AppState.getMateriaById(n.materiaId);
      if (!m) return '';
      const prof = AppState.getProfesorById(m.profesorId);
      return `
        <div class="notas-materia-card">
          <div class="notas-materia-header">
            <div class="flex align-center gap-8">
              <span class="materia-dot" style="background:${m.color}"></span>
              <div>
                <div style="font-weight:800;font-size:16px">${m.nombre}</div>
                <div style="font-size:12px;color:var(--text2)">${m.codigo} · Docente: ${prof?.nombre || 'N/A'}</div>
              </div>
            </div>
            <div class="flex align-center gap-8">
              <div class="nota-chip ${getNoteClass(n.definitiva)}" style="font-size:18px;padding:8px 16px;font-weight:800">${n.definitiva.toFixed(2)}</div>
              <span class="badge ${n.definitiva>=3?'badge-aprobado':'badge-reprobado'}" style="font-size:13px;padding:6px 14px">${n.definitiva>=3?'✓ APROBADO':'✕ REPROBADO'}</span>
            </div>
          </div>
          <div class="notas-grid">
            ${[{l:'Corte 1',v:n.nota1},{l:'Corte 2',v:n.nota2},{l:'Corte 3',v:n.nota3},{l:'Definitiva',v:n.definitiva}].map(x=>`
              <div class="nota-item" style="background:var(--bg3);padding:16px;border-radius:12px;border:1px solid var(--border)">
                <div class="nota-label">${x.l}</div>
                <div class="nota-chip ${getNoteClass(x.v)}" style="font-size:18px;font-weight:800;margin-top:6px">${x.v.toFixed(1)}</div>
                <div style="margin-top:8px">
                  <div class="progress-bar"><div class="progress-fill" style="width:${(x.v/5)*100}%;background:${x.v>=3?'var(--green)':x.v>=2?'var(--yellow)':'var(--red)'}"></div></div>
                </div>
              </div>
            `).join('')}
          </div>
          ${n.definitiva < 3 ? '<div class="alert alert-warning mt-16">⚠️ Esta materia requiere atención. Habla con tu docente sobre un plan de mejora.</div>' : ''}
        </div>
      `;
    }).join('')}
  `;
}

function renderMisAsistencias(el) {
  const u = AppState.currentUser;
  const asists = AppState.getAsistenciaEstudiante(u.id);
  const materias = AppState.getMaterias().filter(m=>m.grados.includes(u.grado));
  const pct = AppState.getPorcentajeAsistencia(u.id);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Mi Asistencia</div>
      <div class="flex align-center gap-8">
        <span style="font-size:24px;font-weight:800;color:${pct>=80?'var(--green)':pct>=60?'var(--yellow)':'var(--red)'}">${pct}%</span>
        <span class="badge ${pct>=80?'badge-aprobado':pct>=60?'badge-tardanza':'badge-reprobado'}">${pct>=80?'Excelente':pct>=60?'Regular':'Crítico'}</span>
      </div>
    </div>

    ${materias.map(m => {
      const ma = AppState.getAsistenciaEstudiante(u.id, m.id);
      const mpct = AppState.getPorcentajeAsistencia(u.id, m.id);
      return `
        <div class="card mb-16">
          <div class="flex align-center justify-between mb-16">
            <div class="flex align-center gap-8">
              <div style="width:12px;height:12px;border-radius:4px;background:${m.color}"></div>
              <div style="font-weight:700">${m.nombre}</div>
            </div>
            <div class="flex align-center gap-8">
              <span style="font-weight:700;color:${mpct>=80?'var(--green)':mpct>=60?'var(--yellow)':'var(--red)'}">${mpct}%</span>
              <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${mpct}%;background:${mpct>=80?'var(--green)':mpct>=60?'var(--yellow)':'var(--red)'}"></div></div>
            </div>
          </div>
          ${ma.length ? `
            <div class="asist-dots">
              ${ma.map(a=>`<div class="asist-dot dot-${a.estado}" title="${formatDate(a.fecha)} - ${a.estado}">${a.estado==='presente'?'P':a.estado==='ausente'?'A':'T'}</div>`).join('')}
            </div>
            <div class="flex gap-8 mt-16" style="font-size:12px">
              <span style="color:var(--green)">✓ ${ma.filter(a=>a.estado==='presente').length} presentes</span>
              <span style="color:var(--red)">✕ ${ma.filter(a=>a.estado==='ausente').length} ausentes</span>
              <span style="color:var(--yellow)">⏰ ${ma.filter(a=>a.estado==='tardanza').length} tardanzas</span>
            </div>
          ` : '<div style="color:var(--text3);font-size:13px">Sin registros de asistencia aún.</div>'}
        </div>
      `;
    }).join('')}
  `;
}

function renderMisMaterias(el) {
  const u = AppState.currentUser;
  let materias;
  if (u.rol === 'estudiante') {
    materias = AppState.getMaterias().filter(m=>m.grados.includes(u.grado));
  } else {
    materias = AppState.getMaterias().filter(m=>m.profesorId===u.id);
  }

  el.innerHTML = `
    <div class="page-title mb-16">${u.rol === 'estudiante' ? 'Mis Materias' : 'Materias que Imparto'}</div>
    <div class="grid-2" style="gap:20px">
      ${materias.map(m => {
        const prof = AppState.getProfesorById(m.profesorId);
        const notasEst = u.rol === 'estudiante' ? AppState.data.notas.find(n=>n.estudianteId===u.id&&n.materiaId===m.id) : null;
        const ests = u.rol === 'profesor' ? AppState.getEstudiantes().filter(e=>e.activo&&m.grados.includes(e.grado)) : [];
        return `
          <div class="card" style="border-left:4px solid ${m.color}">
            <div class="flex align-center justify-between mb-8">
              <span class="badge badge-info">${m.codigo}</span>
              <span style="font-size:12px;color:var(--text2)">${m.creditosHoras}h/sem</span>
            </div>
            <div style="font-weight:800;font-size:18px;font-family:'Sora',sans-serif;margin-bottom:4px">${m.nombre}</div>
            <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${m.descripcion}</div>
            ${u.rol === 'estudiante' ? `
              ${notasEst ? `
                <div class="flex align-center gap-8">
                  <div class="nota-chip ${getNoteClass(notasEst.definitiva)}">${notasEst.definitiva.toFixed(2)}</div>
                  <span class="badge ${notasEst.definitiva>=3?'badge-aprobado':'badge-reprobado'}">${notasEst.definitiva>=3?'Aprobado':'Reprobado'}</span>
                </div>
              ` : '<span class="badge badge-info">Sin notas aún</span>'}
              <div style="font-size:12px;color:var(--text2);margin-top:8px">📚 Docente: ${prof?.nombre || 'N/A'}</div>
            ` : `
              <div style="font-size:13px;color:var(--text2)">👥 ${ests.length} estudiantes · Grados: ${m.grados.join(', ')}</div>
            `}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ===================== INIT =====================
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
