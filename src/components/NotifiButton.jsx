import React, { useState, useEffect } from "react";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import "../assets/css/NotifiButton.style.css";

const NotifiButtonComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await Api({
          endpoint: "http://152.42.232.101:7000/notification/me",
          method: METHOD_TYPE.GET,
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      seen: true,
    }));
    setNotifications(updatedNotifications);
  };

  const toggleReadStatus = (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.notificationId === notificationId
        ? { ...notification, seen: !notification.seen }
        : notification
    );
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.seen;
    if (filter === "read") return notification.seen;
  });

  return (
    <div className="notifi-button-container">
      <button className="notifi-button" onClick={toggleDropdown}>
        <i className="fa-regular fa-bell fa-2xl"></i>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <h3>Thông báo</h3>
            <div className="mark-buttons">
              <button className="mark-read" onClick={markAllAsRead}>
                Đánh dấu đã đọc tất cả
              </button>
            </div>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`filter-button ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc
            </button>
            <button
              className={`filter-button ${filter === "read" ? "active" : ""}`}
              onClick={() => setFilter("read")}
            >
              Đã đọc
            </button>
          </div>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`dropdown-item ${notification.seen ? "read" : "unread"}`}
                onClick={() => toggleReadStatus(notification.notificationId)}
              >
                <div className="notification-icon">
                  <img src="logo-placeholder.png" alt="icon" />
                </div>
                <div className="notification-content">
                  <p className="notification-title">{notification.titleName}</p>
                  <p className="notification-details">{notification.content}</p>
                  <p className="notification-time">
                    {new Date(notification.createAt).toLocaleString()}
                  </p>
                </div>
                {!notification.seen && <span className="unread-indicator"></span>}
              </div>
            ))
          ) : (
            <div className="dropdown-item">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

const NotifiButton = React.memo(NotifiButtonComponent);
export default NotifiButton;
