<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="log-container">
      <h1 class="log-title">Log de Usuario</h1>

      <!-- TOOLBAR -->
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">
            <i class="fas fa-clipboard-list"></i>&nbsp;Registros de Log
          </span>
          <span class="divider"></span>
          <button class="pill" @click="resetFilters">
            <i class="fas fa-broom"></i>&nbsp;Limpiar filtros
          </button>
        </div>

        <div class="toolbar-right">
          <span class="toolbar-info">
            Total registros: {{ logs.length }}
          </span>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="filters">
        <input
          v-model="searchTerm"
          placeholder="Buscar por mensaje, motivo, módulo, tipo o usuario"
        />

        <select v-model="moduloFilter">
          <option value="">Todos los módulos</option>
          <option v-for="mod in moduloOptions" :key="mod" :value="mod">
            {{ mod }}
          </option>
        </select>

        <select v-model.number="perPage">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>

        <button class="sort-button" @click="toggleSortDirection">
          <i :class="sortDirection === 'asc'
              ? 'fa-solid fa-chevron-up'
              : 'fa-solid fa-chevron-down'"></i>
        </button>

        <div class="columns-menu">
          <button @click="toggleColumnsMenu">
            Columnas
          </button>
          <div v-if="showColumnsMenu" class="columns-dropdown">
            <div
              v-for="(visible, key) in visibleColumns"
              :key="key"
              @click="toggleColumn(key)"
              class="column-option"
            >
              <span>{{ getColumnLabel(key) }}</span>
              <i v-if="visible" class="fas fa-check"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA -->
      <div class="log-table-container">
        <table>
          <thead>
            <tr>
              <th v-if="visibleColumns.id_log" @click="sort('id_log')">id_log</th>
              <th v-if="visibleColumns.fecha_log" @click="sort('fecha_log')">fecha_log</th>
              <th v-if="visibleColumns.tipo_log" @click="sort('tipo_log')">tipo_log</th>
              <th v-if="visibleColumns.Usuario_id_usuario" @click="sort('Usuario_id_usuario')">Usuario_id_usuario</th>
              <th v-if="visibleColumns.modulo" @click="sort('modulo')">modulo</th>
              <th v-if="visibleColumns.motivo" @click="sort('motivo')">motivo</th>
              <th v-if="visibleColumns.nivel" @click="sort('nivel')">nivel</th>
              <th v-if="visibleColumns.mensaje" @click="sort('mensaje')">mensaje</th>
              <th v-if="visibleColumns.detalle" @click="sort('detalle')">detalle</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="log in paginatedLogs" :key="log.id_log">
              <td v-if="visibleColumns.id_log">{{ log.id_log }}</td>
              <td v-if="visibleColumns.fecha_log">{{ formatFecha(log.fecha_log) }}</td>
              <td v-if="visibleColumns.tipo_log">{{ log.tipo_log }}</td>
              <td v-if="visibleColumns.Usuario_id_usuario">{{ log.Usuario_id_usuario }}</td>
              <td v-if="visibleColumns.modulo">{{ log.modulo }}</td>
              <td v-if="visibleColumns.motivo">{{ log.motivo }}</td>
              <td v-if="visibleColumns.nivel">{{ log.nivel }}</td>
              <td v-if="visibleColumns.mensaje" class="cell-wrap" :title="log.mensaje">
                {{ log.mensaje }}
              </td>
              <td v-if="visibleColumns.detalle" class="cell-wrap" :title="log.detalle">
                {{ log.detalle }}
              </td>
            </tr>

            <tr v-if="paginatedLogs.length === 0">
              <td :colspan="visibleColumnsCount" class="no-data">
                No se encontraron registros con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent
        :page-count="totalPages"
        :current-page="currentPage"
        @page-changed="handlePageClick"
      />
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'LogUsuario',
  components: { NavBar, FooterComponent, PaginationComponent },

  data() {
    return {
      userRole: '',
      logs: [],
      searchTerm: '',
      moduloFilter: '',
      perPage: 10,
      currentPage: 1,
      sortBy: 'fecha_log',
      sortDirection: 'desc',
      totalPages: 1,
      showColumnsMenu: false,
      visibleColumns: {
        id_log: true,
        fecha_log: true,
        tipo_log: true,
        Usuario_id_usuario: true,
        modulo: true,
        motivo: true,
        nivel: true,
        mensaje: true,
        detalle: true
      },
      predefinedModulos: [
        'Módulo Gestión de Roles',
        'Módulo Gestión de Usuarios',
        'AUTH',
        'Modulo Certificados'
      ]
    };
  },

  computed: {
    moduloOptions() {
      const set = new Set(this.predefinedModulos);
      this.logs.forEach(l => {
        if (l.modulo) set.add(l.modulo);
      });
      return Array.from(set);
    },

    visibleColumnsCount() {
      return Object.values(this.visibleColumns).filter(Boolean).length || 1;
    },

    filteredLogs() {
      const term = this.searchTerm.toLowerCase().trim();
      let res = this.logs;

      if (term) {
        res = res.filter(l => (
          String(l.id_log ?? '').toLowerCase().includes(term) ||
          String(l.Usuario_id_usuario ?? '').toLowerCase().includes(term) ||
          (l.tipo_log ?? '').toLowerCase().includes(term) ||
          (l.modulo ?? '').toLowerCase().includes(term) ||
          (l.motivo ?? '').toLowerCase().includes(term) ||
          (l.nivel ?? '').toLowerCase().includes(term) ||
          (l.mensaje ?? '').toLowerCase().includes(term) ||
          (l.detalle ?? '').toLowerCase().includes(term)
        ));
      }

      if (this.moduloFilter) {
        res = res.filter(l => l.modulo === this.moduloFilter);
      }

      res = [...res].sort((a, b) => {
        const valA = a[this.sortBy];
        const valB = b[this.sortBy];

        if (this.sortBy === 'fecha_log') {
          const dA = this.toDate(valA)?.getTime?.() ?? 0;
          const dB = this.toDate(valB)?.getTime?.() ?? 0;
          return this.sortDirection === 'asc' ? dA - dB : dB - dA;
        }

        const sA = (valA ?? '').toString().toLowerCase();
        const sB = (valB ?? '').toString().toLowerCase();
        if (sA < sB) return this.sortDirection === 'asc' ? -1 : 1;
        if (sA > sB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      this.totalPages = Math.ceil(res.length / this.perPage) || 1;
      return res;
    },

    paginatedLogs() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredLogs.slice(start, start + this.perPage);
    }
  },

  methods: {
    async fetchLogs() {
      try {
        const resp = await this.$protectedAxios.get(`${BASE_URL}/log-usuario`);
        const data = Array.isArray(resp.data) ? resp.data : (resp.data.content || []);

        this.logs = data.map(l => ({
          id_log: l.id_log ?? l.idLog,
          fecha_log: l.fecha_log ?? l.fechaLog,
          tipo_log: l.tipo_log ?? l.tipoLog,
          Usuario_id_usuario:
            l.Usuario_id_usuario ??
            l.usuario_id_usuario ??
            l.usuarioIdUsuario ??
            l.usuario?.idUsuario,
          modulo: l.modulo,
          motivo: l.motivo,
          nivel: l.nivel,
          mensaje: l.mensaje,
          detalle: l.detalle
        }));
      } catch (e) {
        const status = e?.response?.status;
        const data = e?.response?.data;
        console.error('Error cargando logs:', { status, data, e });

        Swal.fire(
          'Error',
          `No se pudieron cargar los logs. Status: ${status ?? 'N/A'}\n${
            typeof data === 'string' ? data : JSON.stringify(data)
          }`,
          'error'
        );
      }
    },

    // ✅ 1 vez por login (no por refresh / no por volver del menú)
    async registrarAccesoVistaLogsUnaVez() {
      const userId =
        localStorage.getItem('id_usuario') ||
        localStorage.getItem('idUsuario') ||
        '';

      const loginSessionId = localStorage.getItem('loginSessionId') || '';

      const key = `USEI_LOGS_VIEW_LOGGED_${userId || 'anon'}_${loginSessionId || 'nosession'}`;

      if (sessionStorage.getItem(key) === 'true') return;

      try {
        await this.$protectedAxios.post(`${BASE_URL}/log-usuario/auditoria/acceso`, {
          detalle: 'El usuario abrió la pantalla de Revisión de Logs'
        });

        sessionStorage.setItem(key, 'true');
      } catch (e) {
        console.warn(
          'No se pudo registrar auditoría de acceso a logs:',
          e?.response?.status,
          e?.response?.data || e?.message
        );
      }
    },

    handlePageClick(page) {
      this.currentPage = page;
    },

    sort(field) {
      if (this.sortBy === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortDirection = 'asc';
      }
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    },

    toggleColumnsMenu() {
      this.showColumnsMenu = !this.showColumnsMenu;
    },

    toggleColumn(key) {
      this.visibleColumns[key] = !this.visibleColumns[key];
    },

    getColumnLabel(key) {
      const labels = {
        id_log: 'ID Log',
        fecha_log: 'Fecha',
        tipo_log: 'Tipo',
        Usuario_id_usuario: 'Usuario',
        modulo: 'Módulo',
        motivo: 'Motivo',
        nivel: 'Nivel',
        mensaje: 'Mensaje',
        detalle: 'Detalle'
      };
      return labels[key] || key;
    },

    resetFilters() {
      this.searchTerm = '';
      this.moduloFilter = '';
      this.currentPage = 1;
      this.sortBy = 'fecha_log';
      this.sortDirection = 'desc';
    },

    toDate(value) {
      if (!value) return null;

      if (Array.isArray(value)) {
        const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
        return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
      }

      const dt = new Date(value);
      if (!Number.isNaN(dt.getTime())) return dt;
      return null;
    },

    formatFecha(value) {
      const dt = this.toDate(value);
      if (!dt) return value ? String(value) : '';
      return dt.toLocaleString();
    }
  },

  async mounted() {
    this.userRole = localStorage.getItem('rol') || '';
    await this.registrarAccesoVistaLogsUnaVez();
    this.fetchLogs();
  }
};
</script>

<style scoped>
.log-container {
  padding-top: 90px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 2%;
  gap: 16px;
}

.log-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
}

/* TOOLBAR */
.toolbar {
  width: 100%;
  max-width: 1200px;
  background: #83cabb;
  border: 1px solid #9fc1c7;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toolbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.toolbar-title {
  font-weight: 600;
  color: #263d42;
}

.toolbar-info {
  font-size: 14px;
  color: #263d42;
}

.pill {
  background: #8e6c88;
  color: #e6e0e0;
  border: 1px solid #49505a;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.pill:hover {
  background: #3c444e;
}

.divider {
  width: 1px;
  height: 24px;
  background: #494f58;
  margin: 0 6px;
  border-radius: 1px;
}

/* FILTROS */
.filters {
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.filters input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.filters select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.sort-button {
  background-color: #263d42;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

/* COLUMNAS */
.columns-menu {
  position: relative;
}

.columns-menu > button {
  background-color: #263d42;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.columns-dropdown {
  position: absolute;
  right: 0;
  margin-top: 6px;
  background-color: #1c1c1e;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 20;
  padding: 10px;
  border-radius: 8px;
  color: white;
  min-width: 200px;
}

.column-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
  cursor: pointer;
  font-size: 14px;
}

.column-option:hover {
  background-color: #2c2c30;
}

/* TABLA */
.log-table-container {
  background-color: #cbdadb;
  padding: 1.6rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
}

.log-table-container table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.log-table-container th,
.log-table-container td {
  border: 1px solid #263d42;
  padding: 10px;
  text-align: left;
  background: #fff;
  vertical-align: top;

  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  word-break: break-word;
}

.log-table-container th {
  background-color: #263d42;
  color: white;
  cursor: pointer;
}

.cell-wrap {
  max-width: 320px;
  white-space: normal;
  word-break: break-word;
}

.no-data {
  text-align: center;
  font-style: italic;
  color: #555;
}
</style>
