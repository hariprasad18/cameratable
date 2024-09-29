import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';

interface DecoratorsProps {
  alertMessage: string; 
  onClose: () => void; 
  open: boolean; 
}

export default function SnackbarWithDecorators({ alertMessage, onClose, open }: DecoratorsProps) {
  return (
    <Snackbar
      variant="soft"
      color="primary"
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      endDecorator={
        <Button
          onClick={onClose}
          size="lg"
          variant="soft"
          color="primary"
        >
          Dismiss
        </Button>
      }
    >
      {alertMessage}
    </Snackbar>
  );
}
