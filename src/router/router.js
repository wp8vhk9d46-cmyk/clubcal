import { isSupabaseConfigured } from "../services/supabaseClient.js";
import { store } from "../state/store.js";

let Dom;
let UI;

export function configureRouter(context) {
  Dom = context.Dom;
  UI = context.UI;
}

export function showView(name) {
  if (name === "admin" && !UI.ensureAdminAccess()) return;

  store.setView(name);
  Dom.views.forEach((view) => {
    const isTarget = view.dataset.view === name;
    view.classList.remove("visible");
    if (isTarget) {
      view.classList.add("active");
      requestAnimationFrame(() => view.classList.add("visible"));
    } else {
      view.classList.remove("active");
    }
  });

  if (name === "dashboard") {
    UI.hydrateDashboard();
  }
  if (name === "discovery") {
    Dom.schoolSearchInput.focus();
    if (store.state.currentSchool && !store.state.currentDiscoveryData.length && isSupabaseConfigured()) {
      UI.loadSchoolDiscovery(store.state.currentSchool, false);
    }
  }
  if (name === "admin") {
    UI.renderAdminList();
  }

  UI.closeMobileNav();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function syncHashRoute() {
  if (window.location.hash === "#admin") {
    showView("admin");
  } else if (store.state.currentView === "admin") {
    showView("landing");
  }
}
