import React from "react";

const UserList = ({
  userList,
  username,
  activeRecipient,
  handleRecipientClick,
}) => {
  // Filter out the current user from the list
  const otherUsers = userList.filter((user) => user.username !== username);

  return (
    <div>
      {otherUsers.map((user, index) => (
        <div
          key={index}
          onClick={() => handleRecipientClick(user.username)}
          style={{
            cursor: "pointer",
            fontWeight: activeRecipient === user.username ? "bold" : "normal",
            padding: "5px",
            width: "96.2%",
            backgroundColor: activeRecipient === user.username && "#d1f1ff",
          }}
        >
          {user.username} {user.online ? "(online)" : "(offline)"}
        </div>
      ))}
    </div>
  );
};

export default UserList;
