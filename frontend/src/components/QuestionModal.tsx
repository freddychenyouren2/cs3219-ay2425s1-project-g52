import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Question } from '../api/interfaces';

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onAdd: (newData: Omit<Question, '_id'>) => void;
  onEdit: (id: string, updatedData: Partial<Question>) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, onAdd, onEdit }) => {
  const [formData, setFormData] = useState<Partial<Question>>({});

  useEffect(() => {
    if (question) {
      setFormData({
        qTitle: question.qTitle,
        qDescription: question.qDescription,
        qCategory: question.qCategory,
        qComplexity: question.qComplexity,
      });
    } else {
      setFormData({}); // Reset for adding a new question
    }
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        <TextField
          name="qDescription"
          label="Description"
          value={formData.qDescription || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
        />
        <TextField
          name="qCategory"
          label="Category"
          value={formData.qCategory?.join(', ') || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="qComplexity"
          label="Complexity"
          value={formData.qComplexity || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default QuestionModal;
