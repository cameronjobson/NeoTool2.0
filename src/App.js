import React, { useState } from 'react';
import "./App.css"

function NeoTool() {
    const [gestAgeWeeks, setGestAgeWeeks] = useState('');
    const [gestAgeDays, setGestAgeDays] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [birthWeight, setBirthWeight] = useState('');
    const [output, setOutput] = useState([]);

    // Converts gestational age to total days, handling empty strings
    const gestAgeTotalDays = (gestAgeWeeks ? parseInt(gestAgeWeeks, 10) * 7 : 0) +
                             (gestAgeDays ? parseInt(gestAgeDays, 10) : 0);

    const traditionalTreatmentDate = (treatmentDescription, CGA) => {
        if (!dateOfBirth) return ''; // guard clause for empty DOB
        const dob = new Date(dateOfBirth);
        const treatmentDate = new Date(dob.getTime() - gestAgeTotalDays * 24 * 60 * 60 * 1000 + (CGA * 7 * 24 * 60 * 60 * 1000));
        return `${treatmentDescription} ${treatmentDate.toLocaleDateString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })}`;
    };

    // Calculates simple treatment date
    const simpleTreatment = (treatmentDescription, daysAdd) => {
        if (!dateOfBirth) return ''; // guard clause for empty DOB
        const dob = new Date(dateOfBirth);
        const treatmentDate = new Date(dob.getTime() + (daysAdd * 24 * 60 * 60 * 1000));
        return `${treatmentDescription} ${treatmentDate.toLocaleDateString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })}`;
    };

    // Determines the list of treatments, generates error messages for empty fields
    const treatmentList = () => {
        let treatments = [];
        const weight = birthWeight ? parseInt(birthWeight, 10) : 0;

        if (weight <= 0) treatments.push("Enter a valid Weight.");
        if (gestAgeTotalDays <= 0) treatments.push("Enter a valid Gestational Age.");
        if (dateOfBirth === "") treatments.push("Enter a valid DOB")
        if (weight > 0 && gestAgeTotalDays > 0) {
            if (weight <= 1500) treatments.push(traditionalTreatmentDate("DEBM stop at 1500g and 35w", 35));
            treatments.push(simpleTreatment("MVI/Fe at full feeds and >/=14dol", 14));
        }

        return treatments;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setOutput(treatmentList());
    };

    return (
        <div className="NeoTool">
          <form onSubmit={handleSubmit}>
            <h1>NICU Patient Treatment Generator</h1>
            <h2>(Baylor University Medical Center)</h2>
            <div className="input-group">
              <label htmlFor="gestational-age-weeks">Birth Gestational Age:</label>
              <input
                className="weeks-input"
                id="gestational-age-weeks"
                type="text"
                value={gestAgeWeeks}
                onChange={e => setGestAgeWeeks(e.target.value)}
                placeholder="Weeks"
              />
              <label className="label-inline" htmlFor="gestational-age-days">w</label>
              <input
              className="days-input"
                id="gestational-age-days"
                type="text"
                value={gestAgeDays}
                onChange={e => setGestAgeDays(e.target.value)}
                placeholder="Days"
              />
              <label className="label-inline">d</label>
            </div>
      
            <div className="input-group">
              <label htmlFor="dob">DOB:</label>
              <input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </div>
      
            <div className="input-group">
              <label htmlFor="birth-weight">Birth weight:</label>
              <input
                className="weight-input"
                id="birth-weight"
                type="text"
                value={birthWeight}
                onChange={e => setBirthWeight(e.target.value)}
                placeholder="Grams"
              />
              <label className="label-inline">g</label>
            </div>
      
            <button type="submit">Submit</button>
          </form>
      
          <div className="output-section">
            {output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      );
      
      
}

export default NeoTool;
