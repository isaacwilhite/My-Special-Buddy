import { Routes, Route } from "react-router-dom";
import Home from "./Home"
import UserLogin from "./UserLogin"
import UserSignup from "./UserSignup"
import VolunteerHome from "./VolunteerHome"
import VolunteerLogin from "./VolunteerLogin"
import UserHome from "./UserHome"
import VolunteerSignup from "./VolunteerSignup"
import MeetVolunteers from "./MeetVolunteers"
import CreateEvents from "./CreateEvents"
import MyEvents from "./MyEvents"
import UserProfileEdit from "./UserProfileEdit"
import Error from "./Error"
import ChatComponent from "./ChatComponent"
import ChatRoom from "./ChatRoom"
import VolunteerProfileEdit from "./VolunteerProfileEdit"
import ProtectedRoute from './ProtectedRoute';


function AppRouter() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user_login" element={<UserLogin />} />
        <Route path="/user_signup" element={<UserSignup />} />
        <Route path="/volunteer_login" element={<VolunteerLogin />} />
        <Route path="/volunteer_signup" element={<VolunteerSignup />} />
        <Route 
          path="/user_home" 
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          } 
        />
        <Route path="/volunteer_home" element={<ProtectedRoute><VolunteerHome /></ProtectedRoute>} />
        <Route path="/meet_volunteers" element={<ProtectedRoute><MeetVolunteers /></ProtectedRoute>} />
        <Route path="/create_event" element={<ProtectedRoute><CreateEvents /></ProtectedRoute>} />
        <Route path="/my_events" element= {<ProtectedRoute><MyEvents/></ProtectedRoute>} />
        <Route path="/user_edit_profile" element={<ProtectedRoute><UserProfileEdit /></ProtectedRoute>} />
        <Route path="/volunteer_edit_profile" element={<ProtectedRoute><VolunteerProfileEdit /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><ChatComponent /></ProtectedRoute>} />
        <Route path="/chat/:chatRoomId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/:error" element={<Error />} />
      </Routes>
    )
  }
  
  export default AppRouter;