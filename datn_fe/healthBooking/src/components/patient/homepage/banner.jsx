import { Input, Carousel } from "antd";
import banner1 from "../../../assets/banner1.avif";
import banner2 from "../../../assets/banner2.webp";
import banner3 from "../../../assets/banner3.avif";

const Banner = () => {

    const banners = [banner1 , banner2 , banner3];

    return (
        <Carousel autoplay autoplaySpeed={2000}>
            {banners.map((item, index) => (
                <div key={index}>
                    <div style={{ position: "relative", height: 550 }}>
                        
                        <img
                            src={item}
                            alt="banner"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />

                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;