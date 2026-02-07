import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Login from './Login';
import Register from './Register';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="auth tabs"
          centered
        >
          <Tab label="Login" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Registrar" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Login onLoginSuccess={() => setTabValue(0)} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Register onRegisterSuccess={() => setTabValue(0)} />
      </TabPanel>
    </Box>
  );
}
