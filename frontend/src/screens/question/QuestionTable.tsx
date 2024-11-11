import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Question } from "../../api/interfaces";
import QuestionDescriptionModal from './QuestionDescriptionModal';
import "./QuestionTable.css";

interface QuestionTableProps {
  questions: Question[];
  onEdit: (id: string, updatedData: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onOpenModal: (question: Question | null) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions, onEdit, onDelete, onOpenModal }) => {
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const username = sessionStorage.getItem("username") || "Guest";
  const isAdmin = (sessionStorage.getItem("isAdmin") === "true") || false;

  const handleTitleClick = (question: Question) => {
    setSelectedQuestion(question);
    setDescriptionModalOpen(true);
  };

  const columns: GridColDef<Question>[] = [
    { field: "qId", headerName: "Question", flex: 1},
    { field: "qTitle", headerName: "Title", flex: 3, renderCell: (params) => (
      <Typography 
        variant="body1" 
        onClick={() => handleTitleClick(params.row)} 
        sx={{ 
          cursor: 'pointer', 
          textDecoration: 'underline', 
          color: '#00BFFF',
          display: 'flex',
          alignItems: 'center' }}
      >
        {params.value}
      </Typography>
      ),  
    },
    { field: "qCategory", headerName: "Category", flex: 2, renderCell: (params) => (
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
        {params.row.qCategory.map((cat, index) => (
          <Typography variant="body2" key={index}>
            {cat}
          </Typography>
        ))}
      </Box>
    )},
    { field: "qComplexity", headerName: "Complexity", flex: 1 },
  ];

  // Add "Actions" column only if the user is an admin
  if (isAdmin) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(params.row._id || '')}
            sx={{ marginRight: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onOpenModal(params.row)}
          >
            Edit
          </Button>
        </>
      ),
    });
  }

  return (
    <>
      <DataGrid
        className="data-grid"
        rows={questions}
        columns={columns}
        getRowId={(row) => row._id || ''}
        sx={{ width: '100%' }}
      />
      <QuestionDescriptionModal
        open={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        question={selectedQuestion}
      />
    </>
  );
};

export default QuestionTable;
