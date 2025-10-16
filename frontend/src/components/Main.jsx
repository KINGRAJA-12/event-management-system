import React, { useEffect, useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { SlCalender } from "react-icons/sl";
import { useEvent } from '../hooks/useEvent';
import { ClipLoader } from "react-spinners";
import { formatDate } from '../config/formatDate';
const Main = () => {
  const { isFetch, fetchAllEvents, events } = useEvent();
  const [search, setSearch] = useState("");     
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchAllEvents();
  }, []);
  const filteredEvents = events.filter(event => {
    const titleMatch = event.title.toLowerCase().includes(search.toLowerCase());
    const dateMatch = searchDate ? event.date === searchDate : true;
    return titleMatch && dateMatch;
  });

  if (isFetch) {
    return (
      <div className='w-full h-full flex justify-center items-center text-2xl'>
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-8">
      <div className="flex flex-col md:flex-row justify-center mb-12 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full md:max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}/>
        <input
          type="date"
          className="w-full md:max-w-xs px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}/>
      </div>
      <section>
        <header className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
          All Events
        </header>
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.map(event => (
            <div
              key={event?.event_id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div>
                <img
                  src={event?.image}
                  alt={event?.title}
                  className="w-full h-48 object-cover"/>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <h1 className="text-xl font-semibold text-gray-800">{event?.title}</h1>
                <p className="text-gray-600 text-sm">{event?.description}</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <SlCalender />
                  <span>{formatDate(event?.date)}</span>
                </div>

                <Link
                  to={`/view-event/${event?.event_id}`}
                  className="mt-2 inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                  View <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <p className="text-center col-span-full text-gray-500">No events found</p>
          )}
        </main>
      </section>
    </div>
  );
};

export default Main;
