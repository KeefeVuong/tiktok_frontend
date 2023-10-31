import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Alert, Typography, Collapse } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { APIFetch } from '../Helper';

function WeeklyNotes({ openWeeklyNotes, handleOpenWeeklyNotes, weeklyReport, setWeeklyReport, handleSnackbar }) {
    const editorRef = useRef(null);
    const [saved, setSaved] = useState(true);
    const [content, setContent] = useState(weeklyReport["notes"]);
    const initialLoadComplete = useRef(false);
    
    const handleWeeklyNotes = (val) => {
      setContent(val);
      setSaved(false);
  
      if (!initialLoadComplete.current) {
        initialLoadComplete.current = true;
      }
    };

    const updateWeeklyNotes = async () => {
        if (initialLoadComplete.current) {
            await APIFetch(`/api/weekly-reports/${weeklyReport.id}`, "PUT", { "notes": content })
            .then(() => {
                setWeeklyReport({ ...weeklyReport, notes: content });
                setSaved(true);
                handleSnackbar(true, "SUCCESS: Saved Weekly Notes");
            })
            .catch((error) => {
                console.error(error.message);
                handleSnackbar(true, "ERROR: Saved Weekly Notes");
            })
        }
    };

    const debouncedContent = useRef(content);
    
    useEffect(() => {
        const debounceSave = setTimeout(() => {
        if (initialLoadComplete.current) {
            debouncedContent.current = content;
            updateWeeklyNotes();
        }
        }, 1000); // Adjust the debounce time as needed (e.g., 1000ms)

        return () => clearTimeout(debounceSave);
    }, [content]);

    useEffect(() => {
        setContent(weeklyReport.notes);
    }, [weeklyReport.notes]);


    return (
        <Drawer
        sx={{ width: "30%" }}
        open={openWeeklyNotes}
        onClose={handleOpenWeeklyNotes}
        >

        <Collapse in={!saved}>
            <Alert severity="warning" sx={{backgroundColor: "#f4be69"}}>
                <Typography>
                    You currently have <Typography component="span" fontWeight="bold">unsaved changes</Typography>, please wait for the autosave before exiting!
                </Typography>
            </Alert>
        </Collapse>
        
        <Editor
            id="5"
            onInit={(editor) => (editorRef.current = editor)}
            value={content}
            onEditorChange={handleWeeklyNotes}
            init={{
            selector: 'textarea',
            height: "100%",
            width: "100%",
            menubar: true,
            plugins: [
                'table',
            ],
            toolbar: 'undo redo | formatselect | blocks fontfamily fontsize |' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | restoredraft | help | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            content_style: 'body { font-family:Monsterrat; font-size:24pt }'
            }}
        />
        </Drawer>
    );
}

export default WeeklyNotes;
