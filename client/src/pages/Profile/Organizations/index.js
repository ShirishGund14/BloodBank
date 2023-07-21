import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { Modal, Table, message } from 'antd';
import { GetAllOrganizationsOfDonar, GetAllOrganizationsOfHospital } from '../../../apicalls/users';
import { getDateFormat } from '../../../utils/helpers';
import InventoryTable from '../../../components/InventoryTable';

const Organizations = ({ userType }) => {

  const [showhistorymodal, setShowhistorymodal] = useState(false);
  const { currentUser } = useSelector((state) => state.users)
  const [selectedOrganization, setSelectedOrganization] = useState();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (userType === 'hospital') response = await GetAllOrganizationsOfHospital();
      else response = await GetAllOrganizationsOfDonar();

      dispatch(SetLoading(false));
      if (response.success) {
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


  const columns = [
    {
      title: 'Name',
      dataIndex: 'organizationName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (text) => getDateFormat(text)
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <span className='underline  cursor-pointer'
          onClick={() => {
            setSelectedOrganization(record)
            setShowhistorymodal(true)
          }}
        >History</span>)


    },

  ]


  useEffect(() => {
    getData();
  }, []);


  return (
    <div>

      <Table columns={columns} dataSource={data} />

      {showhistorymodal && (
        <Modal
          title={`${userType === 'donar' ? 'Donation History ' : 'Consumption History '} In ${selectedOrganization.organizationName} Bloodbank `}
          centered
          open={showhistorymodal}
          onClose={() => setShowhistorymodal(false)}
          width={1000}
          onCancel={() => setShowhistorymodal(false)}
        >
          <InventoryTable
            filters={{
              organization: selectedOrganization._id,
              [userType]: currentUser._id,
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default Organizations