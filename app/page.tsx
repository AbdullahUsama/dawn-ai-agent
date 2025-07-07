"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Trash2, Newspaper } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, BookText } from "lucide-react";
import dawnImg from '../public/dawn.png'
import tribuneImg from '../public/tribuneImg.png'
import PSImg from '../public/PSImg.png'


// Import a markdown renderer if you want to properly display links and formatting
// You'll need to install it: npm install react-markdown remark-gfm
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (links, lists, etc.)

// Corrected API Response Interface
interface Article {
  title: string;
  url: string;
  // Add other fields if your API can return them and you want to display them
  // e.g., content?: string;
  // date?: string;
}

interface ApiResponse {
  response: string; // The main text response from the AI
  articles: Article[] | null; // An array of articles or null
}

interface QueryResult {
  query: string;
  responseText: string; // Storing the main response text
  articles: Article[] | null; // Storing the parsed articles
  timestamp: Date;
}

export default function DawnNewsAI() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous results when new query is submitted

    try {
      const API_URL = process.env.NEXT_PUBLIC_RENDER_API_URL || "https://dawn-news-ai-agent.onrender.com/invoke";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(), // Ensure the backend expects 'query' not 'input'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // The API response for errors is not in the "error" field in your example
      // It will likely throw !response.ok or be part of the 'response' text itself.
      // If your API *can* return a specific 'error' field, you'd add this logic:
      // if (data.error) {
      //   throw new Error(data.error);
      // }

      setResult({
        query: query.trim(),
        responseText: data.response || "No response received", // Access 'response'
        articles: data.articles, // Store the articles array (can be null)
        timestamp: new Date(),
      });
      setQuery(""); // Clear input after successful submission

    } catch (err) {
      console.error("API Error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to the AI assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-800">News AI Assistant</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ask questions about Dawn Editorials & Opinions, Tribune, ParadigmShift newspapers editorials using natural language. Get summaries, URLs, headlines, and
            analysis from the editorial section.
          </p>
          {/* <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-left">
            <h3 className="font-semibold text-base mb-2">How to use me:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>**Scrape Articles by Date:** `articles from today`, `news from yesterday`, `get articles from 2025-06-15`, `find news between 2025-06-10 and 2025-06-12`.</li>
              <li>**Specific Information Requests:** `Summarize the articles from today.`, `Give me the URLs of articles from yesterday.`, `What are the main topics discussed in the news from June 18th?`</li>
              <li>**Vocabulary/Phrases (Default):** If you *only* provide dates (e.g., "articles from today"), I will automatically provide vocabulary words and phrases from the articles.</li>
              <li>**Important:** I only process queries related to **Dawn newspaper editorial articles**.</li>
            </ul>
          </div> */}
           <div className="mt-4 flex flex-row gap-4 justify-center flex-wrap">
            {/* 1. Scrape Articles by Date */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm min-w-[220px] w-full sm:w-auto">
              <BookText className="h-7 w-7 text-slate-700" />
              <div>
                <span className="font-semibold text-slate-800 text-sm block">By Date</span>
                <span className="text-slate-600 text-xs">e.g. <span className="font-mono bg-slate-100 px-1 rounded">articles from today</span></span>
              </div>
            </div>
            {/* 2. Specific Information Requests */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm min-w-[220px] w-full sm:w-auto">
              <Send className="h-7 w-7 text-blue-600" />
              <div>
                <span className="font-semibold text-slate-800 text-sm block">Topic Related Articles</span>
                <span className="text-slate-600 text-xs">e.g. <span className="font-mono bg-slate-100 px-1 rounded">Find articles by topic</span></span>
              </div>
            </div>
            {/* 3. Vocabulary/Phrases */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm min-w-[220px] w-full sm:w-auto">
              <Lightbulb className="h-7 w-7 text-green-600" />
              <div>
                <span className="font-semibold text-slate-800 text-sm block">Vocabulary</span>
                <span className="text-slate-600 text-xs">e.g. <span className="font-mono bg-slate-100 px-1 rounded">Get vocab, idioms & phrases </span></span>
              </div>
            </div>
          </div>
          </div>

        {/* Newspaper Logos Section - Rounded Rectangles */}
        <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
          {/* Dawn Logo */}
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center border border-slate-200">
            <img src={dawnImg.src} alt="Dawn Newspaper Logo" className="h-7 sm:h-9 object-contain" />
          </div>

          {/* The News Logo */}
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center border border-slate-200">
            <img src={tribuneImg.src} alt="The News Newspaper Logo" className="h-7 sm:h-9 object-contain" />
          </div>

          {/* Business Recorder Logo */}
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center border border-slate-200">
            <img src={PSImg.src} alt="Business Recorder Newspaper Logo" className="h-7 sm:h-9 object-contain" />
          </div>
        </div>

        {/* Input Section */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700">Ask Your Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Give me articles about the economy from last week"
                  className="flex-1 text-base py-3 px-4 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="px-6 bg-slate-700 hover:bg-slate-800 text-white"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {(result || error) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="w-full sm:w-auto bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Results
                </Button>
              )}
            </form>
          </CardContent>
        </Card>



        {/* Loading State */}
        {isLoading && (
          <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-3 text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Searching News Resources ... </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
                {result && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <CardTitle className="text-lg font-semibold text-slate-700 mb-2">Your Query</CardTitle>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border break-words">{result.query}</p>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">{result.timestamp.toLocaleString()}</div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">AI Assistant Response</h3>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-96 border">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {result.responseText}
                </ReactMarkdown>
              </div>
              {result.articles && result.articles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Scraped Articles:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {result.articles.map((article, index) => (
                      <li key={index} className="break-words">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {article.title || article.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Example Queries */}
        {!result && !isLoading && !error && (
          <Card className="mt-6 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-700">Example Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Give me articles from last week from Dawn Opinions",
                  "Get Tribune news URLs from last 3 days",
                  "I want International Relation Articles from paradigmShift",
                  "Give articles URLs related to economy in last 5 days",
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-sm text-slate-700 w-full"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
