import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import "../assets/css/NotifiButton.style.css";

const NotifiButtonComponent = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await Api({
          endpoint: "loan-service/notification/me?seen=all",
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

  const filteredNotifications = (notifications || []).filter((notification) => {
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
        <div className="notifi-dropdown-menu">
          <div className="notifi-dropdown-header">
            <h3>Thông báo</h3>
            <div className="notifi-mark-buttons">
              <button className="notifi-mark-read" onClick={markAllAsRead}>
                Đánh dấu đã đọc tất cả
              </button>
            </div>
          </div>
          <div className="notifi-filter-buttons">
            <button
              className={`notifi-filter-button ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`notifi-filter-button ${
                filter === "unread" ? "active" : ""
              }`}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc
            </button>
            <button
              className={`notifi-filter-button ${
                filter === "read" ? "active" : ""
              }`}
              onClick={() => setFilter("read")}
            >
              Đã đọc
            </button>
          </div>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`notifi-dropdown-item ${
                  notification.seen ? "read" : "unread"
                }`}
                onClick={() => toggleReadStatus(notification.notificationId)}
              >
                <div className="notifi-notification-icon">
                  <img src={userInfo.avatar} alt="icon" />
                </div>
                <div className="notifi-notification-content">
                  <p className="notifi-notification-title">
                    {notification.titleName}
                  </p>
                  <p className="notifi-notification-details">
                    {notification.content}
                  </p>
                  <p className="notifi-notification-time">
                    {new Date(notification.createAt).toLocaleString()}
                  </p>
                </div>
                {!notification.seen && (
                  <span className="notifi-unread-indicator"></span>
                )}
              </div>
            ))
          ) : (
            <div className="notifi-dropdown-item">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

const NotifiButton = React.memo(NotifiButtonComponent);
export default NotifiButton;