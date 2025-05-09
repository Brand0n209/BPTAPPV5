import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  FormHelperText, 
  TextField, 
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Grid,
  styled
} from '@mui/material';

// Styled components for consistent form styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: '16px',
  width: '100%',
}));

const StyledLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 500,
  color: '#495057',
  marginBottom: '4px',
  transform: 'none',
  position: 'relative',
}));

/**
 * FormField - A consistent form field component
 * @param {Object} props - Component props
 * @param {string} props.id - Field ID
 * @param {string} props.label - Field label
 * @param {string} props.type - Field type (text, select, checkbox, radio, textarea)
 * @param {string} props.value - Field value
 * @param {Function} props.onChange - onChange handler
 * @param {Array} props.options - Options for select/radio fields
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {Object} props.gridProps - Grid props for layout
 * @param {Object} props.inputProps - Additional props for the input
 */
function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  helperText = '',
  gridProps = { xs: 12 },
  inputProps = {},
  ...rest
}) {
  // Render different field types
  const renderField = () => {
    const hasError = !!error;
    
    switch (type) {
      case 'select':
        return (
          <StyledFormControl error={hasError} required={required}>
            <StyledLabel htmlFor={id}>{label}</StyledLabel>
            <Select
              id={id}
              value={value || ''}
              onChange={onChange}
              size="small"
              displayEmpty
              sx={{ 
                fontSize: '0.9rem',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: hasError ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                  borderRadius: '5px',
                }
              }}
              {...inputProps}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(helperText || error) && (
              <FormHelperText error={hasError}>
                {error || helperText}
              </FormHelperText>
            )}
          </StyledFormControl>
        );
        
      case 'checkbox':
        return (
          <StyledFormControl error={hasError} required={required}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    id={id}
                    checked={!!value}
                    onChange={onChange}
                    size="small"
                    {...inputProps}
                  />
                }
                label={
                  <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>
                    {label}
                  </span>
                }
              />
            </FormGroup>
            {(helperText || error) && (
              <FormHelperText error={hasError}>
                {error || helperText}
              </FormHelperText>
            )}
          </StyledFormControl>
        );
        
      case 'radio':
        return (
          <StyledFormControl error={hasError} required={required}>
            <StyledLabel>{label}</StyledLabel>
            <RadioGroup
              id={id}
              value={value || ''}
              onChange={onChange}
              row={inputProps.row}
              {...inputProps}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={
                    <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>
                      {option.label}
                    </span>
                  }
                />
              ))}
            </RadioGroup>
            {(helperText || error) && (
              <FormHelperText error={hasError}>
                {error || helperText}
              </FormHelperText>
            )}
          </StyledFormControl>
        );
        
      case 'textarea':
        return (
          <StyledFormControl error={hasError} required={required}>
            <StyledLabel htmlFor={id}>{label}</StyledLabel>
            <TextField
              id={id}
              value={value || ''}
              onChange={onChange}
              multiline
              rows={inputProps.rows || 4}
              variant="outlined"
              size="small"
              error={hasError}
              helperText={error || helperText}
              sx={{ 
                fontSize: '0.9rem',
                '.MuiOutlinedInput-notchedOutline': {
                  borderRadius: '5px',
                }
              }}
              {...inputProps}
            />
          </StyledFormControl>
        );
        
      default: // text, number, email, etc.
        return (
          <StyledFormControl error={hasError} required={required}>
            <StyledLabel htmlFor={id}>{label}</StyledLabel>
            <TextField
              id={id}
              type={type}
              value={value || ''}
              onChange={onChange}
              variant="outlined"
              size="small"
              error={hasError}
              helperText={error || helperText}
              sx={{ 
                fontSize: '0.9rem',
                '.MuiOutlinedInput-notchedOutline': {
                  borderRadius: '5px',
                }
              }}
              {...inputProps}
            />
          </StyledFormControl>
        );
    }
  };

  // If gridProps is provided, wrap in Grid
  if (gridProps) {
    return (
      <Grid item {...gridProps}>
        {renderField()}
      </Grid>
    );
  }
  
  return renderField();
}

export default FormField;
