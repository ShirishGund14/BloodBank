import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';
import { message } from 'antd';
import { getLoggedInUserName } from '../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser } from '../redux/usersSlice';
import { SetLoading } from '../redux/loadersSlice';

const ProtectedPage = ({ children }) => {

    const { currentUser } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getCurrentUser = async () => {
        try {
            dispatch(SetLoading(true))
            const response = await GetCurrentUser();
            dispatch(SetLoading(false))

            if (response.success) {
                message.success(response.message)

                dispatch(SetCurrentUser(response.data))

            }
            else {
                throw new Error(response.message)
            }
        } catch (error) {
            // navigate("/login");
            dispatch(SetLoading(false))
            message.error(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getCurrentUser();
        }
        else {
            navigate('/login')
        }
    }, [])

    return (
        currentUser && (
            <div>

                {/* header */}

                <div className='flex justify-between items-center bg-primary p-5 text-white '>

                    <div  className='cursor-pointer' onClick={()=>navigate('/')} >
                        <h1>
                            
                            <span className='text-2xl'>BloodBank</span>
                            
                        </h1>
                        <span className='text-xs'>{currentUser.userType.toUpperCase()} </span>
                    </div>


                    <div className='flex items-center'>
                        <i class="ri-map-pin-user-line mr-1 cursor-pointer"></i>

                        <div className='flex flex-col'>
                            <span className='mr-5 text-md cursor-pointer'
                            onClick={()=> navigate('/profile')}
                            >{getLoggedInUserName(currentUser).toUpperCase()} </span>
                        </div>

                        <i class="ri-logout-circle-r-line ml-4 cursor-pointer"
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login')
                            }}
                        >

                        </i>
                    </div>
                </div>




                {/* body */}
                <div className='px-5 py-1'>   {children} </div>

            </div>

        )
    )
}

export default ProtectedPage