import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterDramaOutlinedIcon from '@mui/icons-material/FilterDramaOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CameraActionModal from './CameraActionModal'; 
import SnackbarWithDecorators from '../assets/utils/SnackBar';
import { updateCameraStatus } from '../assets/js/api';

interface Health {
  cloud: string;
  device: string;
}

interface CameraData {
  name: string;
  location: string;
  recorder: string;
  tasks: string;
  status: string;
  _id: string;
  id: number;
  current_status: string;
  health: Health;
  hasWarning: boolean;
}

interface CameraTableBodyProps {
  data: CameraData[];
  filteredData: CameraData[];
  selectedCameras: string[];
  emptyRows: number;
  rowsPerPage: number;
  page: number;
  handleCheckboxChange: (cameraId: string) => void;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelectedCameras: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteCamera: (cameraId: string) => void;
}

const CameraTableBody: React.FC<CameraTableBodyProps> = React.memo(({
  filteredData,
  selectedCameras,
  emptyRows,
  rowsPerPage,
  page,
  handleCheckboxChange,
  handleChangePage,
  handleChangeRowsPerPage,
  setSelectedCameras,
  onDeleteCamera
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'Edit' | 'Delete'>('Edit');
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const renderStatusDot = (status: string) => {
    const className = status === 'Online' ? 'onlineStat online' : 'onlineStat offline';
    return <span className={className} />;
  };

  const renderHealthStatus = (status: string) => {
    const getStatusColor = (value: string) => {
      switch (value) {
        case 'A': return 'green';
        case 'B': return 'yellow';
        default: return 'red';
      }
    };

    const color = getStatusColor(status);
    return (
      <span className="health-status">
        <span className="health-dot" style={{ borderColor: color }}>
          {status}
        </span>
      </span>
    );
  };

  const handleOpenModal = (camera: CameraData, type: 'Edit' | 'Delete') => {
    setSelectedCamera(camera);
    setActionType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCamera(null);
  };

  const handleConfirm = useCallback(async (actionType: string) => {
    if (selectedCamera) {
      if (actionType === 'Edit') {
        try {
          const response = await updateCameraStatus(selectedCamera);
          setSnackbarMessage(response?.status === 200
            ? `${selectedCamera.name} status changed successfully`
            : `Failed to change status for ${selectedCamera.name}`
          );
        } catch (error) {
          console.error('Error updating camera status:', error);
          setSnackbarMessage('Error updating camera status. Please try again.');
        }
      } else {
        onDeleteCamera(selectedCamera._id);
        setSnackbarMessage(`${selectedCamera.name} deleted successfully`);
      }
      setSnackbarOpen(true);
      handleCloseModal();
    }
  }, [selectedCamera, onDeleteCamera]);

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 'auto' }}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCameras(filteredData.map(camera => camera._id));
                    } else {
                      setSelectedCameras([]);
                    }
                  }}
                  checked={selectedCameras.length === filteredData.length && selectedCameras.length > 0}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Recorder</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData).map((camera) => (
              <TableRow key={camera._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedCameras.includes(camera._id)}
                    onChange={() => handleCheckboxChange(camera._id)}
                  />
                </TableCell>
                <TableCell scope="row">
                  <span className='multiItemSpan'>
                    {renderStatusDot(camera.current_status)}
                    <span>{camera.name}</span>
                    {camera.status === 'Inactive' && <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'orange' }} />}
                  </span>
                </TableCell>
                <TableCell scope="row">
                  <span className='multiItemSpan'>
                    <FilterDramaOutlinedIcon />
                    <span>{renderHealthStatus(camera.health.cloud)}</span>
                    <StorageOutlinedIcon />
                    <span>{renderHealthStatus(camera.health.device)}</span>
                  </span>
                </TableCell>
                <TableCell>{camera.location}</TableCell>
                <TableCell>{camera.recorder || 'N/A'}</TableCell>
                <TableCell>{camera.tasks} Tasks</TableCell>
                <TableCell>
                  <span className='statusCell' style={{ color: camera.status === 'Active' ? 'green' : 'black' }}>
                    {camera.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className='multiItemSpan'>
                    <IconButton color="primary" onClick={() => handleOpenModal(camera, 'Edit')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenModal(camera, 'Delete')}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter className='footer'>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={8}
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page"
                showFirstButton
                showLastButton
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <CameraActionModal
        open={modalOpen}
        actionType={actionType}
        cameraName={selectedCamera?.name || ''}
        onClose={handleCloseModal}
        onConfirm={() => handleConfirm(actionType)}
      />

      <SnackbarWithDecorators
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        alertMessage={snackbarMessage}
      />
    </>
  );
});

export default CameraTableBody;
