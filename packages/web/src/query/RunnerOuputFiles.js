import React from 'react';
import useSocket from '../utility/SocketProvider';
import axios from '../utility/axios';
import styled from 'styled-components';
import TableControl, { TableColumn } from '../utility/TableControl';
import formatFileSize from '../utility/formatFileSize';
import resolveApi from '../utility/resolveApi';

export default function RunnerOutputFiles({ runnerId, executeNumber }) {
  const socket = useSocket();
  const [files, setFiles] = React.useState([]);

  const handleRunnerDone = React.useCallback(async () => {
    const resp = await axios.get(`runners/files?runid=${runnerId}`);
    setFiles(resp.data);
  }, [runnerId]);

  React.useEffect(() => {
    if (runnerId && socket) {
      socket.on(`runner-done-${runnerId}`, handleRunnerDone);
      return () => {
        socket.off(`runner-done-${runnerId}`, handleRunnerDone);
      };
    }
  }, [runnerId, socket]);

  React.useEffect(() => {
    setFiles([]);
  }, [executeNumber]);

  return (
    <TableControl rows={files}>
      <TableColumn fieldName="name" header="Name" />
      <TableColumn fieldName="size" header="Size" formatter={(row) => formatFileSize(row.size)} />
      <TableColumn
        fieldName="download"
        header="Download"
        formatter={(row) => (
          <a href={`${resolveApi()}/runners/data/${runnerId}/${row.name}`} target="_blank" rel="noopener noreferrer">
            download
          </a>
        )}
      />
    </TableControl>
  );
}