import React, { useState, useContext, useEffect } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { RiCalendar2Line, RiTimeLine, RiCheckLine } from 'react-icons/ri';
import FittingsContext from '../context/FittingsContext';
import { toast } from 'react-hot-toast';

const ScheduleSwingAnalysis = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [comments, setComments] = useState('');
  
  const { scheduleFitting } = useContext(FittingsContext);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  const disabledDates = (date) => {
    return date < new Date();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      await scheduleFitting({
        type: 'swing-analysis',
        date: selectedDate,
        time: selectedTime,
        comments: comments
      });

      toast.success('Swing Analysis scheduled successfully!');
      // Reset form or navigate
      setStep(1);
      setSelectedDate(null);
      setSelectedTime('');
      setComments('');
    } catch (error) {
      toast.error('Failed to schedule swing analysis');
    }
  };

  return (
    <div className="max-w-7xl my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <RiCalendar2Line className="mr-3 text-blue-600" />
        Schedule Swing Analysis
      </h2>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Select a Date
          </h3>
          <Calendar
            date={selectedDate}
            onChange={handleDateSelect}
            minDate={new Date()}
            color="#3B82F6"
            className="w-full"
          />
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <RiTimeLine className="mr-3 text-blue-600" />
            Select a Time
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 border rounded-md transition-colors ${
                  selectedTime === time 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-blue-50 text-gray-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button 
              onClick={() => setStep(1)}
              className="text-gray-600 hover:underline"
            >
              Back to Date
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Comments and Confirmation */}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <RiCheckLine className="mr-3 text-blue-600" />
            Additional Details
          </h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Selected Date: {selectedDate.toLocaleDateString()}
            </label>
            <label className="block text-gray-700 mb-2">
              Selected Time: {selectedTime}
            </label>
          </div>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Any additional comments or requirements? (Optional)"
            className="w-full p-3 border rounded-md mb-4 resize-none"
            rows="4"
          />
          <div className="flex justify-between">
            <button 
              onClick={() => setStep(2)}
              className="text-gray-600 hover:underline"
            >
              Back to Time
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSwingAnalysis;