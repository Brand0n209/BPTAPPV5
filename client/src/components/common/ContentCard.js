import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography
} from '@mui/material';

/**
 * ContentCard - A consistent card component for module content
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {boolean} props.lightHeader - Whether to use light header styling
 * @param {React.ReactNode} props.headerAction - Optional action button for header
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.sx - Additional Card styling
 * @param {Object} props.contentSx - Additional CardContent styling
 */
function ContentCard({ 
  title, 
  lightHeader = true, 
  headerAction,
  children, 
  sx = {}, 
  contentSx = {} 
}) {
  return (
    <Card 
      sx={{ 
        mb: 3,
        borderRadius: '7px',
        boxShadow: '0 2px 8px rgba(30,41,59,0.05)',
        ...sx 
      }}
    >
      {title && (
        <CardHeader
          title={title}
          action={headerAction}
          sx={{
            backgroundColor: lightHeader ? '#f8f9fa' : '#fff',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#0f172a'
            }
          }}
        />
      )}
      <CardContent sx={{ padding: '1.25rem', ...contentSx }}>
        {children}
      </CardContent>
    </Card>
  );
}

export default ContentCard;
