import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import problemService from '@/services/problemService';
import { useAuth } from '@/context/AuthContext';
import { tagOptions, getTagColorClass } from '@/constants/tags';
import Select from 'react-select';

const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold';
    case 'MEDIUM':
      return 'bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold';
    case 'HARD':
      return 'bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold';
    default:
      return 'bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-semibold';
  }
};

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectionMode, setSelectionMode] = useState(false); // new state

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedTags.length > 0) {
        params.tags = selectedTags.map(tag => tag.value);
      }

      if (selectedDifficulty) {
        params.difficulty = selectedDifficulty;
      }

      if (sortBy) {
        params.sortBy = sortBy;
        params.order = order;
      }

      if (searchTitle.trim()) {
        params.search = searchTitle.trim();
      }

      const data = await problemService.getAllProblems(params);
      setProblems(data);
    } catch (err) {
      console.error('Error loading problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedTags, selectedDifficulty, sortBy, order, searchTitle]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete selected problems?')) return;
    try {
      for (const id of selectedIds) {
        await problemService.deleteProblem(id);
      }
      setSelectedIds([]);
      setSelectionMode(false);
      fetchProblems();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSelectMode = () => {
    setSelectionMode(true);
  };

  const handleCancel = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Problems</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="border rounded px-3 py-1"
          />

          <Select
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Filter by tags"
            className="min-w-[250px]"
          />

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">Sort By</option>
            <option value="difficulty">Difficulty</option>
            <option value="title">Title</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          {isAdmin && !selectionMode && (
            <button
              onClick={handleSelectMode}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Select
            </button>
          )}

          {isAdmin && selectionMode && (
            <>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag.value}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getTagColorClass(tag.value)}`}
              >
                {tag.label}
                <button
                  className="ml-1 text-lg leading-none"
                  onClick={() =>
                    setSelectedTags(prev => prev.filter(t => t.value !== tag.value))
                  }
                >
                  ✖
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p>Loading problems...</p>
        ) : problems.length === 0 ? (
          <p>No problems found.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                {isAdmin && selectionMode && <th className="p-3">Select</th>}
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Tags</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-900">
                  {isAdmin && selectionMode && (
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(problem.id)}
                        onChange={() => toggleSelect(problem.id)}
                      />
                    </td>
                  )}
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:underline">
                      {problem.name}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className={getDifficultyBadgeClass(problem.difficulty)}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tag.toLowerCase())}`}
                        >
                          {tag}
                        </span>
                      )) || '—'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ProblemsPage;
