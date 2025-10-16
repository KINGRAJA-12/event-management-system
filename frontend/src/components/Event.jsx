import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import { formatDate } from '../config/formatDate';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../hooks/useAuth';
import Papa from "papaparse"
import toast from 'react-hot-toast';
const Event = () => {
  const {
    fetchMyEvents,
    isFetchMyEvent,
    myEvents,
    deleteEvent,
    isDelete,
    createEvents,
    isCreate,
    isUpdate,
    updateEvents,
    SaveCsvEvent,
    isSaveFromCsv
  } = useEvent();
  const today = new Date().toISOString().split('T')[0];
  const [tab, setTab] = useState(true);
  const requiredColumns = ["title", "description", "image", "date", "location", "price", "capacity"];
  const { user } = useAuth();
  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescribtion] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [csvFile,setCsvFile]=useState(null);
  const [csvData,setCSVdata]=useState(null);
  const [fileInput,setFileInpute]=useState(null);
  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user, fetchMyEvents]);
  const handleTabForm = () => setTab(true);
  const handleTabCSV = () =>{
     setTitle('');
    setDescribtion('');
    setPrice('');
    setCapacity('');
    setDate('');
    setAddress('');
    setImage('');
    setEventId(null);
    setIsEdit(false);
    setTab(false)
  } 
  const handleCreate = async () => {
    await createEvents(title, description, image, date, address, price, capacity);
    setTitle('');
    setDescribtion('');
    setPrice('');
    setCapacity('');
    setDate('');
    setAddress('');
    setImage('');
  };
const handleFileChange = (e) => {
  const file = e?.target?.files[0];
  if (!file) return;
  setFileInpute(file)
  setCsvFile(file.name);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const columns = result.meta.fields;
      const missingColumns = requiredColumns.filter(col => !columns.includes(col));
      if (missingColumns.length > 0) {
        toast.error("Some columns are missing: " + missingColumns.join(", "));
        setCsvFile("");
        setCSVdata(null);
        return;
      }
      const formattedData = result.data.map((row) => {
        if (row.date) {
          const [dd, mm, yyyy] = row.date.split("-");
          if(yyyy.length==4){
          console.log("year=",yyyy,"month=",mm,"day=",dd)
          row.date = `${yyyy}-${mm}-${dd}`;
          console.log("formatted day=",row.date)
          }else{
            row.date=`${dd}-${mm}-${yyyy}`
          }
        }
        row.price = Number(row.price);
        row.capacity = Number(row.capacity);
        return row;
      });

      setCSVdata(formattedData);
      console.log("Formatted CSV Data:", formattedData);
    },
    error: (err) => {
      toast.error("Error parsing CSV: " + err.message);
      setCsvFile("");
      setCSVdata(null);
    }
  });
};
  const handleDelete = async (id) => {
    await deleteEvent(id);
  };

  const setEditData = (event) => {
    setTitle(event?.title);
    setDescribtion(event?.description);
    setAddress(event?.location);
    setImage(event?.image);
    setPrice(event?.price);
    setCapacity(event?.capacity);
    setDate(event?.date);
    setEventId(event?.event_id);
    setIsEdit(true);
    setTab(true)
  };
  const handleCancelEdit=()=>{
    setTitle('');
    setDescribtion('');
    setPrice('');
    setCapacity('');
    setDate('');
    setAddress('');
    setImage('');
    setEventId(null);
    setIsEdit(false);
    setTab(true)
  }
  const handleUpdate = async () => {
    await updateEvents(eventId, title, description, image, date, address, price, capacity);
    setTitle('');
    setDescribtion('');
    setPrice('');
    setCapacity('');
    setDate('');
    setAddress('');
    setImage('');
    setEventId(null);
    setIsEdit(false);
  };
  const handleAddCsv=async()=>{
    for(let data of csvData){
      console.log("in add",data)
    }
    await SaveCsvEvent(csvData);
    setCsvFile('');
  }
  

  if (isFetchMyEvent) {
    return (
      <div className='w-full h-full flex justify-center items-center text-2xl'>
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-12 bg-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">My Events</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myEvents && myEvents.length > 0 ? (
              myEvents.map(event => (
                <div key={event?.event_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-3 flex gap-4">
                  <img src={event?.image} alt={event?.title} className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{event?.title}</h3>
                      <p className="text-gray-600 text-sm">{event?.description}</p>
                      <div className="flex flex-wrap gap-3 text-gray-500 text-sm mt-2">
                        <span className="flex items-center gap-1"><FaRupeeSign /> {event?.price}</span>
                        <span>Seats: {event?.capacity}</span>
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(event?.date)}</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt /> {event?.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <Link
                        to={`/report/${event.event_id}`}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        current report
                      </Link>
                      <button
                        className="flex items-center gap-1 px-3 py-1 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        onClick={() => setEditData(event)}>
                        <FaEdit />
                      </button>
                      <button
                        disabled={isDelete}
                        onClick={() => handleDelete(event?.event_id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition">
                        {isDelete === event?.event_id ? <ClipLoader size={15} /> : <FaTrashAlt />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No event found</div>
            )}
          </div>
        </div>
        <div className="md:w-1/3 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Event</h2>
          <div className='w-full h-20 flex justify-around items-center'>
            <button
              onClick={handleTabForm}
              className={`text-blue-500 cursor-pointer ${tab ? "border-b-2 border-b-blue-600" : ""}`}>
              From Form
            </button>
            <button
              onClick={handleTabCSV}
              className={`text-blue-500 cursor-pointer ${tab ? "" : "border-b-2 border-b-blue-600"}`}>
              From CSV
            </button>
          </div>
          {tab && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Enter title of the event" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" onChange={e => setDescribtion(e.target.value)} value={description} placeholder="Enter about event" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" onChange={e => setPrice(e.target.value)} value={price} placeholder="Enter price of the event" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" onChange={e => setCapacity(e.target.value)} value={capacity} placeholder="Enter total available seats" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="date" onChange={e => setDate(e.target.value)} min={today} value={date} className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" onChange={e => setAddress(e.target.value)} value={address} placeholder="Enter address" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" onChange={e => setImage(e.target.value)} value={image} placeholder="Event Image URL" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!isEdit && (
                <button
                disabled={isCreate || !title || !description || !date || !price || !address || !capacity}
                onClick={handleCreate}
                className="mt-6 w-full px-6 py-3 bg-green-600 cursor-pointer text-white font-semibold rounded-xl hover:bg-green-700 transition"
                >
                  {isCreate ? <ClipLoader size={20} /> : "Create Event"}
                </button>
              )}
              {isEdit && (
                <>
                <button
                disabled={isCreate || !title || !description || !date || !price || !address || !capacity}
                  onClick={handleUpdate}
                  className="mt-6 w-full px-6 py-3 bg-green-600 text-white cursor-pointer font-semibold rounded-xl hover:bg-green-700 transition"
                >
                  {isUpdate ? <ClipLoader size={20} /> : "Update Event"}
                </button>
                 <button
                  onClick={handleCancelEdit}
                  className="mt-6 w-full px-6 py-3 bg-red-600 text-white cursor-pointer font-semibold rounded-xl hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                </>
              )}
            </>
          )}
          {!isEdit && !tab && (
            <div className="rounded-2xl w-full p-6 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 transition">
              <span className="text-gray-500 mb-4 text-sm">{csvFile?csvFile:"Upload your events using a CSV file which must include all the field title,description,image(url only),date,location,price,capacity"}</span>
              <label
                htmlFor="fileUpload"
                className="cursor-pointer bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition">
                Choose CSV File
              </label>
              <input id="fileUpload" type="file" accept=".csv" className='hidden' onChange={handleFileChange}/>
              <button 
              disabled={isSaveFromCsv || !csvFile}
              onClick={handleAddCsv}
              className="mt-6 w-full cursor-pointer px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
               {isSaveFromCsv?<ClipLoader/>:"Add From CSV"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
