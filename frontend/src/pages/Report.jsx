import React, { useEffect } from 'react';
import { useEvent } from '../hooks/useEvent';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts"

const Report = () => {
  const { fetchUserEventById, isUserEventById, userEvent, fetchRegisterUser, isFetchRegisterUser, registerUser } = useEvent();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchUserEventById(id);
      fetchRegisterUser(id);
    }
  }, [id]);

  if (isUserEventById || isFetchRegisterUser) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <ClipLoader size={40} />
      </div>
    );
  }

  if (!userEvent) return <p className="text-center mt-10">Event not found</p>;

  const totalSeats = userEvent.capacity || 0;
  const bookedSeats = registerUser?.length || 0;
  const unbookedSeats = totalSeats - bookedSeats;
  const totalProfit = bookedSeats * (userEvent.price || 0);
  const data=[
    {
      name:"booked seats",
      count:bookedSeats
    },
    {
      name:"unbooked seats",
      count:unbookedSeats
    }
  ]
  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col md:flex-row gap-6">
      <div className="flex-1 h-1/2 bg-white rounded-lg shadow p-4 grid grid-cols-4 gap-3">
        <h2 className="text-xl font-semibold mb-2 text-gray-700 text-center col-span-4">Event Stats</h2>
        <div className="p-2 text-center rounded-full flex flex-col justify-center items-center col-span-4">
          <PieChart width={600} height={300}>
            <Pie data={data} dataKey={"count"} label>
              <Cell fill='blue'/>
              <Cell fill='red'/>
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </div>
        <div className="p-2 bg-blue-50 text-center rounded-full flex flex-col justify-center items-center">
          <p className="text-gray-500 text-sm">Total Seats</p>
          <p className="text-lg font-semibold">{totalSeats}</p>
        </div>
        <div className="p-2 bg-green-50 rounded-full text-center flex flex-col justify-center items-center">
          <p className="text-gray-500 text-sm">Booked Seats</p>
          <p className="text-lg font-semibold">{bookedSeats}</p>
        </div>
        <div className="p-2 bg-red-50 rounded-full text-center flex flex-col justify-center items-center">
          <p className="text-gray-500 text-sm">Unbooked Seats</p>
          <p className="text-lg font-semibold">{unbookedSeats}</p>
        </div>
        <div className="p-2 bg-yellow-50 rounded-full text-center flex flex-col justify-center items-center">
          <p className="text-gray-500 text-sm">Total Profit</p>
          <p className="text-lg font-semibold">Rs {totalProfit}</p>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-y-auto max-h-[500px]">
        <h2 className="text-xl font-semibold mb-2 text-gray-700 text-center">Registered Users</h2>
        {registerUser && registerUser.length > 0 ? (
          <div className="space-y-2">
            <div className='w-full h-10 flex flex-row justify-around items-center'><strong>Name</strong><strong>Email</strong><strong>Contact</strong></div>
            {registerUser.map((user, index) => (
              <div key={index} className="p-2 w-full h-10 flex flex-row justify-around items-center bg-gray-50 rounded border border-gray-200">
                <p className="text-sm"> {user.name}</p>
                <p className="text-sm"> {user.email}</p>
                <p className="text-sm"> {user.number}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No users have registered yet</p>
        )}
      </div>

    </div>
  );
};

export default Report;
