import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './component/Home'
import Signup from './component/Signup'
import Signin from './component/Signin'
import toast, { Toaster } from 'react-hot-toast';
import Courses from './component/Courses'
import Purchases from './component/Purchases'
import Buy from './component/Buy'
import AdminSignup from './admin/AdminSignup'
import AdminSignin from './admin/AdminSignin'
import CourseCreate from './admin/CourseCreate'
import Dashboard from './admin/Dashboard'
import OurCourses from './admin/OurCourses'
import UpdateCourse from './admin/UpdateCourse'
import BlockUser from './admin/BlockUser'
import Unblock from './admin/Unblock'
import Profile from './admin/Profile'
import ProfileUser from './component/ProfileUser'
import ChangePassword from './component/ChangePassword'
import ChangePasswordAdmin from './admin/ChangePasswordAdmin'
import EditProfile from './component/EditProfile'
import EditProfileAdmin from './admin/EditProfileAdmin'
import Certificate from './component/Certificate'
import Assessement from './component/Assessement'
import AssessmentCreation from './admin/AssessmentCreation'


function App() {

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/signin' element={<Signin />}></Route>
        <Route path='/change-password' element={<ChangePassword/>}></Route>
        <Route path='/courses' element={<Courses />}></Route>
        <Route path='/assessment' element={<Assessement/>}></Route>
        <Route path='/profile' element={<ProfileUser/>}></Route>
        <Route path='/profile/edit' element={<EditProfile/>}></Route>
        <Route path='/buy/:courseId' element={<Buy />}></Route>
        <Route path='/purchases' element={user ? <Purchases /> : <Navigate to={'/signin'} />}></Route>
        <Route path='/certificate' element={user ? <Certificate/> : <Navigate to={'/signin'} />}></Route>
        {/* Admin Routes */}
        <Route path='/admin/signup' element={<AdminSignup />}></Route>
        <Route path='/admin/signin' element={<AdminSignin />}></Route>
        <Route path='/admin/change-password' element={<ChangePasswordAdmin />}></Route>
        <Route path='/admin/create-course' element={<CourseCreate />}></Route>
        <Route path='/admin/create-assessment' element={<AssessmentCreation/>}></Route>
        <Route path='/admin/dashboard' element={admin ? <Dashboard /> : <Navigate to={'/admin/signin'} />}></Route>
        <Route path='/admin/our-courses' element={<OurCourses />}></Route>
        <Route path='/admin/update-courses/:id' element={<UpdateCourse></UpdateCourse>}></Route>
        <Route path='/admin/block' element={<BlockUser />}></Route>
        <Route path='/admin/unblock' element={<Unblock />}></Route>
        <Route path='/admin/profile' element={<Profile/>}></Route>
        <Route path='/admin/profile/edit' element={<EditProfileAdmin/>}></Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
