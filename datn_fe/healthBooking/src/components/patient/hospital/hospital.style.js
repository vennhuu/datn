export const s = {
  page: { background: "#f0f4f8", minHeight: "100vh" },

  pageHeader: {
    background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)",
    padding: "40px 80px 32px",
  },
  headerContent: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 28,
  },
  pageTitle: { fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.4px" },
  pageSub: { fontSize: 15, color: "#b8d9f2", margin: 0 },
  statNum: { fontSize: 32, fontWeight: 700, color: "#fff" },
  statLabel: { fontSize: 13, color: "#a8d8ff" },

  searchWrap: { display: "flex", flexDirection: "column", gap: 14 },
  searchBar: {
    display: "flex", alignItems: "center", background: "#fff",
    borderRadius: 12, padding: 6,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)", gap: 8, maxWidth: 620,
  },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    padding: "10px 8px", fontSize: 14, color: "#1e2d3d", background: "transparent",
  },
  searchBtn: {
    background: "#0a6abf", color: "#fff", border: "none",
    padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: "pointer", flexShrink: 0,
  },
  cityTabs: { display: "flex", gap: 8 },
  cityTab: {
    background: "rgba(255,255,255,0.12)", color: "#a8d8ff",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20,
    padding: "6px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer",
  },
  cityTabActive: { background: "#fff", color: "#0a6abf", border: "1px solid #fff", fontWeight: 700 },

  content: { maxWidth: 1200, margin: "0 auto", padding: "28px 80px 60px" },
  resultBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e8edf3",
  },
  resultText: { fontSize: 14, color: "#64748b" },

  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 },
  skeleton: { height: 168, background: "#e8edf3", borderRadius: 16 },
  empty: {
    textAlign: "center", padding: "80px 0",
    background: "#fff", borderRadius: 16, border: "1px solid #e8edf3",
  },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: 600, color: "#1e2d3d", margin: "0 0 6px" },
  emptySub: { fontSize: 13, color: "#94a3b8", margin: 0 },

  card: {
    display: "flex", background: "#fff", borderRadius: 16,
    overflow: "hidden", border: "1px solid #e8edf3", height: 168,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "transform .2s, box-shadow .2s, border-color .2s",
  },
  cardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 32px rgba(10,106,191,0.13)",
    borderColor: "#c2dcf5",
  },
  imgWrap: {
    width: 155, minWidth: 155, overflow: "hidden", position: "relative",
    background: "#eef4ff", display: "flex", alignItems: "center", justifyContent: "center",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" },
  imgFallback: { fontSize: 48, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
  badge: {
    position: "absolute", top: 10, left: 10, background: "#0a6abf", color: "#fff",
    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
    display: "flex", alignItems: "center",
  },
  body: {
    flex: 1, padding: "14px 18px", display: "flex",
    flexDirection: "column", justifyContent: "space-between", overflow: "hidden",
  },
  name: {
    fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  address: {
    display: "flex", alignItems: "flex-start", gap: 5,
    fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
  },
  intro: { fontSize: 12, color: "#94a3b8", margin: "6px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  bottom: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  ratingRow: { display: "flex", alignItems: "center", gap: 8 },
  ratingBadge: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 },
  detailBtn: {
    border: "none", background: "#eef4ff", color: "#0a6abf", fontSize: 12, fontWeight: 600,
    padding: "0 12px", height: 30, borderRadius: 8, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5, transition: "background .15s, color .15s",
  },
  detailBtnHover: { background: "#0a6abf", color: "#fff" },
  paginationWrap: { display: "flex", justifyContent: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid #f0f4f8" },
};