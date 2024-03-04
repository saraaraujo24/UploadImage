import React, { Component } from "react";
import { uniqueId } from "lodash";
import {filesize} from "filesize";
import api from "./services/api";

import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";
import Upload from "./components/Upload";
import FileList from "./components/FileList";



class App extends Component {
    state = {
      uploadedFiles: []
    };
    handleUpload = files => {
        const uploadedFiles = files.map(file => ({
          file,
          id: uniqueId(),
          name: file.name,
          readableSize: filesize(file.size),
          preview: URL.createObjectURL(file),
          progress: 0,
          uploaded: false,
          error: false,
          url: null
        }))
        //gravar no back end
        this.setState({
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
          });
          uploadedFiles.forEach(this.processUpload);
        
        };

        updateFile = (id, data) => {
            this.setState({
              uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
                return id === uploadedFile.id
                  ? { ...uploadedFile, ...data }
                  : uploadedFile;
              })
            });
          };
        
          processUpload = uploadedFile => {
            const data = new FormData();
        
            data.append("file", uploadedFile.file, uploadedFile.name);
        
            api
              .post("/posts", data, {
                onUploadProgress: e => {
                  const progress = parseInt(Math.round((e.loaded * 100) / e.total));
        
                  this.updateFile(uploadedFile.id, {
                    progress
                  })
                }
              })
            } 
            
  handleDelete = async id => {
    await api.delete(`posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    });
  };

  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }
 
        render() {
            const { uploadedFiles } = this.state;
        
            return (
              <Container>
                <Content>
                  <Upload onUpload={this.handleUpload} />
                  {!!uploadedFiles.length && (
                    <FileList files={uploadedFiles}  />
                  )}
                </Content>
                <GlobalStyle />
              </Container>
             
            );
          }
        }
     


export default App;