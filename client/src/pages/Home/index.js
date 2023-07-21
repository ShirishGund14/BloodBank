import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, message } from 'antd'
import { SetLoading } from '../../redux/loadersSlice';
import { GetallBloodGroupsInInventory } from './../../apicalls/dashboard';
import { getLoggedInUserName } from '../../utils/helpers';
import InventoryTable from './../../components/InventoryTable';

const Home = () => {

  const { currentUser } = useSelector((state) => state.users);
  const [bloodGroupsData, setBloodGroupsData] = useState([])
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetallBloodGroupsInInventory();
      dispatch(SetLoading(false));

      if (response.success) {
        setBloodGroupsData(response.data);
      }
      else {
        throw new Error(response.message)
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));

    }
  }

  useEffect(() => {
    getData();
  }, []);





  const colors = ['#6527BE', '#9681EB', '#6554AF', '#9376E0', '#DD58D6', '#9336B4', '#5C469C', '#E11299']

  return (
    <div>
      
      {/* <span className='text-primary text-2xl '  >
        Welcome {getLoggedInUserName(currentUser)}
      </span> */}

      {currentUser.userType === 'organization' && (

        <>

          <div className='grid grid-cols-4 gap-5 mt-5 my-5'>
            {bloodGroupsData.map((bloodGroup, index) => {

              const color = colors[index];

              return (
                <div className={`p-5 flex justify-between  text-white rounded-md `}
                  style={{ backgroundColor: color }}
                >
                  <h1 className='text-3xl uppercase'>{bloodGroup.bloodGroup}</h1>


                  <div className='flex flex-col justify-between gap-2'>

                    <div className='flex justify-between gap-5'>
                      <span>TotalIn</span>
                      <span>{bloodGroup.totalIn} ml</span>
                    </div>

                    <div className='flex justify-between gap-5'>
                      <span>TotalOut</span>
                      <span>{bloodGroup.totalOut} ml</span>
                    </div>

                    <div className='flex justify-between gap-5'>
                      <span>Available</span>
                      <span>{bloodGroup.available} ml</span>
                    </div>

                  </div>


                </div>
              )
            })
            }

          </div>

          <span className=''>
            <h1>Recent updates</h1>
          </span>

          <InventoryTable
            filters={{
              organization: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />

        </>

      )}



      {currentUser.userType === 'donar' && (
        <>

          <span className=''>
            <h1 className='mt-5'>Your Recent Donations</h1>
          </span>

          <InventoryTable
            filters={{
              donar: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}

      {currentUser.userType === 'hospital' && (
        <>

          <span className=''>
            <h1 className='mt-5'>Your Recent Consumption</h1>
          </span>

          <InventoryTable
            filters={{
              hospital: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}



    </div>
  )
}

export default Home