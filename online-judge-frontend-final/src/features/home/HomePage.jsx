// src/features/home/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-6">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Welcome to <span className="text-primary">OnlineJudge</span>
        </h1>

        <div className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto h-16">
          <TypeAnimation
            sequence={[
              'Practice coding, solve challenges, and get instant feedback.',
              2000,
              'Sharpen your logical reasoning skills.',
              2000,
              'Improve your math and algorithmic thinking.',
              2000,
              'Build a stronger resume with coding practice.',
              2000,
              'Prepare for coding interviews and contests.',
              2000,
              '',
            ]}
            speed={60}
            deletionSpeed={40}
            wrapper="span"
            repeat={Infinity}
            cursor={true}
            className="inline-block"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary text-white rounded-md text-lg font-semibold hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-primary text-primary rounded-md text-lg font-semibold hover:bg-primary/10 transition"
          >
            Already have an account?
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Why Choose OnlineJudge?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: '👨‍💻 Real-Time Code Evaluation',
              desc: 'Submit your code and get verdicts instantly with detailed output comparisons.',
            },
            {
              title: '🧠 Curated Challenges',
              desc: 'Solve problems of varying difficulty to sharpen your data structures and algorithms skills.',
            },
            {
              title: '📈 Track Progress',
              desc: 'Monitor your submissions, see accepted solutions, and improve over time.',
            },
            {
              title: '🚀 Beginner Friendly',
              desc: 'Simple UI with built-in code editor. No setup needed — just start coding.',
            },
            {
              title: '🌐 Language Support',
              desc: 'Write code in C++, Python, JavaScript, Java, and more. Easily switch between languages.',
            },
            {
              title: '🎯 Join the Community',
              desc: 'Compete, collaborate, and learn with a global network of developers.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-24 text-center bg-primary/5 py-10 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Ready to start coding?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create an account and start solving problems now. It’s free and always will be.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-primary text-white rounded-md text-lg font-semibold hover:bg-primary/90 transition"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
