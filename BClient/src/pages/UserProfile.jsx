import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserComments, fetchBookDetails } from '../api/data'; // Adjust the import according to your project structure
import { Button } from '@mui/material';

export const UserProfile = () =>
{
    const { state } = useLocation(); // Odbieranie user ze state
    const user = state?.user; // Pobieranie użytkownika
    const [comments, setComments] = useState([]);
    const [bookTitles, setBookTitles] = useState({});
    const navigate = useNavigate();

    useEffect(() =>
    {
        console.log('State:', state); // Add this log
        console.log('User:', user); // Add this log

        if (user?.clientId)
        {
            fetchUserComments(user.clientId, async (comments) =>
            {
                setComments(comments);
                const titles = {};
                for (const comment of comments)
                {
                    const bookDetails = await fetchBookDetails(comment.bookId);
                    if (bookDetails)
                    {
                        titles[comment.bookId] = bookDetails.title;
                    }
                }
                setBookTitles(titles);
            });
        } else
        {
            console.error("User ID is undefined. Please login again.");
        }
    }, [user]);

    const handleBackToStore = () =>
    {
        navigate('/store');
    };

    return (
        <div>
            <h2>Profil użytkownika</h2>
            {user ? (
                <p>Witaj, {user.sub}!</p> // Display sub as username
            ) : (
                <p>Nie znaleziono użytkownika. Proszę zalogować się ponownie.</p>
            )}

            <Button variant="contained" color="primary" onClick={handleBackToStore}>
                Back to Store
            </Button>

            <h3>Moje Komentarze</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <strong>{bookTitles[comment.bookId] || 'Loading...'}</strong>: {comment.commentString} (Ocena: {comment.rating}/5)
                    </li>
                ))}
            </ul>
        </div>
    );
};