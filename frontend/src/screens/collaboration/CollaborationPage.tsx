
import { Box, Typography} from '@mui/material';
import CodeEditor from './CodeEditor';

const CollaborationPage = () => {
    return (
        <Box
            sx={{
                pt: 8,
                px: 4,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
        
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "900px",
                    mb: 4,
                    p: 2,
                    backgroundColor: "#1e1e1e",  // Slightly darker gray
                    borderRadius: 2,
                    textAlign: "center"
                }}
            >
                <Typography variant="h3" component="h3" sx={{ fontWeight: 700, color: "white" }}>
                    Two Sum
                </Typography>
                <Typography variant="h4" component="h4" sx={{ fontWeight: 700, color: "gray" }}>
                    Sum two things lol
                </Typography>
            </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    
                    <Box sx={{ flex: 1, mr: 2 }}>
                        <CodeEditor />
                    </Box>

                    
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: "#2e2e2e",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h5" component="h5" sx={{ color: "gray" }}>
                            Placeholder
                        </Typography>
                    </Box>
                </Box>

        </Box>

    );
};

export default CollaborationPage;