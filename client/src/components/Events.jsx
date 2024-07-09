import React, {useState, useEffect} from 'react'

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(()=>{
        fetch('http://127.0.0.1:5555/events')
        .then(response => response.json())
        .then(data=>{
            setEvents(data);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
    }, []);
  return (
    <div>
    <h2>Events</h2>
    <ul>
        {events.map(event => (
            <li key={event.id}>
                {event.title} - {event.date}
            </li>
        ))}
    </ul>
</div>
  );
}

export default Events
