import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserEnquiryForm = () => {
  const [enquiries, setEnquiries] = useState([]);

  // Fetch all enquiries on mount
  const fetchEnquiries = () => {
    axios.get('http://localhost:8000/enquiries')
      .then(res => setEnquiries(res.data))
      .catch(err => console.error("Failed to fetch enquiries:", err));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault();

    axios.post('http://localhost:8000/insert', {
      name: e.target.name.value,
      email: e.target.email.value,
      phoneNumber: e.target.phone.value,
      message: e.target.message.value
    })
      .then(() => {
        alert("Enquiry Submitted Successfully");
        e.target.reset();
        fetchEnquiries();
      })
      .catch(err => {
        console.error(err);
        alert("Error submitting enquiry. Please try again.");
      });
  }

  // Delete handler
  const handleDelete = async (name) => {
    try {
      await axios.post("http://localhost:8000/delete", { name });
      alert("Enquiry Deleted");
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Update handler
  const handleUpdate = async (entry) => {
    const updatedName = prompt("Enter new name:", entry.name);
    const updatedEmail = prompt("Enter new email:", entry.email);
    const updatedPhone = prompt("Enter new phone number:", entry.phone);
    const updatedMessage = prompt("Enter new message:", entry.message);
  
    if (!updatedName || !updatedEmail || !updatedPhone || !updatedMessage) {
      alert("Update canceled. All fields are required.");
      return;
    }
  
    const updatedEntry = {
      _id: entry._id, // Send the MongoDB _id
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
      message: updatedMessage
    };
  
    try {
      const response = await fetch("http://localhost:8000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entry: updatedEntry }),
      });
  
      if (!response.ok) {
        throw new Error("Update failed.");
      }
  
      alert("Enquiry updated successfully.");
      window.location.reload(); // Refresh to show updates
    } catch (error) {
      console.error(error);
      alert("Something went wrong during update.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">User Enquiry System</h1>
          <p className="text-gray-600">Submit and manage user enquiries efficiently</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Enquiry Form */}
            <div className="md:w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Enquiry Form
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input type="text" id="name" name="name" className="w-full px-4 py-2 border rounded-lg" required />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input type="email" id="email" name="email" className="w-full px-4 py-2 border rounded-lg" required />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                  <input type="tel" id="phone" name="phone" className="w-full px-4 py-2 border rounded-lg" required />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea id="message" name="message" rows="4" className="w-full px-4 py-2 border rounded-lg" required></textarea>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700">
                  Submit Enquiry
                </button>
              </form>
            </div>

            {/* Enquiry List */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Enquiry List
              </h2>

              {enquiries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-2">No enquiries yet. Submit your first enquiry!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SR NO</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">NAME</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">EMAIL</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PHONE</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">MESSAGE</th>
                        <th className="px-16 py-2 text-left text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enquiries.map((entry, index) => (
                        <tr key={entry._id}>
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{entry.name}</td>
                          <td className="px-4 py-2">{entry.email}</td>
                          <td className="px-4 py-2">{entry.phoneNumber}</td>
                          <td className="px-4 py-2">{entry.message}</td>
                          <td className="px-4 py-2 space-x-2">
                          <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(entry.name)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleUpdate(entry)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow"
                          >
                            Update
                          </button>
                        </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 User Enquiry System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default UserEnquiryForm;
