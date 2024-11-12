import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { Question } from '../../api/interfaces';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; //LaTeX rendering

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onAdd: (newData: Omit<Question, '_id'>) => void;
  onEdit: (id: string, updatedData: Partial<Question>) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, onAdd, onEdit }) => {
  const [formData, setFormData] = useState<Partial<Question>>({
    qTitle: '',
    qDescription: '',
    qCategory: [],
    qComplexity: '',
  });

  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        qTitle: question.qTitle,
        qDescription: question.qDescription,
        qCategory: question.qCategory,
        qComplexity: question.qComplexity,
      });
    } else {
      setFormData({
          qTitle: '',
          qDescription: '',
          qCategory: [],
          qComplexity: '',
      }); 
    }
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'qCategory') {
      setFormData({
        ...formData,
        qCategory: value ? value.split(',').map(item => item.trim()) : [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      qCategory: event.target.value as string[],
    });
  };

  const handleSubmit = () => {
    if (question) {
      onEdit(question._id || '', formData);
    } else {
      onAdd(formData as Omit<Question, '_id'>);
    }
    onClose();
  };

  const topics = [
    "Strings",
    "Algorithms",
    "Data Structures",
    "Bit Manipulation",
    "Recursion",
    "Databases",
    "Arrays",
    "Brainteaser",
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1 }}>
        <h2>{question ? 'Edit Question' : 'Add Question'}</h2>
        <TextField
          name="qTitle"
          label="Title"
          value={formData.qTitle || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button onClick={() => setShowMarkdownPreview(!showMarkdownPreview)} sx={{ mb: 1 }}>
          {showMarkdownPreview ? 'Edit Description' : 'Preview Description'}
        </Button>
        {showMarkdownPreview ? (
          <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-line' }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {formData.qDescription || ''}
            </ReactMarkdown>
          </Box>
        ) : (
          <TextField
            name="qDescription"
            label="Description (Markdown supported)"
            value={formData.qDescription || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
          />
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel sx={{fontSize: '12px'}} >Category</InputLabel>
          <Select
            name="qCategory"
            label="Category"
            multiple
            value={formData.qCategory || []}
            onChange={(event) => {
              handleCategoryChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
            }}
            input={<OutlinedInput label="Category"/>}
            >
              {topics.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <TextField
          name="qCategory"
          label="Category"
          value={formData.qCategory?.join(', ') || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        /> */}
        <InputLabel sx={{fontSize: '12px'}}>
          Complexity
        </InputLabel>
        <Select
          name="qComplexity"
          label="Complexity"
          value={formData.qComplexity || ''}
          onChange={(event) => {
            handleChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
          }}
          fullWidth
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
        <Button variant="contained" color="error" onClick={onClose} style={{margin:'4px'}}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} style={{margin:'4px'}}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default QuestionModal;
