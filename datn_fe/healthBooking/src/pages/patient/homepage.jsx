import Banner from "../../components/patient/homepage/banner";
import Specialization from "../../components/patient/homepage/specialization";
import ListDoctor from "../../components/patient/homepage/list.doctor";
import ListHospital from "../../components/patient/homepage/list.hospital";
import ScheduleProcess from "../../components/patient/homepage/schedule.process";
import QuickAccess from "../../components/patient/homepage/QuickAccess";
import TrustBar from "../../components/patient/homepage/trustbar";

const Homepage = () => {
  return (
    <>
      {/* HERO BANNER */}
      <Banner />

      {/* QUICK ACCESS — overlaps the banner */}
      <QuickAccess />

      {/* TRUST BAR */}
      <div style={{ marginTop: 48 }}>
        <TrustBar />
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        <Specialization />
        <ListDoctor />
        <ListHospital />
        <ScheduleProcess />
      </div>
    </>
  );
};

const styles = {
  content: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 48px",
  },
};

export default Homepage;