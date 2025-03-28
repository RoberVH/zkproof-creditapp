interface User {
  role: string;
  username: string; // Assuming users have a `username` property
}

// Search for a speciic  user - role and return true/false accordingly
export function existingUser(users: { username: string; role: string }[], user: string, role: string): boolean {
    return users.some(u => u.username === user && u.role === role);
  }  

  export function userByRole(role: string): string[]  {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      return []; // Return empty  if no users are stored
    }
  
    try {
      const users: User[] = JSON.parse(storedUsers);
  
      // Filter users by role and map to their usernames
      const usersWithRole = users
        .filter((u) => u.role === role)
        .map((u) => u.username);
  
      return usersWithRole.length > 0 ? usersWithRole : null; // Return null if no users have the role
    } catch (error) {
      return null; // Return null if parsing fails
    }
  }
  
  function addUser(users: { username: string; role: string }[], user: string, role: string): { username: string; role: string }[] {
    users.push({ username: user, role: role });
    return users;
  }
  

  
  // Main
// Function to add a new user and return a status message
export function addNewUser(user: string, role: string): { status: boolean, msg: string } {
    // Check if users exist in localStorage
    const storedUsers = localStorage.getItem("users");
    let users: { username: string; role: string }[] = [];
  
    if (storedUsers) {
      // Parse stored users into an array
      users = JSON.parse(storedUsers);
  
      // Check if the user already exists
      if (existingUser(users, user, role)) {
        return { status: false, msg: 'user_exists' };
      } else {
        // Add user to the array
        const newUsers = addUser(users, user, role);
        // Save the updated array to localStorage
        localStorage.setItem("users", JSON.stringify(newUsers));
        return { status: true, msg: 'user_added' };
      }
    } else {
      // If no users are stored, create a new array with the user
      const newUsers = [{ username: user, role: role }];
      localStorage.setItem("users", JSON.stringify(newUsers));
      return { status: true, msg: 'user_added' };
    }
  }
  

  