import { getCurrentInstance } from "vue";

export function useKeycloak() {
  const instance = getCurrentInstance();
  const keycloak = instance?.appContext.config.globalProperties.$keycloak;

  if (!keycloak) {
    throw new Error("Keycloak is not initialized");
  }

  return keycloak;
}
