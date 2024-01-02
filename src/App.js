import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

function NeoTool() {
  const [gestAgeWeeks, setGestAgeWeeks] = useState('');
  const [gestAgeDays, setGestAgeDays] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [output, setOutput] = useState([]);

  // Convert specfic inputs from strings to integers
  const gestAgeTotalDays =
    (gestAgeWeeks ? parseInt(gestAgeWeeks, 10) * 7 : 0) +
    (gestAgeDays ? parseInt(gestAgeDays, 10) : 0);

  // Generate past dates in red, current dates in green
  const getDateClass = (date) => {
    // Check if the date is a valid and non-empty string
    if (!date || isNaN(Date.parse(date))) {
      return 'invalid-date'; // Return a class for invalid or missing dates
    }
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison
    const comparisonDate = new Date(date);
    comparisonDate.setHours(0, 0, 0, 0); // Normalize the comparison date
  
    if (comparisonDate < currentDate) {
      return 'past-date';
    } else if (comparisonDate.getTime() === currentDate.getTime()) {
      return 'current-date';
    } else {
      return 'future-date'; // Added to handle future dates
    }
  };

  const formatDate = (date) => {
    // Ensure we're formatting the date as UTC to avoid timezone conversions
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
  };


  const calculateTreatmentDate = (dateOfBirth, daysOffset) => {
    // Parse the date as UTC
    const dob = new Date(new Date(dateOfBirth).toISOString());
    // Set the UTC date plus the day offset
    dob.setUTCDate(dob.getUTCDate() + daysOffset);
    // Format the date as a string in the local timezone
    return formatDate(dob);
  };
  

  //For treatment dates determined by gestagational age
  const traditionalTreatmentDate = (treatmentDescription, CGA, source) => {
    if (!dateOfBirth) return '';
    const dob = new Date(dateOfBirth);
    const treatmentDate = new Date(
      dob.getTime() +
      CGA * 7 * 24 * 60 * 60 * 1000 -
      gestAgeTotalDays * 24 * 60 * 60 * 1000
    );
    return {
      description: `${treatmentDescription} ${formatDate(treatmentDate)}`,
      date: formatDate(treatmentDate),
      source: source,
    };
  };

  //Calculate ROP Dates
  const calculateRopExamDate = () => {
    if (gestAgeTotalDays < 0) {
      // Handle negative gestAgeTotalDays, if needed
      return; // or throw an error
    }

    let weekNumber = 31;
    if (gestAgeTotalDays >= 196 && gestAgeTotalDays < 203) {
      weekNumber = 32;
    } else if (gestAgeTotalDays >= 203 && gestAgeTotalDays < 210) {
      weekNumber = 33;
    } else if (gestAgeTotalDays >= 210 && gestAgeTotalDays < 217) {
      weekNumber = 34;
    } else if (gestAgeTotalDays >= 217 && gestAgeTotalDays < 224) {
      weekNumber = 35;
    } else if (gestAgeTotalDays >= 224 && gestAgeTotalDays < 231) {
      weekNumber = 36;
    } else if (gestAgeTotalDays >= 231 && gestAgeTotalDays < 238) {
      weekNumber = 37;
    } else if (gestAgeTotalDays >= 238 && gestAgeTotalDays < 245) {
      weekNumber = 38;
    } else if (gestAgeTotalDays >= 245 && gestAgeTotalDays < 252) {
      weekNumber = 39;
    } else if (gestAgeTotalDays >= 252) {
      weekNumber = 40;
    }

    return traditionalTreatmentDate("<b>ROP</b> First Exam Due near week of:", weekNumber);
  }

  // For treatment dates determined by Days Of Life
  const simpleTreatment = (treatmentDescription, daysAdd, source) => {
    if (!dateOfBirth) return '';
    return {
      description: `${treatmentDescription} ${calculateTreatmentDate(dateOfBirth, daysAdd)}`,
      date: calculateTreatmentDate(dateOfBirth, daysAdd), 
      source: source,
    };
  };

  const plainText = (treatmentDescription, source) => {
    return {
      description: `${treatmentDescription}`,
      date: NaN,
      source: source,
    }
  }

  //List of protocals for generating treatment list
  const treatmentList = () => {
    let treatments = [];
    const weight = birthWeight ? parseInt(birthWeight, 10) : 0;
    //Catch Invalid Inputs
    if (weight <= 0) treatments.push(plainText('Enter a valid Weight.'));
    if (gestAgeTotalDays <= 0) treatments.push(plainText('Enter a valid Gestational Age.'));
    if (dateOfBirth === '') treatments.push(plainText('Enter a valid DOB'));

    if (weight > 0 && gestAgeTotalDays > 0) {

      //Donor Breast Milk
      if (weight <= 1500){
        treatments.push(plainText('<b>Donor Breast Milk</b>', "https://publications.aap.org/pediatrics/article/139/1/e20163440/52000/Donor-Human-Milk-for-the-High-Risk-Infant"))
      }
      //Multivitamin
      treatments.push(simpleTreatment('<b>MVI/Fe</b> at full feeds and >/=14dol', 14));

      //ROP exam
      treatments.push(calculateRopExamDate())

      //Head Ultrasound
      if (gestAgeTotalDays <= 210){
        treatments.push(plainText("<b>Head Ultrasound ▼</b>", "https://publications.aap.org/pediatrics/article/146/5/e2020029082/75330/Routine-Neuroimaging-of-the-Preterm-Brain?autologincheck=redirected"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First HUS date @ 7 days:", 7))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second HUS date @ ≈ 1 month:", 30,))
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Third HUS date @ 1 term or discharge:', 40,))
      }

      //Postnatal Steroids
      if (gestAgeTotalDays <= 210){
        treatments.push(plainText("<b>Postnatal Steroids BPD Calc▼</b>", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7578580/"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First @ 14 days:", 14))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second @ 21 days:", 21))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second @ 28 days:", 28))
      }

      //Synagis
      if (gestAgeTotalDays <= 202){
        treatments.push(plainText("<b>Synagis</b>", "https://publications.aap.org/pediatrics/article/134/2/415/33013/Updated-Guidance-for-Palivizumab-Prophylaxis-Among"))
      }
      
      //Hepatitis b vaccine
      treatments.push(plainText("<b>Hepitatis B Vaccine</b>","https://publications.aap.org/redbook/pages/Immunization-Schedules"))
      if (weight >= 2000){
        treatments.push(plainText("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 dose within 24 hours of birth if medically stable"))
      } else if (weight < 2000){
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 dose at chronological age 1 month or hospital discharge", 30))
      }

      //NIPPV
      if (gestAgeTotalDays <= 216 && weight < 1500){
        treatments.push(plainText("<b>NIPPV</b>", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9874940/"))
      }
    }

    return treatments;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOutput(treatmentList());
  };

  return (
    <div className="NeoTool">
      <form onSubmit={handleSubmit}>
      <img src="/BSW_Baylor_University_Medical_Center_C_4C_White_Background__20210512_16553398_.jpg" alt="Baylor University Medical Center" />
        <h1>NICU Patient Treatment Generator</h1>
        <h2>(Baylor University Medical Center)</h2>
        <div className="input-group">
          <label htmlFor="gestational-age-weeks">Birth Gestational Age:</label>
          <input
            className="weeks-input"
            id="gestational-age-weeks"
            type="text"
            value={gestAgeWeeks}
            onChange={(e) => setGestAgeWeeks(e.target.value)}
            placeholder="Weeks"
          />
          <label className="label-inline" htmlFor="gestational-age-days">
            w
          </label>
          <input
            className="days-input"
            id="gestational-age-days"
            type="text"
            value={gestAgeDays}
            onChange={(e) => setGestAgeDays(e.target.value)}
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
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="birth-weight">Birth weight:</label>
          <input
            className="weight-input"
            id="birth-weight"
            type="text"
            value={birthWeight}
            onChange={(e) => setBirthWeight(e.target.value)}
            placeholder="Grams"
          />
          <label className="label-inline">g</label>
        </div>

        <button type="submit">Generate Treatment Dates</button>
      </form>

      <div className="output-section">
  {output.map((item, index) => {
    const dateClass = getDateClass(item.date || '');
    const sanitizedDescription = DOMPurify.sanitize(item.description || '');

    return (
      <div key={index} className={`${dateClass} item-container`}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} className="item-description" />
        {item.source && (
          <a href={item.source} target="_blank" rel="noopener noreferrer" className="item-source">ⓘ</a>
        )}
      </div>
    );
  })}
</div>


    </div>
  );
}

export default NeoTool;
