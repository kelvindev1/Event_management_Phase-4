import React, { useState, useEffect } from 'react';

function EventBookmark() {
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5555/eventbookmarks')
            .then(response => response.json())
            .then(data => {
                setBookmarkedEvents(data);
            })
            .catch(error => {
                console.error('Error fetching bookmarked events:', error);
            });
    }, []);

    return (
        <div>
            <h2>Bookmarked Events</h2>
            <ul>
                {bookmarkedEvents.map(bookmark => (
                    <li key={bookmark.id}>
                        {bookmark.event.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EventBookmark;
