import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import problemService from '@/services/problemService';
import { toast } from 'react-toastify';
import { tagOptions } from '@/constants/tags';

const CreateProblemPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    author: '',
    difficulty: 'EASY',
    statement: '',
    explanation: '',
    sampleTestcases: [{ input: '', output: '' }],
    systemTestcases: [{ input: '', output: '' }],
    time: 1.0,
    memory: 256,
  });
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestcaseChange = (type, index, field, value) => {
    setForm((prev) => {
      const updated = [...prev[type]];
      updated[index][field] = value;
      return { ...prev, [type]: updated };
    });
  };

  const addTestcase = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { input: '', output: '' }],
    }));
  };

  const removeTestcase = (type, index) => {
    setForm((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: selectedTags.map((tag) => tag.value),
      countAC: 0,
      countTotal: 0,
    };
    try {
      await problemService.createProblem(payload);
      toast.success('Problem created successfully!');
      navigate('/admin/problems');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create problem');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-semibold">Create New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title & Author */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Problem Title"
            className="input"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="author"
            type="text"
            placeholder="Author"
            className="input"
            value={form.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* Difficulty, Time, Memory */}
        <div className="grid grid-cols-3 gap-4">
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="input"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <input
            name="time"
            type="number"
            step="0.1"
            placeholder="Time Limit (sec)"
            className="input"
            value={form.time}
            onChange={handleChange}
            required
          />
          <input
            name="memory"
            type="number"
            placeholder="Memory Limit (MB)"
            className="input"
            value={form.memory}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tag Selector */}
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <Select
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Select tags"
            className="react-select-container"
          />
        </div>

        {/* Statement & Explanation */}
        <textarea
          name="statement"
          placeholder="Problem Statement"
          rows={5}
          className="input"
          value={form.statement}
          onChange={handleChange}
          required
        />
        <textarea
          name="explanation"
          placeholder="Explanation / Editorial"
          rows={4}
          className="input"
          value={form.explanation}
          onChange={handleChange}
        />

        {/* Sample Testcases */}
        <div>
          <h3 className="font-semibold text-lg">Sample Testcases</h3>
          {form.sampleTestcases.map((tc, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <textarea
                placeholder="Input"
                rows={2}
                className="input"
                value={tc.input}
                onChange={(e) =>
                  handleTestcaseChange('sampleTestcases', idx, 'input', e.target.value)
                }
              />
              <textarea
                placeholder="Expected Output"
                rows={2}
                className="input"
                value={tc.output}
                onChange={(e) =>
                  handleTestcaseChange('sampleTestcases', idx, 'output', e.target.value)
                }
              />
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => removeTestcase('sampleTestcases', idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => addTestcase('sampleTestcases')}
          >
            + Add Sample Testcase
          </button>
        </div>

        {/* System Testcases */}
        <div>
          <h3 className="font-semibold text-lg">System Testcases</h3>
          {form.systemTestcases.map((tc, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <textarea
                placeholder="Input"
                rows={2}
                className="input"
                value={tc.input}
                onChange={(e) =>
                  handleTestcaseChange('systemTestcases', idx, 'input', e.target.value)
                }
              />
              <textarea
                placeholder="Expected Output"
                rows={2}
                className="input"
                value={tc.output}
                onChange={(e) =>
                  handleTestcaseChange('systemTestcases', idx, 'output', e.target.value)
                }
              />
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => removeTestcase('systemTestcases', idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => addTestcase('systemTestcases')}
          >
            + Add System Testcase
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full">
          Create Problem
        </button>
      </form>
    </div>
  );
};

export default CreateProblemPage;
