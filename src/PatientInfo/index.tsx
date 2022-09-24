import { Button, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../state';
import maleLogo from '../logos/male.svg';
import femaleLogo from '../logos/female.svg';
import { Diagnosis, NewEntry, Patient } from '../types';
import EntryDetails from './EntryDetails';
import AddEntryModal from '../AddEntryModal';
import { apiBaseUrl } from '../constants';

const PatientInfo: FunctionComponent = () => {
  const [{ patients }] = useStateValue();
  const { id: idFromUrl } = useParams<{ id: string }>();

  const [patientInfo, setPatientInfo] = React.useState<Patient | undefined>(
    Object.values(patients).find((p) => p.id === idFromUrl)
  );

  const [diagnoses, setDiagnoses] = React.useState<Diagnosis[]>();

  const [error, setError] = React.useState<string>();
  const [modalOpen, setModalOpen] = React.useState(false);
  const onOpenModal = () => {
    setModalOpen(true);
  };
  const onCloseModal = () => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!idFromUrl) {
      return;
    }

    try {
      const { data: updatedPatient, status } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${idFromUrl}/entries`,
        values
      );
      setPatientInfo(updatedPatient);
      if (status === 200) {
        onCloseModal();
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(String(e?.response?.data?.error) || 'Unrecognized axios error');
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      try {
        const response = await axios.get<Patient>(
          `http://localhost:3001/api/patients/${id}`
        );
        setPatientInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get<Diagnosis[]>(
          'http://localhost:3001/api/diagnoses'
        );
        setDiagnoses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if ((!patientInfo || !patientInfo.ssn) && idFromUrl) {
      void fetchPatientInfo(idFromUrl);
      void fetchDiagnoses();
    }
  }, [patientInfo]);

  return (
    <>
      <Typography variant="h4">
        {patientInfo?.name}
        {patientInfo?.gender === 'male' && (
          <img src={maleLogo} style={{ width: 20, marginLeft: 10 }} />
        )}
        {patientInfo?.gender === 'female' && (
          <img src={femaleLogo} style={{ width: 20 }} />
        )}
      </Typography>
      <p>{patientInfo && patientInfo.ssn && `ssh: ${patientInfo?.ssn}`}</p>
      <p>
        {patientInfo &&
          patientInfo.occupation &&
          `occupation: ${patientInfo?.occupation}`}
      </p>
      <Typography variant="h5">entries</Typography>
      {patientInfo?.entries?.map((entry) => (
        <EntryDetails entry={entry} key={entry.id} />
      ))}
      {diagnoses && (
        <AddEntryModal
          modalOpen={modalOpen}
          onClose={onCloseModal}
          onSubmit={submitNewEntry}
          error={error}
          diagnoses={diagnoses}
        />
      )}
      {patientInfo && diagnoses && (
        <Button
          component="button"
          variant="contained"
          color="primary"
          onClick={onOpenModal}
        >
          Add New Entry
        </Button>
      )}
    </>
  );
};

export default PatientInfo;
