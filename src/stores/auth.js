// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('authUser') || 'null'), // { id_usuario, correo, nombre, ... }
    roleId: localStorage.getItem('roleId') || null, // si el backend te da id del rol por usuario
    roleName: localStorage.getItem('rol') || null,  // si guardaste 'admin', 'director', etc.
    accesses: JSON.parse(localStorage.getItem('accesos') || '[]'), // claves: ['seguimiento','ver-encuesta',...]
  }),
  actions: {
    setSession({ token, user, roleId, roleName, accesses }) {
      this.token = token; localStorage.setItem('authToken', token);
      this.user = user; localStorage.setItem('authUser', JSON.stringify(user));
      if (roleId) { this.roleId = roleId; localStorage.setItem('roleId', roleId); }
      if (roleName) { this.roleName = roleName; localStorage.setItem('rol', roleName); }
      if (accesses) { this.accesses = accesses; localStorage.setItem('accesos', JSON.stringify(accesses)); }
    },
    clear() {
      this.token = null; this.user = null; this.roleId = null; this.roleName = null; this.accesses = [];
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('roleId');
      localStorage.removeItem('rol');
      localStorage.removeItem('accesos');
    }
  }
});
