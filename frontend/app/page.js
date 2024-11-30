"use client";

 import { gql, useQuery, useMutation } from "@apollo/client";
 import { useState } from "react";

 const ALL_USERS = gql`
 query {
 allUsers {
     id
     firstName
     lastName
     fullName
     }
 }`;

 const CREATE_USER = gql`
 mutation CreateUser($firstName: String!, $lastName: String!) {
     createUser(firstName: $firstName, lastName: $lastName) {
     id
     firstName
     lastName
     fullName
     }
 }`;

 export default function Page() {
     const { loading, error, data, refetch } = useQuery(ALL_USERS);
     const [createUser] = useMutation(CREATE_USER);

     const [formData, setFormData] = useState({
         firstName: "",
         lastName: "",
     });

     const handleInputChange = (e) => {
         const { name, value } = e.target;
         setFormData((prev) => ({
         ...prev,
         [name]: value,
         }));
     };

     const handleSubmit = async (e) => {
         e.preventDefault();
         try {
         await createUser({
             variables: {
             firstName: formData.firstName,
             lastName: formData.lastName,
             },
         });
         setFormData({ firstName: "", lastName: "" }); // Clear the form
         refetch(); // Refresh the list of users
         } catch (err) {
         console.error("Error creating user:", err);
         }
     };

     if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
     if (error)
         return (
         <p style={{ textAlign: "center", color: "red" }}>
             Error: {error.message}
         </p>
         );

     return (
         <div
         style={{
             maxWidth: "600px",
             margin: "20px auto",
             fontFamily: "Arial, sans-serif",
         }}
         >
         <h1 style={{ textAlign: "center" }}>Users</h1>
         <ul style={{ listStyleType: "none", padding: 0 }}>
             {data.allUsers.map((user) => (
             <li
                 key={user.id}
                 style={{
                 padding: "10px",
                 border: "1px solid #ddd",
                 borderRadius: "5px",
                 marginBottom: "10px",
                 }}
             >
                 {user.fullName}
             </li>
             ))}
         </ul>
         <h2 style={{ textAlign: "center" }}>Create a New User</h2>
         <form
             onSubmit={handleSubmit}
             style={{
             display: "flex",
             flexDirection: "column",
             gap: "10px",
             padding: "20px",
             border: "1px solid #ddd",
             borderRadius: "5px",
             background: "#f9f9f9",
             }}
         >
             <div>
             <label style={{ display: "block", marginBottom: "5px" }}>
                 First Name:
                 <input
                 type="text"
                 name="firstName"
                 value={formData.firstName}
                 onChange={handleInputChange}
                 required
                 style={{
                     width: "100%",
                     padding: "8px",
                     border: "1px solid #ddd",
                     borderRadius: "5px",
                     marginTop: "5px",
                 }}
                 />
             </label>
             </div>
             <div>
             <label style={{ display: "block", marginBottom: "5px" }}>
                 Last Name:
                 <input
                 type="text"
                 name="lastName"
                 value={formData.lastName}
                 onChange={handleInputChange}
                 required
                 style={{
                     width: "100%",
                     padding: "8px",
                     border: "1px solid #ddd",
                     borderRadius: "5px",
                     marginTop: "5px",
                 }}
                 />
             </label>
             </div>
             <button
             type="submit"
             style={{
                 padding: "10px",
                 backgroundColor: "#007BFF",
                 color: "white",
                 border: "none",
                 borderRadius: "5px",
                 cursor: "pointer",
                 fontWeight: "bold",
             }}
             >
             Add User
             </button>
         </form>
         </div>
     );
 }