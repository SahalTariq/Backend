
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Sidebar from './layout/Sidebar';
// import VideoFeed from './pages/VideoFeed';
// import UploadVideo from './pages/UploadVideo';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import PrivateRoute from './componnents/PrivateRoute';

// function App() {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to="/" /> : <Login />
//         } />
//         <Route path="/register" element={
//           isAuthenticated ? <Navigate to="/" /> : <Register />
//         } />
        
//         <Route path="/" element={
//           <PrivateRoute>
//             <div className="flex">
//               <Sidebar />
//               <main className="flex-1">
//                 <VideoFeed />
//               </main>
//             </div>
//           </PrivateRoute>
//         } />
        
//         <Route path="/upload" element={
//           <PrivateRoute>
//             <div className="flex">
//               <Sidebar />
//               <main className="flex-1">
//                 <UploadVideo />
//               </main>
//             </div>
//           </PrivateRoute>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./app/store.js"; // make sure path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);