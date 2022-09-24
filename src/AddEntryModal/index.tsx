import { Dialog, DialogContent, DialogTitle, Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Diagnosis, NewEntry } from '../types';
import AddEntryForm from './AddEntryForm';

interface AddEntryModalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
  diagnoses: Diagnosis[];
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
  diagnoses
}) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry</DialogTitle>
      <Divider />
      <DialogContent>
        {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
        <AddEntryForm onSubmit={onSubmit} onClose={onClose} diagnoses={diagnoses}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;
