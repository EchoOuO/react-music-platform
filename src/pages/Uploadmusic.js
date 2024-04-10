import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function FileUpload({ setUploadedMusic }) {
  const [musicName, setMusicName] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileTooBig, setFileTooBig] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.size > 100000000) {
        setFileTooBig(true);
        return;
      }
      setFileTooBig(false);
      const reader = new FileReader();
      reader.onload = function (e) {
        localStorage.setItem("audio", e.target.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*",
  });

  const handleMusicNameChange = (event) => {
    setMusicName(event.target.value);
  };

  const handleArtistChange = (event) => {
    setArtist(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      console.error("No file has been uploaded.");
      return;
    }

    let musicFile;
    if (file instanceof Blob || file instanceof File) {
      musicFile = URL.createObjectURL(file);
    } else {
      console.error("File is not a Blob or a File:", file);
      return;
    }

    const newMusic = {
      musicName,
      artist,
      description,
      musicFile,
    };

    setUploadedMusic((prevMusic) => [...prevMusic, newMusic]);
    navigate("/artist");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload Your Music</h2>
      {fileTooBig && <h1>File too big</h1>}
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className="mb-3">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div className="mb-3">
          <label htmlFor="musicNameInput" className="form-label">
            Music Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="musicNameInput"
            value={musicName}
            onChange={handleMusicNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="artistInput" className="form-label">
            Artist:
          </label>
          <input
            type="text"
            className="form-control"
            id="artistInput"
            value={artist}
            onChange={handleArtistChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descriptionInput" className="form-label">
            Description:
          </label>
          <textarea
            className="form-control"
            id="descriptionInput"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
