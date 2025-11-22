import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Pencil, Plus, Trash2, UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import USERS from "@/services/userService";
import { AUTH } from "@/services/authService";

const UsersRoles = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [created, setCreated] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Username Validation
    if (!username || username.trim().length < 3) {
      alert("Username should be at least 3 characters long");
      return;
    }

    // Email Validation (simple but correct)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Password Validation
    if (!password || password.trim().length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // If everything is valid
    console.log("Form is valid, creating user...");
    const response = await USERS.ADD({ name: username, email, password })
    if (response.status !== 201) {
      console.error("Error while creating user: ", response);
      return;
    }

    setCreated(!created)

    // Reset form & close dialog
    setUsername("");
    setEmail("");
    setPassword("");
    setOpenDialog(false);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const user = { name: selectedUser.name, email: selectedUser.email }
    const response = await USERS.UPDATE(selectedUser.id, user);
    if (response.status!==200) {
      // error
      console.log('Error while updating user', response);
      return;
    }
    setOpen(false);
    setSelectedUser(null);
    setCreated(!created)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);     // populate form fields
    setOpen(true);             // open the edit dialog
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const response = await USERS.DELETE(userId);
    if (response.status!==200) {
      // error 
      console.log('Error while deleting user', response);
      return;
    }
    setOpen(false);
    setSelectedUser(null);
    setCreated(!created);
  };



  useEffect(() => {
    const fetchUsers = async () => {
      const user = await AUTH.getUser();
      const response = await USERS.GET();
      if (response.status === 200) {
        const fetchedUsers = response.data?.users?.filter((u) => u.email !== user.email);
        console.log("Fetched users:", fetchedUsers);
        setUsers(fetchedUsers);
      } else {
        console.error("Failed to fetch users:", response);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [created]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Users & Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permission roles.
          </p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-secondary hover:bg-secondary/90">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black rounded-xl max-w-md w-full p-5 max-h-[80vh] overflow-y-auto border border-blue-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-700">
                Add New User
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a new user account with username and password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-base"
              >
                Create User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-black rounded-xl max-w-md w-full p-5 max-h-[80vh] overflow-y-auto border border-blue-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-700">
                Showing User: {selectedUser?.id}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmitEdit} className="space-y-4 mt-3">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={selectedUser?.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="border-gray-300"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter email"
                  value={selectedUser?.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="border-gray-300"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-base"
              >
                Update
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(users.length === 0 && (
        <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users yet. Add your first user to get started.</p>
          </div>
        </CardContent>
      </Card>
      )) || (<Card className="border border-gray-200">
          <CardContent className="p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 text-gray-700 font-semibold">ID</th>
                  <th className="p-3 text-gray-700 font-semibold">Name</th>
                  <th className="p-3 text-gray-700 font-semibold">Email</th>
                  <th className="p-3 text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 text-gray-800">{user.id}</td>
                    <td className="p-3 text-gray-800">{user.name}</td>
                    <td className="p-3 text-gray-800">{user.email}</td>
                    <td className="p-3 flex items-center gap-2">
                      {/* Edit Icon Button */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        className="rounded-full p-2 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete Icon Button */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-full p-2 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersRoles;
