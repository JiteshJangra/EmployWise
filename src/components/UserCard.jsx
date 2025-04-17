import React from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="flex justify-center p-4">
        <img 
          src={user.avatar} 
          alt={`${user.first_name} ${user.last_name}`} 
          className="h-32 w-32 rounded-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{user.first_name} {user.last_name}</h3>
        <p className="text-gray-700 mb-2">{user.email}</p>
        <div className="flex justify-between mt-4">
          <button 
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;