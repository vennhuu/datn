import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter style={{ textAlign: 'center' }}>
            Phước from QuangBinh ©{new Date().getFullYear()} Created by Venn
        </AntFooter>
    );
};

export default Footer;