export const STORAGE_KEYS = {
  lastViewedSchool: "clubcal_last_viewed_school",
  adminSession: "clubcal_admin_session"
};

export const store = {
  state: {
    currentView: "landing",
    currentTab: "events",
    currentSchool: localStorage.getItem(STORAGE_KEYS.lastViewedSchool) || "",
    currentFilter: "All",
    currentClubRows: [],
    currentDiscoveryData: [],
    activeClub: null,
    authSession: null,
    dashboardEvents: [],
    dashboardStatus: ""
  },

  setView(view) {
    this.state.currentView = view;
  },

  setTab(tab) {
    this.state.currentTab = tab;
  },

  setCurrentSchool(school) {
    this.state.currentSchool = school;
    localStorage.setItem(STORAGE_KEYS.lastViewedSchool, school);
  },

  setDiscoveryRows(rows) {
    this.state.currentClubRows = rows;
    this.state.currentDiscoveryData = this.state.currentFilter === "All"
      ? rows
      : rows.filter((club) => club.category === this.state.currentFilter);
  },

  setFilter(filter) {
    this.state.currentFilter = filter;
    this.setDiscoveryRows(this.state.currentClubRows);
  },

  setAuth(session, club) {
    this.state.authSession = session || null;
    this.state.activeClub = club || null;
    this.state.dashboardStatus = club?.status || "";
  },

  clearAuth() {
    this.state.authSession = null;
    this.state.activeClub = null;
    this.state.dashboardEvents = [];
    this.state.dashboardStatus = "";
  },

  setDashboardEvents(events) {
    this.state.dashboardEvents = events;
  }
};
