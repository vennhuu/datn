import { notification, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import { deleteHospitalAPI } from "../../../services/api.service.hospital";
import UpdateHospitalModal from "./update.hospital.modal";
import ViewHospitalDetail from "./view.hospital.detail";

const TableHospital = (props) => {

    const {loadHospital , dataHospitals , current , pageSize , total , setCurrent , setPageSize } = props ;

    const [isModalUpdateOpen , setIsModalUpdateOpen] = useState(false);
    const [dataUpdate , setDataUpdate] = useState(null)
    const [showDrawer , setShowDrawer] = useState(false)
    const [dataDetail , setDataDetail] = useState(null)

    const handleDeleteHospital = async(id) => {
        const res = await deleteHospitalAPI(id) ;
        if ( res.data){
            notification.success({
                message:"Xóa bệnh viện" ,
                description: "Xóa bệnh viện thành công"
            })
            await loadHospital() ;
        }
        else {
            notification.error({
                message:"Xóa bệnh viện thất bại" ,
                description: JSON.stringify(res.message)
            })
        }
        await loadHospital() ;
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (_, record) => {
                return (
                    <a href="#" onClick={() => {
                        setShowDrawer(true)
                        setDataDetail(record)
                    }}>{record.id}</a>
                )
            },
        },
        {
            title: 'Tên bệnh viện',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
            <div style={{display: "flex" , gap: "20px"}}>
                <EditOutlined
                    onClick={() => {
                        setDataUpdate(record);
                        setIsModalUpdateOpen(true)
                    }}
                    style={{ cursor: "pointer", color: "orange"}}
                />
                <Popconfirm
                    title="Xóa bệnh viện"
                    description="Bạn có chắc muốn xóa bệnh viện này?"
                    onConfirm ={() =>
                        handleDeleteHospital(record.id)
                    }
                    okText="Có"
                    cancelText="Không"
                >
                    <DeleteOutlined style={{ cursor: "pointer", color: "red"}}/>
                </Popconfirm>
            </div>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => { 
        if(pagination && pagination.current) {
            if(+pagination.current !== +current) {
                setCurrent(+pagination.current) // "6" = 6
            }
        }

        if(pagination && pagination.pageSize) {
            if(+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize) // "6" = 6
            }
        }
    };

    return (
        <>
            <Table 
                columns={columns} dataSource={dataHospitals} rowKey={"id"}
                pagination={
                    {
                        current: current,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    } }
                onChange={onChange}
            />
            <UpdateHospitalModal
                loadHospital={loadHospital}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <ViewHospitalDetail
                loadHospital={loadHospital}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
            />
        </>

    );
}
export default TableHospital ;