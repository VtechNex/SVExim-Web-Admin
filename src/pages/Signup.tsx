import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AUTH } from "@/services/authService";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const response = await AUTH.login(email, password);
      // Handle different response scenarios and show appropriate messages to user
      if (response === -1) {
        console.log("Login failed");
        return;
      } else if (response !== 200) {
        alert("Invalid credentials");
        return;
      }

      // Successful login | response is 200
      navigate("/");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleForgotPassword = () => {
    // navigate to Forgot Password page or show a toast/modal
    navigate("/forgot-password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 px-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-4">
    
          <CardTitle className="text-center text-2xl font-bold text-blue-700">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 focus:ring-blue-500"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-300 focus:ring-blue-500"
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
