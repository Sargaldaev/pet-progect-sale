import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';

interface IProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  image: File | null;
}

const InputFile: React.FC<IProps> = ({ onChange, name, image }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filename, setFilename] = useState<string>('');

  useEffect(() => {
    if (image === null) {
      setFilename('');
    }
  }, [image]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename('');
    }

    onChange(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />
      <Grid item>
        <TextField
          disabled
          label="Browse image"
          value={filename}
          onClick={activateInput}
          fullWidth
        />
        <Button variant="contained" sx={{ marginTop: 1 }} onClick={activateInput}>
          Browse
        </Button>
      </Grid>
    </>
  );
};

export default InputFile;
