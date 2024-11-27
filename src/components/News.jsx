import React from "react";
import "../assets/css/News.style.css";

const NewsComponent = () => {
  const newsList = [
    {
      id: 1,
      title: "Tiêu đề tin tức Lorem ipsum dolor sit ame....",
      date: "23/10/2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim elementum consectetur...",
      image: "https://via.placeholder.com/150", // Replace with real image URL
    },
    {
      id: 2,
      title: "Tiêu đề tin tức Lorem ipsum dolor sit ame....",
      date: "23/10/2024",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim elementum consectetur...",
      image: "https://via.placeholder.com/150", // Replace with real image URL
    },
  ];

  return (
    <div className="news-container">
      <h2 className="news-title">Tin tức mới</h2>
      <div className="news-list">
        {newsList.map((news) => (
          <div key={news.id} className="news-item">
            <img src={news.image} alt={news.title} className="news-image" />
            <div className="news-content">
              <h3 className="news-item-title">{news.title}</h3>
              <p className="news-date">{news.date}</p>
              <p className="news-description">{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const News = React.memo(NewsComponent);
export default News;
