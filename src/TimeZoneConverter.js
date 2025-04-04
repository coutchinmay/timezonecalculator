import React, { useState, useEffect } from 'react';
import './TimeZoneConverter.css';

const TimeZoneConverter = () => {
  const [sourceTime, setSourceTime] = useState('');
  const [sourceDate, setSourceDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceCountry, setSourceCountry] = useState('Asia/Kolkata');
  const [targetCountry, setTargetCountry] = useState('');
  const [convertedTime, setConvertedTime] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [timeZones, setTimeZones] = useState([]);
  const [groupedTimeZones, setGroupedTimeZones] = useState({});

  useEffect(() => {
    const allTimeZones = [
        'Africa/Abidjan', 'Africa/Accra', 'Africa/Algiers', 'Africa/Bissau', 'Africa/Cairo',
        'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Johannesburg', 'Africa/Lagos',
        'Africa/Maputo', 'Africa/Nairobi', 'Africa/Tripoli', 'Africa/Tunis',
        'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Bogota',
        'America/Caracas', 'America/Chicago', 'America/Denver', 'America/Godthab',
        'America/Guatemala', 'America/Guayaquil', 'America/Halifax', 'America/Indiana/Indianapolis', 'America/Lima', 'America/Los_Angeles',
        'America/Mexico_City', 'America/New_York', 'America/Phoenix', 'America/Santiago',
        'America/Sao_Paulo', 'America/St_Johns', 'America/Toronto', 'America/Vancouver',
        'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/Mawson', 'Antarctica/McMurdo',
        'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Vostok',
        'Asia/Almaty', 'Asia/Amman', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok',
        'Asia/Beirut', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dubai', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Hong_Kong', 'Asia/Irkutsk',
        'Asia/Jakarta', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Kathmandu',
        'Asia/Kolkata', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuwait',
        'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Qatar', 'Asia/Riyadh', 'Asia/Seoul', 'Asia/Shanghai',
        'Asia/Singapore', 'Asia/Taipei', 'Asia/Tehran', 'Asia/Tokyo', 'Asia/Vladivostok',
        'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Asia/Yerevan',
        'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Atlantic/Reykjavik',
        'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Darwin', 'Australia/Hobart',
        'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney',
        'Europe/Amsterdam', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin',
        'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Copenhagen',
        'Europe/Dublin', 'Europe/Helsinki', 'Europe/Istanbul', 'Europe/Kaliningrad',
        'Europe/Kiev', 'Europe/Lisbon', 'Europe/London', 'Europe/Madrid', 'Europe/Moscow',
        'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Rome', 'Europe/Stockholm',
        'Europe/Vienna', 'Europe/Warsaw', 'Europe/Zurich',
        'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Guam', 'Pacific/Honolulu',
        'Pacific/Majuro', 'Pacific/Midway', 'Pacific/Noumea', 'Pacific/Pago_Pago',
        'Pacific/Port_Moresby', 'Pacific/Tongatapu',
        'UTC'
      ];

    setTimeZones(allTimeZones);

    const grouped = allTimeZones.reduce((acc, tz) => {
      const region = tz.split('/')[0];
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(tz);
      return acc;
    }, {});

    setGroupedTimeZones(grouped);
  }, []);

  useEffect(() => {
    if (sourceTime && sourceDate && sourceCountry && targetCountry) {
      convertTime();
    }
  }, [sourceTime, sourceDate, sourceCountry, targetCountry]);

  const convertTime = () => {
    try {
      // Parse the input time and date
      const [hours, minutes] = sourceTime.split(':').map(Number);
      const [year, month, day] = sourceDate.split('-').map(Number);
      
      // Create a date string in ISO format
      const dateString = `${sourceDate}T${sourceTime}:00`;
      
      // Get the time zone offsets
      const sourceOffset = getTimezoneOffset(sourceCountry, new Date(dateString));
      const targetOffset = getTimezoneOffset(targetCountry, new Date(dateString));
      
      // Calculate the time difference between the two time zones
      const offsetDiff = targetOffset - sourceOffset;
      
      // Create a date object for the source time
      const sourceDateObj = new Date(year, month - 1, day, hours, minutes);
      
      // Apply the offset difference to get the target time
      const targetDateObj = new Date(sourceDateObj.getTime() + offsetDiff);
      
      // Format the converted time and date
      const formattedTime = targetDateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const formattedDate = targetDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setConvertedTime(formattedTime);
      setConvertedDate(formattedDate);
    } catch (error) {
      console.error("Conversion error:", error);
      setConvertedTime('Invalid format');
      setConvertedDate('');
    }
  };

  // Helper function to get timezone offset in milliseconds
  const getTimezoneOffset = (timeZone, date) => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return utcDate.getTime() - tzDate.getTime();
  };

  const handleTimeChange = (e) => {
    setSourceTime(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setSourceDate(e.target.value);
  };

  const getLocationName = (timeZone) => {
    return timeZone.split('/').pop().replace(/_/g, ' ');
  };

  return (
    <div className="time-zone-container">
      <h1 className="time-zone-header">Time Zone Converter</h1>
      
      <div className="date-time-grid">
        <div className="time-input-container">
          <label className="input-label">Date:</label>
          <input
            type="date"
            value={sourceDate}
            onChange={handleDateChange}
            className="time-input"
          />
        </div>
        
        <div className="time-input-container">
          <label className="input-label">Time:</label>
          <input
            type="time"
            value={sourceTime}
            onChange={handleTimeChange}
            className="time-input"
          />
        </div>
      </div>
      
      <div className="timezone-grid">
        <div>
          <label className="input-label">From:</label>
          <select
            value={sourceCountry}
            onChange={(e) => setSourceCountry(e.target.value)}
            className="timezone-select"
          >
            {Object.keys(groupedTimeZones).sort().map(region => (
              <optgroup key={region} label={region}>
                {groupedTimeZones[region].sort().map(tz => (
                  <option key={tz} value={tz}>
                    {getLocationName(tz)} ({tz})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        <div>
          <label className="input-label">To:</label>
          <select
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
            className="timezone-select"
          >
            <option value="">Select a timezone</option>
            {Object.keys(groupedTimeZones).sort().map(region => (
              <optgroup key={region} label={region}>
                {groupedTimeZones[region].sort().map(tz => (
                  <option key={tz} value={tz}>
                    {getLocationName(tz)} ({tz})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      
      <div className="results-container">
        <div>
          {convertedTime ? (
            <div>
              <p className="results-text-small">When it's</p>
              <p className="source-date">
                {sourceDate ? 
                  new Date(sourceDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Select date'
                }
              </p>
              <p className="source-time">
                {sourceTime ? 
                  new Date(`2000-01-01T${sourceTime}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : 'Select time'
                }
              </p>
              <p className="source-location">in {getLocationName(sourceCountry)}</p>
              <p className="divider-text">it will be</p>
              {convertedDate && <p className="converted-date">{convertedDate}</p>}
              <p className="converted-time">{convertedTime}</p>
              <p className="target-location">in {getLocationName(targetCountry)}</p>
            </div>
          ) : (
            <p className="empty-result">Enter a time to see the conversion</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;