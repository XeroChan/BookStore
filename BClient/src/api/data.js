import { jwtDecode } from "jwt-decode";

export async function fetchClientById(clientId, setClient) {
  try {
    const response = await fetch(`http://localhost:5088/clients/${clientId}`);
    if (response.ok) {
      const clientData = await response.json();
      // Update the state
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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

export async function fetchRentals(setRentals) {
  try {
    const token = localStorage.getItem("authToken");
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
  const token = localStorage.getItem("authToken");
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

export const fetchUserComments = async (userId, setComments) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `http://localhost:5088/comments/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
          mode: "cors",
          credentials: "include",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setComments(data);
    } else {
      console.error(
        `Failed to fetch comments for user ${userId}: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching user comments:", error);
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
export const postComment = async (userId, bookId, commentString, rating) => {
  try {
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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
    const token = localStorage.getItem("authToken");
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

