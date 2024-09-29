import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchCameras } from '../assets/js/api';
import './cameraTable.css';
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Dropdown from './Dropdown';
import logo from '../assets/images/wobot.webp';
import CameraTableBody from './CameraTableBody';

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

const CameraTable: React.FC = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const getCameras = async () => {
    try {
      const cameraData = await fetchCameras(); 
      setData(cameraData); 
    } catch (error) {
      console.error('Error fetching camera data:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getCameras(); 
  }, []);

  const uniqueLocations = useMemo(() => {
    const locations = Array.from(new Set(data.map(camera => camera.location)));
    locations.unshift('All');
    return locations;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((camera) => {
      const matchesSearch =
        camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.recorder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.tasks.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || camera.status === statusFilter;
      const matchesLocation = locationFilter === 'All' || camera.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [data, searchTerm, statusFilter, locationFilter]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  const handleCheckboxChange = (cameraId: string) => {
    setSelectedCameras(prevSelected => 
      prevSelected.includes(cameraId) 
        ? prevSelected.filter(id => id !== cameraId) 
        : [...prevSelected, cameraId]
    );
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleDeleteCamera = (cameraId: string) => {
    setData(prevData => prevData.filter(camera => camera._id !== cameraId));
    setSelectedCameras(prevSelected => prevSelected.filter(id => id !== cameraId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="camera-table-container">
      <img src={logo} alt='logo' height={80} width={150} />
      <Box className='headerDiv'>
        <Box>
          <h2 className='header'>Cameras</h2>
          <p className='subHeader'>Manage your cameras here.</p>
        </Box>
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <Box className='filters'>
        <Dropdown
          label="Location"
          value={locationFilter}
          onChange={setLocationFilter}
          options={uniqueLocations}
          icon={<LocationOnIcon />}
        />
        <Dropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          icon={<RssFeedIcon />}
          options={['All', 'Active', 'Inactive']}
        />
      </Box>

      <CameraTableBody
        data={data}
        filteredData={filteredData}
        selectedCameras={selectedCameras}
        emptyRows={emptyRows}
        rowsPerPage={rowsPerPage}
        page={page}
        handleCheckboxChange={handleCheckboxChange}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        setSelectedCameras={setSelectedCameras}
        onDeleteCamera={handleDeleteCamera}
      />
    </Box>
  );
};

export default CameraTable;
