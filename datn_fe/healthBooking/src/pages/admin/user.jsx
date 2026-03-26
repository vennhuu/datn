import { useEffect, useState } from "react";
import TableUser from "../../components/admin/user/table.user";
import UserForm from "../../components/admin/user/user.form";
import { fetchAllUserAPI } from "../../services/api.service.user";

const User = () => {

    const [dataUsers , setDataUsers] = useState([]) ;
    const [current , setCurrent] = useState(1) ;
    const [pageSize , setPageSize] = useState(10) ;
    const [total , setTotal] = useState(0) ;

    const loadUser = async() => {
        const res = await fetchAllUserAPI(current , pageSize) ;
        if ( res.data ) {
            setDataUsers(res.data.result);
            setCurrent(res.data.meta.currentPage);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.totalElements);
        }
    };

    useEffect(() => {
        loadUser();
    }, [current, pageSize]);

    return (
        <>
            <UserForm loadUser={loadUser}/>
            <TableUser
                loadUser={loadUser}
                dataUsers={dataUsers}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}

            />
        </>
    );
}

export default User ;