import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';

export const AcademicCalendarView: React.FC = () => {
  const { events, currentUser, language } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed, 9 = October 2026

  const canAddEvent =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'principal' ||
    currentUser.role === 'dept_head';

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const eventTypeColors: Record<string, string> = {
    exam: 'bg-purple-100 text-purple-800 border-purple-200',
    assignment: 'bg-blue-100 text-blue-800 border-blue-200',
    holiday: 'bg-rose-100 text-rose-800 border-rose-200',
    seminar: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    admission: 'bg-amber-100 text-amber-800 border-amber-200',
    general: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  // Calendar month days generation for October 2026
  // October 2026 starts on Thursday (index 4) and has 31 days
  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday

  const calendarDays = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'শিক্ষাবর্ষের দিনপঞ্জিকা ও সময়সূচি' : 'Academic Calendar & Institutional Schedule'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Examination Timetables, Holidays, Seminars & Deadlines
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {['all', 'exam', 'assignment', 'holiday', 'seminar'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${
                filterType === type
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              October 2026 · Academic Schedule
            </h2>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <span className="font-semibold text-slate-700">Autumn Semester 2025-26</span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-2 border-b border-slate-100">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-24 bg-slate-50/50 rounded-lg" />;
              }

              const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => {
                if (e.date === dateStr) return true;
                if (e.endDate && dateStr >= e.date && dateStr <= e.endDate) return true;
                return false;
              });

              return (
                <div
                  key={day}
                  className="h-24 p-1.5 border border-slate-100 rounded-lg hover:border-sky-300 hover:bg-slate-50/50 transition flex flex-col justify-between overflow-hidden"
                >
                  <span className="font-semibold text-xs text-slate-800">{day}</span>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        title={ev.title}
                        className={`text-[10px] font-medium px-1 py-0.5 rounded truncate border ${
                          eventTypeColors[ev.type] || 'bg-slate-100'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-semibold pl-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Events Agenda List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Institutional Agenda
          </h2>

          <div className="space-y-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      eventTypeColors[ev.type]
                    }`}
                  >
                    {ev.type}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {ev.date} {ev.endDate && `to ${ev.endDate}`}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">{ev.title}</div>
                <p className="text-slate-600 text-xs leading-relaxed">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
