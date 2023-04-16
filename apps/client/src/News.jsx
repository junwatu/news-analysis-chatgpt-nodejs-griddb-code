import React, { useState, useEffect } from 'react';

const SERVER_URL = 'http://localhost:4000/multinews';

const News = () => {
  const [randomNews, setRandomNews] = useState({});
  const [showFullNews, setShowFullNews] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    console.log(SERVER_URL);
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      setRandomNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const toggleFullNews = () => {
    setShowFullNews(!showFullNews);
  };

  return (
    <div className="prose lg:prose-xl text-left">
      <h1 className="prose prose-headings:underline text-left py-0">News</h1>
      {randomNews.id && (
        <div>
          <article className='text-left pb-5'>
            {showFullNews
              ? randomNews.news
              : `${randomNews.news.substring(0, 500)}...`}
          </article>
          <button
            onClick={toggleFullNews}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showFullNews ? "Read Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default News;
