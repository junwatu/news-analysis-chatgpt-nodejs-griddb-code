import React, { useState, useEffect } from 'react';

const SERVER_URL = 'http://localhost:4000/multinews';

const News = () => {
  const [randomNews, setRandomNews] = useState({});
  const [showFullNews, setShowFullNews] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    console.log(SERVER_URL);
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      setRandomNews(data);
	  setLoading(false);
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
	  {loading ? (
        <p>Loading news...</p> // Display loading message while loading
      ) : (randomNews.id && (
        <div>
		  <h2>{randomNews.title}</h2>
		  <ul className='px-0 left-0'>
			{randomNews.tags.map((item, index) => (
			<li key={index} className='inline-block bg-blue-500 text-white text-sm px-3 py-1  mr-2 mb-2 rounded' title='generated tag'>
				{item}
			</li>
			))}
          </ul>
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
        </div>))
	  }
    </div>
  );
};

export default News;
