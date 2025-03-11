import { trackEvent } from './analyticsService';

// Configuración de Firebase (deberás reemplazar esto con tus propias credenciales)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

class SyncService {
  constructor() {
    this.initialized = false;
    this.syncStatus = { lastSync: null, status: 'disconnected' };
    this.listeners = [];
    this.offlineData = {};
    this.pendingChanges = [];
  }

  // Inicializar el servicio cuando se importa Firebase
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Importación dinámica de Firebase para reducir el tamaño inicial del bundle
      const { initializeApp } = await import('firebase/app');
      const { getDatabase, ref, set, onValue, off } = await import('firebase/database');
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      
      this.app = initializeApp(firebaseConfig);
      this.db = getDatabase(this.app);
      this.auth = getAuth(this.app);
      
      // Monitorear estado de autenticación
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        this.updateSyncStatus(user ? 'connected' : 'disconnected');
        
        // Si el usuario está autenticado, procesar cambios pendientes
        if (user) {
          this.processPendingChanges();
        }
      });
      
      this.initialized = true;
      trackEvent('Sync', 'initialize', 'success');
      return true;
    } catch (error) {
      console.error('Error al inicializar el servicio de sincronización:', error);
      trackEvent('Sync', 'initialize', 'error');
      return false;
    }
  }
  
  // Actualizar estado de sincronización y notificar a los listeners
  updateSyncStatus(status, error = null) {
    this.syncStatus = {
      lastSync: status === 'synced' ? new Date() : this.syncStatus.lastSync,
      status,
      error
    };
    
    // Notificar a todos los listeners sobre el cambio de estado
    this.listeners.forEach(listener => listener(this.syncStatus));
  }
  
  // Registrar un listener para cambios en el estado de sincronización
  onSyncStatusChanged(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Sincronizar datos con la nube
  async syncData(path, data) {
    // Guardar localmente primero
    this.offlineData[path] = data;
    localStorage.setItem('offlineData', JSON.stringify(this.offlineData));
    
    // Si no estamos inicializados o el usuario no está autenticado, guardar para más tarde
    if (!this.initialized || !this.currentUser) {
      this.pendingChanges.push({ path, data });
      return false;
    }
    
    try {
      await this.initialize();
      const { ref, set } = await import('firebase/database');
      
      const userPath = `users/${this.currentUser.uid}/${path}`;
      await set(ref(this.db, userPath), data);
      
      this.updateSyncStatus('synced');
      trackEvent('Sync', 'sync_data', 'success');
      return true;
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
      this.updateSyncStatus('error', error);
      
      // Guardar cambio pendiente para reintentar más tarde
      this.pendingChanges.push({ path, data });
      
      trackEvent('Sync', 'sync_data', 'error');
      return false;
    }
  }
  
  // Escuchar cambios en tiempo real
  async subscribeToData(path, callback) {
    if (!this.initialized || !this.currentUser) {
      // Devolver datos offline si están disponibles
      const offlineData = this.getOfflineData(path);
      if (offlineData) {
        callback(offlineData);
      }
      return null;
    }
    
    try {
      await this.initialize();
      const { ref, onValue } = await import('firebase/database');
      
      const userPath = `users/${this.currentUser.uid}/${path}`;
      const dataRef = ref(this.db, userPath);
      
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        
        // Actualizar datos offline
        this.offlineData[path] = data;
        localStorage.setItem('offlineData', JSON.stringify(this.offlineData));
        
        callback(data);
      });
      
      trackEvent('Sync', 'subscribe', 'success');
      return dataRef; // Devolver referencia para poder cancelar la suscripción
    } catch (error) {
      console.error('Error al suscribirse a datos:', error);
      trackEvent('Sync', 'subscribe', 'error');
      return null;
    }
  }
  
  // Cancelar suscripción a cambios
  async unsubscribeFromData(dataRef) {
    if (!dataRef) return;
    
    try {
      const { off } = await import('firebase/database');
      off(dataRef);
      trackEvent('Sync', 'unsubscribe', 'success');
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      trackEvent('Sync', 'unsubscribe', 'error');
    }
  }
  
  // Procesar cambios pendientes cuando el usuario se autentica
  async processPendingChanges() {
    if (!this.initialized || !this.currentUser || this.pendingChanges.length === 0) return;
    
    const changes = [...this.pendingChanges];
    this.pendingChanges = [];
    
    for (const { path, data } of changes) {
      await this.syncData(path, data);
    }
  }
  
  // Obtener datos offline
  getOfflineData(path) {
    try {
      if (this.offlineData[path]) {
        return this.offlineData[path];
      }
      
      const storedData = localStorage.getItem('offlineData');
      if (storedData) {
        this.offlineData = JSON.parse(storedData);
        return this.offlineData[path];
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener datos offline:', error);
      return null;
    }
  }
  
  // Iniciar sesión de usuario
  async signIn(email, password) {
    try {
      await this.initialize();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      trackEvent('Auth', 'sign_in', 'success');
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      trackEvent('Auth', 'sign_in', 'error');
      throw error;
    }
  }
  
  // Cerrar sesión de usuario
  async signOut() {
    try {
      await this.initialize();
      await this.auth.signOut();
      trackEvent('Auth', 'sign_out', 'success');
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      trackEvent('Auth', 'sign_out', 'error');
      return false;
    }
  }
}

// Exportar una instancia única del servicio
export const syncService = new SyncService(); 