import {
  Entry,
  EntryTypes,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../types';
import workLogo from '../logos/work_briefcase.svg';
import medicLogo from '../logos/medic_briefcase.svg';
import Heart from '../logos/Heart';
import React from 'react';

const assertNever = (value: never) => {
  return value;
};

const containerStyle: React.CSSProperties = {
  border: '1px solid #000000',
  borderRadius: 5,
  padding: 3,
  marginBottom: 5,
};

const logoStyle: React.CSSProperties = {
  width: 15,
};

const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div style={containerStyle}>
      <p>
        {entry.date} <img src={medicLogo} alt="medic briefcase" style={logoStyle} />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      {entry.discharge && (
        <p>
          {entry.discharge.date} {entry.discharge.criteria}
        </p>
      )}
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <div style={containerStyle}>
      <p>
        {entry.date} <img src={medicLogo} alt="medic briefcase" style={logoStyle} />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <Heart rating={entry.healthCheckRating} />
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <div style={containerStyle}>
      <p>
        {entry.date} <img src={workLogo} alt="work briefcase" style={logoStyle} />{' '}
        {entry.employerName}
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      {entry.diagnosisCodes}
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case EntryTypes.HealthCheck:
      return <HealthCheckEntryDetails entry={entry} />;
    case EntryTypes.Hospital:
      return <HospitalEntryDetails entry={entry} />;
    case EntryTypes.OccupationalHealthcare:
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      assertNever(entry);
      return null;
  }
};

export default EntryDetails;
