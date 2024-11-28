import React from "react";
import "../assets/css/News.style.css";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NewsComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  const newsList = [
    {
      id: 1,
      title: t("common.newsTitle"),
      date: "23/10/2024",
      description: t("common.newsDescription"),
      image: "https://via.placeholder.com/150", 
    },
    {
      id: 2,
      title: t("common.newsTitle"),
      date: "23/10/2024",
      description: t("common.newsDescription"),
      image: "https://via.placeholder.com/150", 
    },
  ];

  return (
    <div className="news-container">
      <h2 className="news-title">{t("common.newsTitle")}</h2>
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