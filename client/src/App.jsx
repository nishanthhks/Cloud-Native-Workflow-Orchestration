import "./App.css";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Layout from "./layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import UserProvider from "./context/userContext";
import ImagePage from "./pages/ImagePage";
import Redirect from "./pages/Redirect";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard/image" element={<ImagePage />} />
          {/* <Route path="/redirect/:shortUrl" element={<Redirect />} />  */}
          <Route path="/:shortUrl" element={<Redirect />} />

          {/* Wrap the dashboard inside Layout correctly */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics/:id" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
