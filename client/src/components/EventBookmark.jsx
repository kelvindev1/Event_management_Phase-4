import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://127.0.0.1:5555'; // Replace with your Flask server URL

const EventBookmarks = () => {
  const [eventBookmarks, setEventBookmarks] = useState([]);
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [editingEventBookmark, setEditingEventBookmark] = useState(null);
  const [updatedEventBookmark, setUpdatedEventBookmark] = useState({ user_id: '', event_id: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchEventBookmarks();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/check_admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to check admin status');
      }
      const data = await response.json();
      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Check admin status error:', error);
      showAlert('Failed to check admin status', 'error');
    }
  };

  const fetchEventBookmarks = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
      const response = await fetch(`${BASE_URL}/eventbookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch event bookmarks');
      }
      const data = await response.json();
      setEventBookmarks(data);
    } catch (error) {
      console.error('Fetch event bookmarks error:', error);
      showAlert('Failed to fetch event bookmarks', 'error');
    }
  };

  const handleCreateEventBookmark = async () => {
    try {
      if (!userId || !eventId) {
        showAlert('Both User ID and Event ID are required', 'error');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/eventbookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, event_id: eventId })
      });
      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          if (responseData.message === 'User not found') {
            showAlert('User not found', 'error');
          } else if (responseData.message === 'Event not found') {
            showAlert('Event not found', 'error');
          } else {
            showAlert('Error creating event bookmark', 'error');
          }
        } else {
          throw new Error('Failed to create event bookmark');
        }
        return;
      }

      setEventBookmarks([...eventBookmarks, responseData.eventbookmark]);
      setUserId('');
      setEventId('');
      showAlert('Event bookmark created successfully', 'success');
    } catch (error) {
      console.error('Create event bookmark error:', error);
      showAlert('Failed to create event bookmark', 'error');
    }
  };

  const handleDeleteEventBookmark = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/eventbookmarks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete event bookmark');
      }
      setEventBookmarks(eventBookmarks.filter(event => event.id !== id));
      showAlert('Event bookmark deleted successfully', 'success');
    } catch (error) {
      console.error('Delete event bookmark error:', error);
      showAlert('Failed to delete event bookmark', 'error');
    }
  };

  const handleUpdateEventBookmark = (eventBookmark) => {
    setEditingEventBookmark(eventBookmark);
    setUpdatedEventBookmark({ user_id: eventBookmark.user_id, event_id: eventBookmark.event_id });
  };

  const handleUpdateSubmit = async (eventBookmarkId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/eventbookmarks/${eventBookmarkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEventBookmark),
      });
      if (!response.ok) {
        throw new Error('Failed to update event bookmark');
      }
      fetchEventBookmarks();
      setEditingEventBookmark(null);
    } catch (error) {
      console.error('Error updating event bookmark:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  return (
    <div>
      {alertMessage && <div className={`alert alert-${alertType}`}>{alertMessage}</div>}
      <h2>Event Bookmarks</h2>
      {isAdmin && (
        <div>
          <h3>Create Event Bookmark</h3>
          <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          <button onClick={handleCreateEventBookmark}>Create</button>
        </div>
      )}
      <div>
        <h3>Event Bookmarks List</h3>
        <ul>
          {eventBookmarks.map(eventBookmark => (
            <li key={eventBookmark.id}>
              {editingEventBookmark && editingEventBookmark.id === eventBookmark.id ? (
                <div>
                  <input
                    type="text"
                    value={updatedEventBookmark.user_id}
                    onChange={(e) => setUpdatedEventBookmark({ ...updatedEventBookmark, user_id: e.target.value })}
                  />
                  <input
                    type="text"
                    value={updatedEventBookmark.event_id}
                    onChange={(e) => setUpdatedEventBookmark({ ...updatedEventBookmark, event_id: e.target.value })}
                  />
                  <button onClick={() => handleUpdateSubmit(eventBookmark.id)}>Save</button>
                  <button onClick={() => setEditingEventBookmark(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  User ID: {eventBookmark.user_id}, Event ID: {eventBookmark.event_id}
                  {isAdmin && (
                    <>
                      <button onClick={() => handleUpdateEventBookmark(eventBookmark)}>Edit</button>
                      <button onClick={() => handleDeleteEventBookmark(eventBookmark.id)}>Delete</button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventBookmarks;
