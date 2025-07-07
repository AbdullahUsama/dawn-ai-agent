# News AI Assistant (DAWN - Op&Ed, The Tribune, ParadigmShift - National & IR) | Website: [link](https://dawn-ai-frontend.vercel.app/)


## Overview

The Pakistan News AI Assistant is an intelligent agent designed to help students and users understand editorial and opinion articles from DAWN (Editorial & Op-Ed), The Tribune (Editorial), and ParadigmShift (National & International Relations) newspapers. It provides various functionalities, including getting all the articles related to a certain topic, scraping articles, extracting key information like URLs, and offering educational insights such as vocabulary words and idioms from the content. It is especially for CSS/PMS aspirants who must have good vocab, current affairs, and general knowledge, for which editorials and analyses from these Pakistani newspapers are highly beneficial.

This project consists of a backend API built with FastAPI and LangChain, deployed on Render, and a frontend developed with Next.js, deployed on Vercel.

## Features

-   **Getting Topic-Related Articles:** If you want to have articles on a certain topic with certain date range, you can get it!
-   **Article Scraping:** Fetches editorial articles from DAWN newspaper for specified dates or date ranges.
    
-   **Content Extraction:** Extracts article titles, full content, and URLs.
    
-   **Intelligent AI Agent:** Powered by LangChain and Google's Gemini 2.0 Flash model to understand natural language queries.
    
-   **Educational Support:**
    
    -   **Vocabulary:** Automatically identifies and lists good vocabulary words from articles with concise meanings.
        
    -   **Phrases & Idioms:** Extracts common phrases and idioms from articles with their meanings.
        
    -   _(Note: Vocabulary and idiom lists are provided by default when only dates are queried. If a specific request like "summarize" or "get URLs" is made, only that specific request is fulfilled.)_
        
-   **Flexible Date Handling:** Supports relative date inputs (e.g., "today", "yesterday", "last week") and converts them to `YYYY-MM-DD` format for scraping.

    

## Technologies Used

### Backend

-   **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
    
-   **LangChain:** A framework for developing applications powered by language models.
    
-   **Google Generative AI (Gemini 2.0 Flash):** The large language model used by the AI agent for natural language understanding and generation.
    

    

### Frontend

-   **Next.js:** A React framework for building server-side rendered (SSR) and static web applications.
    

### Deployment

-   **Render:** Cloud platform for deploying web services (used for backend).
    
-   **Vercel:** Platform for frontend deployments (used for Next.js app).
    

## Setup and Installation

### Backend (Python)

1.  **Clone the repository:**
    
    ```
    git clone https://github.com/your-username/dawn-ai-agent-backend.git
    cd dawn-ai-agent-backend
    
    
    ```
    
2.  **Create a virtual environment (recommended):**
    
    ```
    python -m venv venv
    source venv/bin/activate  # On Windows: `venv\Scripts\activate`
    
    
    ```
    
3.  **Install dependencies:**
    
    ```
    pip install -r requirements.txt
    
    
    ```
    
    (You'll need to create a `requirements.txt` file if you don't have one. It should contain: `fastapi`, `uvicorn`, `langchain-google-genai`, `beautifulsoup4`, `requests`, `pydantic`, `python-dotenv` (optional for local .env files))
    
4.  **Set your Google API Key:** The LangChain agent requires a Google API Key for the Gemini model. It is highly recommended to set this as an environment variable:
    
    ```
    export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
    
    
    ```
    
    For local development, you might use a `.env` file and `python-dotenv` for convenience, but for deployment, use your hosting provider's environment variable management.
    
5.  **Run the backend locally:**
    
    ```
    uvicorn main:app --reload
    
    
    ```
    
    The API will be accessible at `http://127.0.0.1:8000`.
    

### Frontend (Next.js)

1.  **Clone the frontend repository:**
    
    ```
    git clone https://github.com/your-username/dawn-ai-frontend.git
    cd dawn-ai-frontend
    
    
    ```
    
2.  **Install Node.js dependencies:**
    
    ```
    npm install
    # or
    yarn install
    
    
    ```
    
3.  **Configure API Endpoint:** You will need to configure the frontend to point to your deployed backend API URL (e.g., your Render URL). This is typically done via environment variables in Next.js (e.g., in a `.env.local` file or `next.config.js`).
    
4.  **Run the frontend locally:**
    
    ```
    npm run dev
    # or
    yarn dev
    
    
    ```
    
    The frontend application will be accessible at `http://localhost:3000`.
    

## API Endpoints

The backend API exposes the following endpoints:

### `GET /`

-   **Description:** A simple health check endpoint that returns a welcome message.
    
-   **Response:**
    
    ```
    {
      "message": "Welcome to the Dawn News Scraper Agent API. Use the /invoke endpoint to interact with the agent."
    }
    
    
    ```
    

### `POST /invoke`

-   **Description:** The primary endpoint for interacting with the AI agent. Send your natural language queries here.
    
-   **Request Body:**
    
    ```
    {
      "query": "string"
    }
    
    
    ```
    
    -   `query`: The natural language prompt for the AI agent (e.g., "articles for today", "summarize articles from yesterday", "get URLs for articles from 2025-06-20").
        
-   **Response (JSON):**
    
    ```
    {
      "response": "string",
      "articles": [
        {
          "title": "string",
          "content": "string",
          "url": "string"
        }
      ]
    }
    
    
    ```
    
    -   `response`: The AI agent's textual response to your query.
        
    -   `articles`: An optional list of scraped article dictionaries. This will be populated if the query results in article scraping (e.g., when asking for articles by date without specific output instructions like "summarize"). Each article object includes `title`, `content`, and `url`.
        

## Usage Examples

Here are some examples of queries you can send to the `/invoke` endpoint:

1.  **Get today's editorial articles with vocabulary and idioms:**
    
    -   **Query:**  `"Show me the editorial articles for today."`
        
    -   **Expected Response:** A general message indicating articles were scraped, and the `articles` field will contain the scraped data. The `response` field will also contain the vocabulary words and phrases/idioms lists.
        
2.  **Get articles from a specific date range with vocabulary and idioms:**
    
    -   **Query:**  `"Articles from 2025-06-15 to 2025-06-17."`
        
    -   **Expected Response:** Similar to the above, articles will be in the `articles` field, and vocabulary/idioms in the `response` field.
        
3.  **Summarize articles from a specific date:**
    
    -   **Query:**  `"Summarize the editorial articles from yesterday."`
        
    -   **Expected Response:** The `response` field will contain summaries of the articles. The `articles` field will likely be `null` as the direct articles themselves weren't the requested output.
        
4.  **Get URLs for articles:**
    
    -   **Query:**  `"Just give me the URLs for the editorial articles on June 10th, 2025."`
        
    -   **Expected Response:** The `response` field will contain the list of URLs. The `articles` field will likely be `null`.
        
5.  **Query outside the scope:**
    
    -   **Query:**  `"What is the capital of France?"`
        
    -   **Expected Response:**  `"I can only assist with news-related queries from the Dawn newspaper."`
        

Feel free to contribute, open issues, or suggest improvements!
