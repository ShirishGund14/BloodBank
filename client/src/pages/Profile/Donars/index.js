import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { GetInventory } from '../../../apicalls/inventory';
import { SetLoading } from '../../../redux/loadersSlice';
import { Table, message } from 'antd';
import { GetAllDonarsOfAnOrganization } from '../../../apicalls/users';
import { getDateFormat } from '../../../utils/helpers';

const Donars = () => {
   const dispatch=useDispatch();
   const [data,setData]=useState([]);

    const getData=async()=>{
        try {
          dispatch(SetLoading(true));
          const response=await GetAllDonarsOfAnOrganization();
          dispatch(SetLoading(false));
          if(response.success){
            setData(response.data);
          }
          else {
            throw new Error(response.message)
          }
        } catch (error) {
          message.error(error.message);
          dispatch(SetLoading(false));
        }
      }


const columns=[
    {
        title:'Name',
        dataIndex:'name',
    },
    {
        title:'Email',
        dataIndex:'email',
    },
    {
        title:'Phone',
        dataIndex:'phone',
    },
    {
        title:'Created At',
        dataIndex:'createdAt',
        render:(text)=>getDateFormat(text)
    },

]

      
      useEffect(()=>{
        getData();
      },[]);


  return (
    <div>
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Donars