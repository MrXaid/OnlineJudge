// features/profile/ActivityGraph.jsx
import { useState, useEffect, useRef} from 'react';

const ActivityGraph = () => {
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  const generateDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/submissions/my/activity', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActivityData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching activity data:', err.message);
      setError(err.message);
      setActivityData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const dates = generateDateRange();
    const mockData = {};
    dates.forEach(date => {
      const random = Math.random();
      if (random < 0.6) mockData[date] = 0;
      else if (random < 0.8) mockData[date] = Math.floor(Math.random() * 5) + 1;
      else if (random < 0.95) mockData[date] = Math.floor(Math.random() * 5) + 6;
      else mockData[date] = Math.floor(Math.random() * 10) + 11;
    });
    return mockData;
  };

  useEffect(() => {
    fetchActivityData();
  }, []);
  useEffect(() => {
  if (!loading && scrollContainerRef.current) {
    scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
  }
}, [loading]);

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (count <= 5) return 'bg-green-200 dark:bg-green-800';
    if (count <= 10) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-600 dark:bg-green-400';
  };

  const getTooltipText = (date, count) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    if (count === 0) return `No submissions on ${formattedDate}`;
    if (count === 1) return `1 submission on ${formattedDate}`;
    return `${count} submissions on ${formattedDate}`;
  };

  const organizeDatesIntoWeeks = () => {
    const dates = generateDateRange();
    const weeks = [];
    let currentWeek = [];
    const firstDate = new Date(dates[0]);
    const firstDayOfWeek = firstDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);
    dates.forEach((date, index) => {
      currentWeek.push(date);
      if (currentWeek.length === 7 || index === dates.length - 1) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    return weeks;
  };

  const weeks = organizeDatesIntoWeeks();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading activity data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity Graph</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error ? 'Showing demo data (API connection failed)' : 'Your submission activity over the past year'}
        </p>
      </div>

      <div className="overflow-x-auto" ref={scrollContainerRef}>
        <div className="inline-block min-w-full">
          <div className="flex mb-2">
            <div className="w-8"></div>
            {weeks.map((week, weekIndex) => {
              const firstDateInWeek = week.find(date => date !== null);
              if (!firstDateInWeek) return <div key={weekIndex} className="w-3 mx-0.5"></div>;
              const date = new Date(firstDateInWeek);
              const isFirstWeekOfMonth = date.getDate() <= 7;
              return (
                <div key={weekIndex} className="w-3 mx-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {isFirstWeekOfMonth ? monthLabels[date.getMonth()] : ''}
                </div>
              );
            })}
          </div>

          <div className="flex">
            <div className="flex flex-col mr-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-3 mb-0.5 text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col mx-0.5">
                  {week.map((date, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 mb-0.5 rounded-sm border border-gray-300 dark:border-gray-600 ${
                        date ? getColor(activityData[date] || 0) : 'bg-transparent border-transparent'
                      }`}
                      title={date ? getTooltipText(date, activityData[date] || 0) : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">Less</div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600"></div>
          <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded-sm border border-gray-300 dark:border-gray-600"></div>
          <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm border border-gray-300 dark:border-gray-600"></div>
          <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-sm border border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">More</div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.values(activityData).reduce((sum, count) => sum + count, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total submissions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.values(activityData).filter(count => count > 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.max(...Object.values(activityData), 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Best day</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(Object.values(activityData).reduce((sum, count) => sum + count, 0) / 365 * 10) / 10}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Daily average</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Could not connect to API endpoint. Showing demo data instead.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityGraph;
