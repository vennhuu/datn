export const t = {
  // Header
  header: {
    home:           { vi: "Trang chủ",   en: "Home" },
    doctors:        { vi: "Bác sĩ",      en: "Doctors" },
    specialization: { vi: "Chuyên khoa", en: "Specialties" },
    hospital:       { vi: "Bệnh viện",   en: "Hospitals" },
    chat:           { vi: "Nhắn tin",    en: "Messages" },
    darkMode:       { vi: "Giao diện tối",  en: "Dark mode" },
    lightMode:      { vi: "Giao diện sáng", en: "Light mode" },
    profile:        { vi: "Hồ sơ cá nhân",     en: "My Profile" },
    history:        { vi: "Lịch sử đặt khám",  en: "Appointment History" },
    logout:         { vi: "Đăng xuất",  en: "Logout" },
    login:          { vi: "Đăng nhập",  en: "Login" },
  },

  // Specialization
  specialization: {
    pageTitle: { vi: "Dịch vụ chuyên khoa",                           en: "Medical Specialties" },
    pageSub:   { vi: "Chọn chuyên khoa để tìm bác sĩ phù hợp",        en: "Choose a specialty to find the right doctor" },
    doctors:   { vi: "Bác sĩ",    en: "Doctors" },
    rating:    { vi: "Đánh giá",  en: "Rating" },
    visits:    { vi: "Lượt khám", en: "Visits" },
    about:     { vi: "Về chuyên khoa", en: "About" },
    hours:     { vi: "Giờ làm việc",  en: "Working hours" },
    hoursVal:  { vi: "Thứ 2 – Thứ 7  |  7:30 – 17:00", en: "Mon – Sat  |  7:30 – 17:00" },
    cost:      { vi: "Chi phí khám",  en: "Consultation fee" },
    costVal:   { vi: "200,000 – 500,000 VNĐ", en: "200,000 – 500,000 VND" },
    viewBtn:   { vi: "Xem tất cả bác sĩ khoa", en: "View all doctors in" },
    close:     { vi: "Đóng", en: "Close" },
  },

  // Appointment history
  appointmentHistory: {
    pageTitle:  { vi: "Lịch sử đặt khám",               en: "Appointment History" },
    pageSub:    { vi: "Theo dõi và quản lý lịch khám",   en: "Track and manage your appointments" },
    total:      { vi: "lịch khám",   en: "appointments" },
    all:        { vi: "Tất cả",      en: "All" },
    pending:    { vi: "Chờ xác nhận", en: "Pending" },
    confirmed:  { vi: "Đã xác nhận", en: "Confirmed" },
    done:       { vi: "Đã khám xong", en: "Completed" },
    cancelled:  { vi: "Đã hủy",      en: "Cancelled" },
    empty:      { vi: "Không có lịch khám nào", en: "No appointments found" },
    today:      { vi: "Hôm nay",     en: "Today" },
    daysLeft:   { vi: "ngày nữa",    en: "days left" },
    price:      { vi: "Giá khám:",   en: "Fee:" },
    contact:    { vi: "Liên hệ",     en: "Contact" },
    cancelBtn:  { vi: "Hủy lịch",    en: "Cancel" },
    cancelling: { vi: "Đang hủy...", en: "Cancelling..." },
  },

  // Doctor list
  doctorList: {
    pageTitle: { vi: "Tìm kiếm bác sĩ",               en: "Find a Doctor" },
    pageSub:   { vi: "Kết nối với đội ngũ bác sĩ chuyên khoa hàng đầu", en: "Connect with top specialist doctors nationwide" },
  },

  // Hospital
  hospital: {
    pageTitle: { vi: "Danh sách bệnh viện", en: "Hospitals" },
  },
};

/** Helper dùng trong component: tr(lang, t.header.home) → "Trang chủ" hoặc "Home" */
export const tr = (lang, entry) => entry?.[lang] ?? entry?.vi ?? "";