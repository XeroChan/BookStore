import { jwtDecode } from "jwt-decode";

export async function fetchClientById(clientId, setClient) {
  try {
    const response = await fetch(`http://localhost:5088/clients/${clientId}`);
    if (response.ok) {
      const clientData = await response.json();
      setClient(clientData);
    } else {
      console.error(
        `Error fetching client with ID ${clientId}:`,
        response.statusText
      );
    }
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
  }
}

export async function fetchBooks(setBooks) {
  try {
    const response = await fetch("http://localhost:5088/books");
    if (response.ok) {
      const data = await response.json();
      setBooks(data);
    } else {
      console.error("Error fetching books:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

export const fetchBookDetails = async (bookId) => {
  try {
    const response = await fetch(`http://localhost:5088/books/${bookId}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(
        `Failed to fetch book details for book ID ${bookId}: ${response.status}`
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};

export async function fetchClients(setClients) {
  try {
    const response = await fetch("http://localhost:5088/clients");
    if (response.ok) {
      const data = await response.json();
      setClients(data);
    } else {
      console.error("Error fetching clients:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
}

export const fetchNewPublicationsForSubscribedAuthors = async (credentialId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/subscriptions/credential/${credentialId}/newPublications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
        mode: "cors",
        credentials: "include",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch new publications: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching new publications:", error);
    return [];
  }
};

export const fetchCredentialIdByClientId = async (clientId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/credentials/client/${clientId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
        mode: "cors",
        credentials: "include",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch credential ID: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching credential ID:", error);
    return null;
  }
};

export const fetchCredentialByClientId = async (clientId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/credentials/client/${clientId}/comp`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
        mode: "cors",
        credentials: "include",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Failed to fetch credential: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching credential:", error);
    return null;
  }
};

export async function fetchRentals(setRentals) {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch("http://localhost:5088/rentals", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
        mode: "cors",
        credentials: "include",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setRentals(data);
    } else {
      console.error("Error fetching rentals:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching rentals:", error);
  }
}
export function getUserInfo(setUser) {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}

export const fetchSubscribedBooks = async (setBooks) => {
  try {
    const response = await fetch("http://localhost:5088/api/subscribed-books");
    if (response.ok) {
      const data = await response.json();
      setBooks(data);
    }
  } catch (error) {
    console.error("Error fetching subscribed books:", error);
  }
};

export const fetchUserComments = async (userId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/comments/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch comments for user ${userId}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return [];
  }
};

export const fetchBookReviews = async (bookId) => {
  try {
    const response = await fetch(
      `http://localhost:5088/comments/book/${bookId}`
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error(
        `Failed to fetch reviews for book ID ${bookId}: ${response.status}`
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    return [];
  }
};

export async function postBook(bookDetails) {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch("http://localhost:5088/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify(bookDetails),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create book: ${response.statusText}, ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
}

export const updateComment = async (commentId, commentString, rating) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify({
        CommentString: commentString,
        Rating: rating,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

export const postComment = async (userId, bookId, commentString, rating) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify({
        CredentialId: userId,
        BookId: bookId,
        CommentString: commentString,
        Rating: rating,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(
      `http://localhost:5088/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

export const fetchAuthors = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/authors`, {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
};

export const subscribeToAuthor = async (credentialId, authorId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`http://localhost:5088/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify({ CredentialId: credentialId, AuthorId: authorId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe to author: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error subscribing to author:", error);
  }
};
export const unsubscribeFromAuthor = async (subscriptionId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to unsubscribe: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error unsubscribing:", error);
  }
};
export const fetchSubscriptionsForUser = async (credentialId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(
      `http://localhost:5088/subscriptions/credential/${credentialId}`,
      {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
};
export const fetchAuthorById = async (authorId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(
      `http://localhost:5088/authors/${authorId}`,
      {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      }
    );
    if (response.ok) {
      const author = await response.json();
      return {
        name: author.name,
        surname: author.surname,
      };
    } else {
      throw new Error(`Failed to fetch author: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
};

export const fetchAllCommentsWithUsernames = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/comments/withUsernames`,
      {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch comments: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export async function fetchClientDescription(clientId) {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/clients/${clientId}/description`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch client description: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching client description:", error);
    return null;
  }
}

export async function updateClientDescription(clientId, description) {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/clients/${clientId}/description`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update client description: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating client description:", error);
  }
}

export const fetchUsersWithAuthorFlag = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/credentials/withAuthorFlag`, {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const addAuthors = async (userIds) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await fetch(`http://localhost:5088/authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace(/"/g, "")}`,
      },
      body: JSON.stringify({ userIds }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add authors: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error adding authors:", error);
  }
};