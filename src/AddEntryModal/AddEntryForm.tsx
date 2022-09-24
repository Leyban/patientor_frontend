import {
  Grid,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import {
  Diagnosis,
  Discharge,
  EntryTypes,
  HealthCheckRating,
  NewEntry,
  SickLeave,
} from '../types';

interface AddEntryFormProps {
  onSubmit: (values: NewEntry) => void;
  onClose: () => void;
  diagnoses: Diagnosis[];
}

interface AllEntryFields {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: Array<Diagnosis['code']>;
  type: EntryTypes;
  healthCheckRating: HealthCheckRating;
  employerName: string;
  sickLeaveStart: string;
  sickLeaveEnd: string;
  dischargeDate: string;
  dischargeCriteria: string;
}

const assertNever = (_value: never): never => {
  throw new Error('Uncaught type option');
};

const vetEntry = (values: AllEntryFields): NewEntry => {
  const baseEntry = {
    description: values.description,
    date: values.date,
    specialist: values.specialist,
    diagnosisCodes: values.diagnosisCodes,
    type: values.type,
  };
  switch (baseEntry.type) {
    case EntryTypes.HealthCheck:
      return {
        ...baseEntry,
        healthCheckRating: values.healthCheckRating,
        type: EntryTypes.HealthCheck,
      };
    case EntryTypes.OccupationalHealthcare:
      const sickLeave: SickLeave = {
        startDate: values.sickLeaveStart,
        endDate: values.sickLeaveEnd,
      };
      return {
        ...baseEntry,
        employerName: values.employerName,
        sickLeave,
        type: EntryTypes.OccupationalHealthcare,
      };
    case EntryTypes.Hospital:
      const discharge: Discharge = {
        date: values.dischargeDate,
        criteria: values.dischargeCriteria,
      };
      return {
        ...baseEntry,
        discharge,
        type: EntryTypes.Hospital,
      };

    default:
      return assertNever(baseEntry.type);
  }
};

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onSubmit, onClose, diagnoses }) => {
  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        type: EntryTypes.HealthCheck,
        healthCheckRating: HealthCheckRating.Healthy,
        employerName: '',
        sickLeaveStart: '',
        sickLeaveEnd: '',
        dischargeDate: '',
        dischargeCriteria: '',
      }}
      onSubmit={(values) => {
        const toSubmitEntry = vetEntry(values);
        onSubmit(toSubmitEntry);
      }}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (values.type === EntryTypes.OccupationalHealthcare) {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (!values.sickLeaveStart) {
            errors.sickLeaveStart = requiredError;
          }
          if (!values.sickLeaveEnd) {
            errors.sickLeaveEnd = requiredError;
          }
        }
        if (values.type === EntryTypes.Hospital) {
          if (!values.dischargeDate) {
            errors.dischargeDate = requiredError;
          }
          if (!values.dischargeCriteria) {
            errors.dischargeCriteria = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form>
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              diagnoses={Object.values(diagnoses)}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <InputLabel>Entry Type</InputLabel>
            <Select
              style={{ marginBottom: 20 }}
              value={values.type}
              label="Entry Type"
              onChange={(e) => {
                setFieldTouched('type', true);
                setFieldValue('type', e.target.value);
              }}
            >
              <MenuItem value={EntryTypes.HealthCheck}>Health Check</MenuItem>
              <MenuItem value={EntryTypes.Hospital}>Hospital</MenuItem>
              <MenuItem value={EntryTypes.OccupationalHealthcare}>
                Occupational Healthcare
              </MenuItem>
            </Select>

            {values.type === EntryTypes.HealthCheck && (
              <>
                <InputLabel>Health Rating</InputLabel>
                <Select
                  value={values.healthCheckRating}
                  label="Rating"
                  onChange={(e) => {
                    setFieldTouched('healthCheckRating', true);
                    setFieldValue('healthCheckRating', e.target.value);
                  }}
                >
                  <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
                  <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
                  <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
                  <MenuItem value={HealthCheckRating.CriticalRisk}>
                    Critical Risk
                  </MenuItem>
                </Select>
              </>
            )}

            {values.type === EntryTypes.Hospital && (
              <>
                <InputLabel>Discharge</InputLabel>
                <Field
                  label="Criteria"
                  placeholder="Criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
                <Field
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  name="dischargeDate"
                  component={TextField}
                  style={{ margin: '10px 0' }}
                />
              </>
            )}
            {values.type === EntryTypes.OccupationalHealthcare && (
              <>
                <Field
                  label="Employer"
                  placeholder="Employer"
                  name="employerName"
                  component={TextField}
                />
                <Typography>Sick Leave</Typography>
                <Field
                  label="Leave Start"
                  placeholder="YYYY-MM-DD"
                  name="sickLeaveStart"
                  component={TextField}
                />
                <Field
                  label="Leave End"
                  placeholder="YYYY-MM-DD"
                  name="sickLeaveEnd"
                  component={TextField}
                  style={{ margin: '10px 0' }}
                />
              </>
            )}
            <Grid style={{ marginTop: 20 }}>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
