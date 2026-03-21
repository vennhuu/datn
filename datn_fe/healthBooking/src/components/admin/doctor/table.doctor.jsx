import { notification, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import { deleteUserAPI } from "../../../services/api.service.user";
import UpdateDoctorModal from "./update.doctor.modal";
import ViewDoctorDetail from "./view.doctor.detail";

const TableDoctor = (props) => {

    const {loadDoctor , dataDoctors , current , pageSize , total , setCurrent , setPageSize } = props ;

    const [isModalUpdateOpen , setIsModalUpdateOpen] = useState(false);
    const [dataUpdate , setDataUpdate] = useState(null)
    const [showDrawer , setShowDrawer] = useState(false)
    const [dataDetail , setDataDetail] = useState(null)

    const handleDeleteDoctor = async(id) => {
        const res = await deleteUserAPI(id) ;
        if ( res.data){
            notification.success({
                message:"Xóa người dùng" ,
                description: "Xóa người dùng thành công"
            })
            await loadDoctor() ;
        }
        else {
            notification.error({
                message:"Xóa người dùng thất bại" ,
                description: JSON.stringify(res.message)
            })
        }
        await loadDoctor() ;
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
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
                    title="Xóa người dùng"
                    description="Bạn có chắc muốn xóa người dùng này?"
                    onConfirm ={() =>
                        handleDeleteUser(record.id)
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
                columns={columns} dataSource={dataDoctors} rowKey={"id"}
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
            <UpdateDoctorModal
                loadDoctor={loadDoctor}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <ViewDoctorDetail
                loadDoctor={loadDoctor}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
            />
        </>

    );
}
export default TableDoctor ;