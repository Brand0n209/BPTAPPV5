import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * ModuleHeader - A consistent header component for module content
 * @param {Object} props - Component props
 * @param {string} props.title - The title text
 * @param {Object} props.icon - FontAwesome icon to display
 * @param {React.ReactNode} props.children - Optional additional content
 * @param {Object} props.sx - Additional styling
 */
function ModuleHeader({ title, icon, children, sx = {} }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '36px',
        minHeight: '36px',
        maxHeight: '36px',
        borderBottom: '1px solid #e0e7ef',
        paddingLeft: '6px',
        backgroundColor: '#fff',
        borderRadius: '7px 7px 0 0',
        boxShadow: '0 1px 0 #e0e7ef',
        marginBottom: 0,
        ...sx
      }}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{
            marginRight: '8px',
            color: '#2563eb',
            fontSize: '1em'
          }}
        />
      )}
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontSize: '0.98em',
          fontWeight: 600,
          color: '#2563eb',
          letterSpacing: '0.01em',
          lineHeight: 1,
          margin: 0,
          padding: 0
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default ModuleHeader;
