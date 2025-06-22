import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Clock, MapPin } from 'lucide-react';
import axios from '../axios'; // adjust if axios import path is different

export default function InterviewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

 useEffect(() => {
  const fetchInterviews = async () => {
    try {
      const res = await axios.get('/interviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const fetched = res.data.map((iv) => ({
        id: iv._id,
        title: `${iv.job?.position || iv.jobTitle} - ${iv.round}`,
        date: new Date(iv.date),
        time: iv.time || 'N/A',
        company: iv.company || 'N/A',
        type: iv.round,
        location: iv.location || 'N/A',
      }));

      setEvents(fetched);
    } catch (err) {
      console.error('Error fetching interviews:', err);
    }
  };

  fetchInterviews();
}, []);


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(
      (event) => event.date.toDateString() === dateToCheck.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'technical': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'hr': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'final': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day) => {
    if (!day) return false;
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateToCheck.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Calendar</h1>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{events.length}+ Scheduled Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>480+ Applications Sent</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigateMonth(1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-white/60 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 rounded-lg border transition-all duration-200 ${
                      day
                        ? isToday(day)
                          ? 'bg-white/20 border-white/40 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-white' : 'text-white/80'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs px-2 py-1 rounded border ${getTypeColor(event.type)} truncate`}
                              title={event.title}
                            >
                              {event.type}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Upcoming Interviews</h3>
            <div className="space-y-4">
              {events
                .filter((e) => e.date >= today)
                .sort((a, b) => a.date - b.date)
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-purple-300 font-medium text-sm">
                      {event.company}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
