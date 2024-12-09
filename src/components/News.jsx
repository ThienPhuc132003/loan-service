import React, { useState, useEffect } from "react";
import "../assets/css/News.style.css";
import { useTranslation } from "react-i18next";

const NewsComponent = () => {
  const { t } = useTranslation();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [newsPerPage, setNewsPerPage] = useState(2); 

  const newsList = [
    {
      id: 1,
      title: t("common.newsTitle1", "News Title 1"),
      date: "23/10/2024",
      description: t("common.newsDescription1", "Description of news 1"),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: t("common.newsTitle2", "News Title 2"),
      date: "29/02/2024",
      description: t("common.newsDescription2", "Description of news 2"),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: t("common.newsTitle3", "News Title 3"),
      date: "01/03/2024",
      description: t("common.newsDescription3", "Description of news 3"),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: t("common.newsTitle4", "News Title 4"),
      date: "02/03/2024",
      description: t("common.newsDescription4", "Description of news 4"),
      image: "https://via.placeholder.com/150",
    },
  ];

  useEffect(() => {
    // Cập nhật số lượng tin dựa trên kích thước màn hình
    const updateNewsPerPage = () => {
      if (window.innerWidth <= 769) {
        setNewsPerPage(1); 
      } else {
        setNewsPerPage(2); 
      }
    };

    updateNewsPerPage(); // Gọi hàm lần đầu
    window.addEventListener("resize", updateNewsPerPage); // Lắng nghe sự kiện resize

    return () => window.removeEventListener("resize", updateNewsPerPage);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNewsIndex((prevIndex) =>
        (prevIndex + newsPerPage) % newsList.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [newsPerPage, newsList.length]);

  return (
    <div className="news-container">
      <h2 className="news-title">{t("common.newsTitle", "Latest News")}</h2>
      <div className="news-list">
        {newsList.map((news, index) => {
          const isVisible =
            index >= currentNewsIndex &&
            index < currentNewsIndex + newsPerPage;

          return (
            <div
              key={news.id}
              className={`news-item ${isVisible ? "visible" : "hidden"}`}
              style={{
                top: `${(index - currentNewsIndex) * 50}%`, // Điều chỉnh khoảng cách giữa các tin
              }}
            >
              <img src={news.image} alt={news.title} className="news-image" />
              <div className="news-content">
                <h3 className="news-item-title">{news.title}</h3>
                <p className="news-date">{news.date}</p>
                <p className="news-description">{news.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const News = React.memo(NewsComponent);
export default News;
