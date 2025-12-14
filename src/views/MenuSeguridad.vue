<template>
  <div>
    <!-- Header -->
    <section class="header-master">
      <header>
        <NavBar userRole="Seguridad" />
      </header>
    </section>

    <!-- Password Configuration Section (show when in config mode) -->
    <section class="config-section">
      <div class="config-container">
        <div class="config-header">
          <h2>Configuración de Políticas de Seguridad</h2>
          <button @click="goBackToMenu" class="btn-back">← Volver al Menú</button>
        </div>
        
        <p class="config-description">
          Modifique las políticas de seguridad del sistema. Los cambios se aplicarán inmediatamente a todas las operaciones futuras.
        </p>

        <!-- Loading State -->
        <div v-if="loading" class="loading">
          <p>Cargando configuración...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="loadConfiguration" class="btn-retry">Reintentar</button>
        </div>

        <!-- Configuration Form -->
        <div v-if="!loading && !error" class="config-form">
          <form @submit.prevent="saveConfiguration">
            <!-- Password Length Section -->
            <div class="form-section">
              <h3>Políticas de Contraseña</h3>
              
              <div class="form-group">
                <label for="minLength">Longitud Mínima de Contraseña:</label>
                <input 
                  type="number" 
                  id="minLength" 
                  v-model.number="config.minLongitudContrasenia"
                  min="6" 
                  max="50" 
                  required
                />
                <span class="help-text">Entre 6 y 50 caracteres</span>
              </div>

              <div class="form-group">
                <label for="expireDays">Días para Expiración de Contraseña:</label>
                <input 
                  type="number" 
                  id="expireDays" 
                  v-model.number="config.diasExpiracionContrasenia"
                  min="30" 
                  max="365" 
                  required
                />
                <span class="help-text">Entre 30 y 365 días</span>
              </div>

              <div class="form-group">
                <label for="noReusePeriod">Período de No Reutilización (meses):</label>
                <input 
                  type="number" 
                  id="noReusePeriod" 
                  v-model.number="config.mesesNoReutilizar"
                  min="1" 
                  max="24" 
                  required
                />
                <span class="help-text">Entre 1 y 24 meses</span>
              </div>
            </div>

            <!-- Password Complexity Section -->
            <div class="form-section">
              <h3>Complejidad de Contraseña</h3>
              
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="requireUpper" 
                    v-model="config.requerirMayusculas"
                  />
                  <label for="requireUpper">Requerir letras mayúsculas (A-Z)</label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="requireLower" 
                    v-model="config.requerirMinusculas"
                  />
                  <label for="requireLower">Requerir letras minúsculas (a-z)</label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="requireNumbers" 
                    v-model="config.requerirNumeros"
                  />
                  <label for="requireNumbers">Requerir números (0-9)</label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="requireSymbols" 
                    v-model="config.requerirSimbolos"
                  />
                  <label for="requireSymbols">Requerir símbolos especiales (!@#$%...)</label>
                </div>
              </div>
            </div>

            <!-- Login Attempts Section -->
            <div class="form-section">
              <h3>Control de Acceso</h3>
              
              <div class="form-group">
                <label for="maxAttempts">Máximo Intentos de Login:</label>
                <input 
                  type="number" 
                  id="maxAttempts" 
                  v-model.number="config.maxIntentosLogin"
                  min="1" 
                  max="10" 
                  required
                />
                <span class="help-text">Entre 1 y 10 intentos</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" @click="goBackToMenu" class="btn-cancel">Cancelar</button>
              <button type="submit" :disabled="saving" class="btn-save">
                {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>

          <!-- Current Configuration Display -->
          <div v-if="originalConfig" class="current-config">
            <h3>Configuración Actual</h3>
            <div class="config-summary">
              <p><strong>Longitud mínima:</strong> {{ originalConfig.minLongitudContrasenia }} caracteres</p>
              <p><strong>Máximo intentos:</strong> {{ originalConfig.maxIntentosLogin }}</p>
              <p><strong>Expiración:</strong> {{ originalConfig.diasExpiracionContrasenia }} días</p>
              <p><strong>Última modificación:</strong> {{ formatDate(originalConfig.fechaModificacion) }}</p>
            </div>
          </div>

          <!-- All configurations table for audit/admin -->
          <div class="all-configs" v-if="allConfigurations && allConfigurations.length">
            <h3>Todas las Configuraciones</h3>
            <table class="config-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Activo</th>
                  <th>Min Long</th>
                  <th>Max Intentos</th>
                  <th>Expira (d)</th>
                  <th>Modificado</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cfg in allConfigurations" :key="cfg.idConfig">
                  <td>{{ cfg.idConfig }}</td>
                  <td>{{ cfg.activa ? 'Sí' : 'No' }}</td>
                  <td>{{ cfg.minLongitudContrasenia }}</td>
                  <td>{{ cfg.maxIntentosLogin }}</td>
                  <td>{{ cfg.diasExpiracionContrasenia }}</td>
                  <td>{{ formatDate(cfg.fechaModificacion) }}</td>
                  <td>{{ cfg.usuarioModificacion }}</td>
                  <td>
                    <button @click="loadIntoForm(cfg)" class="btn-load">Cargar</button>
                    <button @click="deleteConfiguration(cfg)" class="btn-delete" :disabled="cfg.activa">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import { BASE_URL } from '@/config/globals';
import { getBackendUrl } from '@/utils/backendDiscovery';

export default {
  name: 'MenuSeguridad',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      showPasswordConfig: false,
      loading: false,
      error: null,
      saving: false,
      config: {
        minLongitudContrasenia: 12,
        maxIntentosLogin: 3,
        diasExpiracionContrasenia: 60,
        mesesNoReutilizar: 12,
        requerirMayusculas: true,
        requerirMinusculas: true,
        requerirNumeros: true,
        requerirSimbolos: true
      },
      originalConfig: null
        ,allConfigurations: []
    };
  },
  created() {
    // Attempt to load list of configurations for admin view (trial allows unauthenticated)
    this.loadAllConfigurations();
  },
  methods: {
    // Navega por NOMBRE de ruta para mayor robustez
    goToUsuariosRoles() {
      this.$router.push({ name: 'GestionUsuariosRoles' });
    },
    
    async goToContrasenas() {
      this.showPasswordConfig = true;
      await this.loadConfiguration();
    },

    goBackToMenu() {
      this.showPasswordConfig = false;
      this.error = null;
    },

    async loadConfiguration() {
      this.loading = true;
      this.error = null;
      
      try {
        // For trial: allow reading configuration even without an authenticated Security role.
        // If a token exists, send it; otherwise call unauthenticated.
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const backend = await getBackendUrl();
        const response = await this.$publicAxios.get(`${backend}/configuracion-seguridad/current`, {
          headers
        });

        if (response.data && response.data.data && response.data.data.configuracion) {
          const configData = response.data.data.configuracion;
          this.config = { ...configData };
          this.originalConfig = { ...configData };
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          this.error = 'No se puede conectar al servidor. Verifique que el backend esté ejecutándose.';
        } else if (error.response && error.response.status === 404) {
          this.error = 'No se encontró configuración de seguridad. Se usarán valores por defecto.';
        } else {
          this.error = 'Error al cargar la configuración de seguridad.';
        }
      } finally {
        this.loading = false;
      }
    },

    async loadAllConfigurations() {
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  const backend = await getBackendUrl();
  const resp = await this.$publicAxios.get(`${backend}/configuracion-seguridad/list`, { headers });
        if (resp.data && resp.data.data && resp.data.data.configuraciones) {
          this.allConfigurations = resp.data.data.configuraciones;
        }
      } catch (e) {
        console.error('Error loading all configurations:', e);
        // don't block the UI; will try again when saving or reloading
      }
    },

    // Load a specific configuration object into the form for editing
    loadIntoForm(config) {
      if (!config) return;
      this.config = { ...config };
      this.originalConfig = { ...config };
      this.showPasswordConfig = true;
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async deleteConfiguration(config) {
      if (!config) return;

      // Prevent deletion of active configuration
      if (config.activa) {
        await Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'No se puede eliminar la configuración activa. Primero active otra configuración.',
        });
        return;
      }

      // Confirm deletion
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar la configuración ID ${config.idConfig}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const backend = await getBackendUrl();
        const response = await this.$publicAxios.delete(`${backend}/configuracion-seguridad/${config.idConfig}`, {
          headers
        });

        if (response.data && response.data.status === '200 OK') {
          await Swal.fire({
            icon: 'success',
            title: 'Configuración Eliminada',
            text: 'La configuración se ha eliminado exitosamente.',
          });

          // Reload configurations list
          await this.loadAllConfigurations();
        }
      } catch (error) {
        console.error('Error deleting configuration:', error);
        let errorMessage = 'Error al eliminar la configuración.';

        if (error.response?.status === 404) {
          errorMessage = 'Configuración no encontrada.';
        } else if (error.response?.status === 409) {
          errorMessage = 'No se puede eliminar la configuración activa.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      }
    },

    async saveConfiguration() {
      this.saving = true;
      
      try {
        // For trial: allow saving configuration even if no Security role is present.
        // Send Authorization header only if token exists. Provide a fallback userId (1) when absent.
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('id_usuario') || 1;
        const headers = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

        const backend = await getBackendUrl();
        const response = await this.$publicAxios.put(`${backend}/configuracion-seguridad?userId=${userId}`, this.config, {
          headers
        });

        if (response.data && response.data.status === '200 OK') {
          await Swal.fire({
            icon: 'success',
            title: 'Configuración Guardada',
            text: 'Las políticas de seguridad se han actualizado exitosamente.',
            confirmButtonText: 'Aceptar'
          });
          
          // Reload to show updated configuration
          await this.loadConfiguration();
          await this.loadAllConfigurations();
        }
      } catch (error) {
        console.error('Error saving configuration:', error);
        
        let errorMessage = 'Error al guardar la configuración.';
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          errorMessage = 'No se puede conectar al servidor. Verifique que el backend esté ejecutándose.';
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'Aceptar'
        });
      } finally {
        this.saving = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto';
}

/* Header */
section.header-master {
  width: 100%;
  padding: 30px 0;
  background-image: url('https://i.postimg.cc/28zkdsTq/bg-01.png');
  background-size: cover;
}

section.header-master header {
  border-bottom: 3px solid rgba(71, 83, 88, 0.14);
  padding-bottom: 20px;
}

/* Cards */
.icon-cards {
  background-color: #d9e4e6;
  padding: 80px 0;
}

.container-cards {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2%;
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card {
  width: 280px;
  height: 280px;
  border: 2px solid #ccc;
  border-radius: 20px;
  background-color: rgba(128, 206, 215, 0.5);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
}

.lottie-frame {
  width: 230px;
  height: 230px;
  border: none;
}

h3 {
  margin-top: 18px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #263d42;
  font-weight: 600;
}

.card-button-container {
  margin-top: 8px;
}

.btn-ingresar {
  background-color: #6c5b7b;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 130px;
  transition: background-color 0.3s ease, transform 0.1s ease;
}
.btn-ingresar:hover {
  background-color: #63c7b2;
}
.btn-ingresar:active {
  transform: scale(0.97);
}

/* Footer */
footer {
  padding: 20px 0;
  background: #6cc5b2;
  text-align: center;
}

/* Configuration Section Styles */
.config-section {
  background-color: #d9e4e6;
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.config-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 40px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.config-header h2 {
  color: #263d42;
  font-weight: 600;
  margin: 0;
}

.btn-back {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-back:hover {
  background-color: #5a6268;
}

.config-description {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

/* Loading and Error States */
.loading, .error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #dc3545;
}

.btn-retry {
  background-color: #6c5b7b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

/* Form Sections */
.form-section {
  margin-bottom: 30px;
  padding: 25px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.form-section h3 {
  color: #263d42;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 18px;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="number"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input[type="number"]:focus {
  outline: none;
  border-color: #6c5b7b;
  box-shadow: 0 0 0 2px rgba(108, 91, 123, 0.2);
}

.help-text {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

/* Checkboxes */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 12px;
  transform: scale(1.2);
}

.checkbox-item label {
  margin-bottom: 0;
  cursor: pointer;
}

/* Action Buttons */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save {
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-save:hover:not(:disabled) {
  background-color: #218838;
}

/* Current Configuration Display */
.current-config {
  margin-top: 30px;
  padding: 20px;
  background-color: #e7f3ff;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.current-config h3 {
  color: #263d42;
  margin-bottom: 15px;
}

.config-summary p {
  margin-bottom: 8px;
  color: #333;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.config-table th, .config-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 10px;
  text-align: left;
}
.config-table th {
  background: #f1f1f1;
  font-weight: 600;
}
.btn-load {
  background: #007bff;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}
.btn-load:hover { background: #0069d9; }

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-delete:hover { background: #c82333; }
.btn-delete:disabled { 
  background: #6c757d; 
  cursor: not-allowed; 
  opacity: 0.6; 
}

/* Responsive */
@media screen and (max-width: 700px) {
  .container-cards {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .card {
    width: 260px;
    height: 260px;
  }
  
  .config-container {
    margin: 0 10px;
    padding: 20px;
  }
  
  .config-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .checkbox-group {
    gap: 12px;
  }
}
</style>