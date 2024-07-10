import React, { useState, useEffect } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({ title: '', date_time: '' });
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    location: '',
    date_time: '',
    organizer_id: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    const token = localStorage.getItem('token'); // Ensure token is retrieved correctly
    fetch('http://127.0.0.1:5555/events', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          console.error('Fetch events failed:', response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  const handleDelete = (eventId) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5555/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId));
        }
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  const handleUpdate = (event) => {
    setEditingEvent(event);
    setUpdatedEvent({ title: event.title, date_time: event.date_time });
  };

  const handleUpdateSubmit = (eventId) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5555/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEvent),
    })
      .then(response => {
        if (response.ok) {
          fetchEvents();
          setEditingEvent(null);
        }
      })
      .catch(error => {
        console.error('Error updating event:', error);
      });
  };

  const handleCreateEvent = () => {
    const formattedDateTime = new Date(newEventData.date_time).toISOString().slice(0, 19).replace('T', ' ');
    const token = localStorage.getItem('token');
    
    fetch('http://127.0.0.1:5555/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...newEventData, date_time: formattedDateTime }),
    })
      .then(response => {
        if (response.ok) {
          fetchEvents();
          setNewEventData({
            title: '',
            description: '',
            location: '',
            date_time: '',
            organizer_id: '',
          });
        }
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
  };

  return (
    <div>
      <h2>Events</h2>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newEventData.title}
          onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEventData.description}
          onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newEventData.location}
          onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEventData.date_time}
          onChange={(e) => setNewEventData({ ...newEventData, date_time: e.target.value })}
        />
        <input
          type="text"
          placeholder="Organizer ID"
          value={newEventData.organizer_id}
          onChange={(e) => setNewEventData({ ...newEventData, organizer_id: e.target.value })}
        />
        <button onClick={handleCreateEvent}>Create Event</button>
      </div>
      <ol>
        {events.map(event => (
          <li key={event.id}>
            {editingEvent && editingEvent.id === event.id ? (
              <div>
                <input
                  type="text"
                  value={updatedEvent.title}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
                />
                <input
                  type="datetime-local"
                  value={updatedEvent.date_time}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, date_time: e.target.value })}
                />
                <button onClick={() => handleUpdateSubmit(event.id)}>Save</button>
                <button onClick={() => setEditingEvent(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {event.title} - {new Date(event.date_time).toLocaleString()}
                <button onClick={() => handleUpdate(event)}>Edit</button>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Events;
