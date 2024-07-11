import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

function NeoTool() {
  const [gestAgeWeeks, setGestAgeWeeks] = useState('');
  const [gestAgeDays, setGestAgeDays] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [output, setOutput] = useState([]);
  const [isSorted, setIsSorted] = useState(true);

  // Convert specfic inputs from strings to integers
  const gestAgeTotalDays =
    (gestAgeWeeks ? parseInt(gestAgeWeeks, 10) * 7 : 0) +
    (gestAgeDays ? parseInt(gestAgeDays, 10) : 0);

// Generate past dates in red, current dates in green
const getDateClass = (date) => {
  if (!date || isNaN(Date.parse(date))) {
    return 'invalid-date';
  }

  // Convert both dates to the same locale-specific date string format
  const currentDateStr = new Date().toLocaleDateString('en-US', );
  const comparisonDateStr = date.toLocaleDateString('en-US', { timeZone: 'UTC' });

  console.log("Current Date:", currentDateStr, "Comparison Date:", comparisonDateStr);

  if (currentDateStr === comparisonDateStr) {
    return 'current-date';
  } else if (new Date(comparisonDateStr) < new Date(currentDateStr)) {
    return 'past-date';
  } else {
    return 'future-date';
  }
};



  const formatDate = (date) => {
    // Format the date as a local date string without timezone conversion
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC' // Use UTC to avoid timezone offset
    });
  
    // Get the appropriate class based on the date
    const dateClass = getDateClass(date);
  
    // Wrap the formatted date in HTML <strong> tags and apply the class
    return `<strong class="${dateClass}">${formattedDate}</strong>`;
  };
  


  const calculateTreatmentDate = (dateOfBirth, daysOffset) => {
    const dob = new Date(dateOfBirth);
    dob.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
    dob.setUTCDate(dob.getUTCDate() + daysOffset);
    return dob;
  };

  //For treatment dates determined by gestagational age
  const traditionalTreatmentDate = (treatmentDescription, CGA, treatmentDescription2 = treatmentDescription) => {
    if (!dateOfBirth) return '';
    const dob = new Date(dateOfBirth);
    const treatmentDate = new Date(
      dob.getTime() +
      CGA * 7 * 24 * 60 * 60 * 1000 -
      gestAgeTotalDays * 24 * 60 * 60 * 1000
    );
    return {
      description: `${treatmentDescription} ${formatDate(treatmentDate)}`,
      description2: `${formatDate(treatmentDate)} ${treatmentDescription2}`,
      date: treatmentDate,
      source: null,
    };
  };

  //For treatments with 2 dates
  const twoDayInputTraditionalTreatmentDate = (treatmentDescription, CGA_days1, CGA_days2, treatmentDescription2 = treatmentDescription) => {
    if (!dateOfBirth) return '';
  
    const dob = new Date(dateOfBirth);
    const treatmentDate1 = new Date(
      dob.getTime() + CGA_days1 * 24 * 60 * 60 * 1000 - (gestAgeTotalDays * 24 * 60 * 60 * 1000)
    );

    const treatmentDate2 = new Date(
      dob.getTime() + CGA_days2 * 24 * 60 * 60 * 1000 - (gestAgeTotalDays * 24 * 60 * 60 * 1000)
    );
  
    return {
      description: `${treatmentDescription} ${formatDate(treatmentDate1)} - ${formatDate(treatmentDate2)}`,
      description2: `${formatDate(treatmentDate1)} - ${formatDate(treatmentDate2)} ${treatmentDescription2}`,
      date: treatmentDate1,
      source: null,
    };
  };

  //DayInputTraditionalTreatmentDate

  const dayInputTraditionalTreatmentDate = (treatmentDescription, CGA_days, treatmentDescription2 = treatmentDescription) => {
    if (!dateOfBirth) return '';
  
    const dob = new Date(dateOfBirth);
    const treatmentDate = new Date(
      dob.getTime() + CGA_days * 24 * 60 * 60 * 1000 - (gestAgeTotalDays * 24 * 60 * 60 * 1000)
    );
  
    return {
      description: `${treatmentDescription} ${formatDate(treatmentDate)}`,
      description2: `${formatDate(treatmentDate)} ${treatmentDescription2}`,
      date: treatmentDate,
      source: null,
    };
  };
  

  //Calculate ROP Dates
  const calculateRopExamDate = (R) => {
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
    if (R === false){
      return traditionalTreatmentDate("<b>ROP First Exam</b> due near this day", weekNumber);
    }
    else {
      return traditionalTreatmentDate("<b>ROP exam if unstable</b> First Exam due near", weekNumber);
    }

  }

  // For treatment dates determined by Days Of Life
  const simpleTreatment = (treatmentDescription, daysAdd, treatmentDescription2 = treatmentDescription) => {
    if (!dateOfBirth) return '';
    return {
      description: `${treatmentDescription} ${formatDate(calculateTreatmentDate(dateOfBirth, daysAdd))}`,
      description2: `${formatDate(calculateTreatmentDate(dateOfBirth, daysAdd))} ${treatmentDescription2}`,
      date: calculateTreatmentDate(dateOfBirth, daysAdd), 
      source: null,
    };
  };

// For protocals with no dates
  const plainText = (treatmentDescription, isHeader, treatmentDescription2 = treatmentDescription) => {
    return {
      description: `${treatmentDescription}`,
      description2: `${treatmentDescription2}`,
      date: NaN,
      source: null,
      isHeader: isHeader,
    }
  }

  //List of protocals for generating treatment list
  const treatmentList = () => {
    let treatments = [];
    const weight = birthWeight ? parseInt(birthWeight, 10) : 0;
    //Catch Invalid Inputs
    if (weight <= 0) treatments.push(plainText('Enter a valid Weight.', false));
    if (gestAgeTotalDays <= 0) treatments.push(plainText('Enter a valid Gestational Age.', false));
    if (dateOfBirth === '') treatments.push(plainText('Enter a valid DOB', false));

    if (weight > 0 && gestAgeTotalDays > 0) {

      //Donor Breast Milk
      if (weight < 1500 && gestAgeTotalDays < 245){
        treatments.push(traditionalTreatmentDate('<b>DBM</b> stop at 1500g and 35wk CGA', 35))
      }
      if (weight < 1500 && gestAgeTotalDays >= 245){
        treatments.push(plainText('<b>DBM</b> stop at 1500g', false))
      }
      if (weight >= 1500 && gestAgeTotalDays < 245){
        treatments.push(traditionalTreatmentDate('<b>DBM</b> stop at 35wk CGA', 35))
      }
      if (((weight >= 1501 && weight <= 2200) && (gestAgeTotalDays < 245)) || weight <= 1500){
        treatments.push(simpleTreatment('<b>DBM</b> meets criteria for', 0))
      }

      //Prolacta
      if (weight <= 1250){
        treatments.push(simpleTreatment('<b>Prolacta</b> meets criteria for', 0))
      }

      if (weight <= 1250 && gestAgeTotalDays < 230){
        treatments.push(traditionalTreatmentDate('<b>Prolacta</b> stop at 1500g and 33wk CGA', 33))
      }

      if (weight <= 1250 && gestAgeTotalDays >= 231){
        treatments.push(plainText('<b>Prolacta</b> stop at 1500g'), false)
      }

      //HMF/PTF
      if ((weight >= 1251 && weight <= 2200) && gestAgeTotalDays < 259){
        treatments.push(simpleTreatment('<b>HMF</b> meets criteria for', 0))
      }

      if ((weight >= 1251 && weight <= 2200) && gestAgeTotalDays < 259){
        treatments.push(traditionalTreatmentDate('<b>HMF/PTF</b> until 3kg and 37w then D/C feeds, 3.5k if mod/severe malnut', 37))
      }

      if ((weight >= 1251 && weight <= 2200) && gestAgeTotalDays >= 259){
        treatments.push(simpleTreatment('<b>HMF</b> meets criteria for, <b>HMF/PTF</b> until 3kg and then D/C feeds, 3.5k if mod/severe malnut', 0))
      }

      //Multivitamin
      treatments.push(simpleTreatment('<b>Vit(s)/Fe</b> at full feeds and >/=14 DOL', 14));

      //NIPPV
      if (gestAgeTotalDays <= 174){
        treatments.push(simpleTreatment('<b>JET</b> ventilator preferred mode', 0));
      }
      if (gestAgeTotalDays >= 175 && gestAgeTotalDays <= 209){
        treatments.push(simpleTreatment('<b>NIPPV</b> preferred if not on vent on admission', 0));
      }

      //Trial of cpap
      if (gestAgeTotalDays <= 223){
        treatments.push(twoDayInputTraditionalTreatmentDate("<b>CPAP preferred mode</b> of resp support up to 32-34 wk CGA", 224, 238))
      }

      //Oxygen Challenge Test
      if (gestAgeTotalDays < 223){
        treatments.push(dayInputTraditionalTreatmentDate('<b>Oxygen Challenge Test</b> done on this night', 251))
      }
      

      //Postnatal Steroids
      if (gestAgeTotalDays <= 209){
        treatments.push(plainText("<b>PNS</b>  mod/sev BPD risk>60% at 14, 28d if on vent", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 DOL:", 14, "<b>PNS</b> mod/sev BPD risk>60% at 14 DOL if on vent"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28 DOL:", 28, "<b>PNS</b> mod/sev BPD risk>60% at 28 DOL if on vent"))
      }

      //Caffeine
      if(gestAgeTotalDays <= 216 || weight < 1500){
        treatments.push(plainText("<b>Caffeine</b>", true))

        //4th Protocal
        if((gestAgeTotalDays >= 175 && gestAgeTotalDays <= 216) || ((gestAgeTotalDays >= 217 && gestAgeTotalDays <= 237) && weight >= 1499)){
          treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop at 34w if off PPV and 5d apnea free off PPV: off CPAP and on <4lpm HFNC)', 34, '<b>Caffeine</b> Stop at 34w if off PPV and 5d apnea free off PPV: off CPAP and on <4lpm HFNC)'))
          }

        //6th Protocal MOVING TO BEFORE 2 DATE FOR FORMATING PURPOSES
        if ((gestAgeTotalDays <= 231 && weight < 1500) || (gestAgeTotalDays <= 216 && weight >= 1500)){
          treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop weight adjustments at 34wk CGA', 34, '<b>Caffeine</b> Stop weight adjustments at 34wk CGA'))
          }



        //1st & 2nd Protocal
        if(gestAgeTotalDays >= 154 && gestAgeTotalDays <= 174){
          treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10mg/kg/day on admit", 0, "<b>Caffeine</b> 10mg/kg/day on admit"))
          treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;increase to 20mg/kg/day on DOL 8 OR 24h prior to extubation if < DOL 8", 8, "<b>Caffeine</b> increase to 20mg/kg/day on DOL 8 OR 24h prior to extubation if < DOL 8"))
          treatments.push(twoDayInputTraditionalTreatmentDate("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stop @ 34-47 wk CGA if on <4 LPM HFNC & >=5 days apnea free", 238, 259, "<b>Caffeine</b> stop @ 34-47 wk CGA if on <4 LPM HFNC & >=5 days apnea free"))
        }

        //3rd Protocal
        if((gestAgeTotalDays >= 175 && gestAgeTotalDays <= 216) || (gestAgeTotalDays >= 217 && weight <= 1499)){
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20mg/kg/day on admit", 0, "<b>Caffeine</b> 20mg/kg/day on admit"))
        }



        //5th Protocal
        if (gestAgeTotalDays >= 238 && weight <= 1499){
        treatments.push(plainText("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop if off PPV and 5d apnea free (off PPV: off CPAP and on <4lpm HFNC)", false, "<b>Caffeine</b> Stop if off PPV and 5d apnea free (off PPV: off CPAP and on <4lpm HFNC)"))
        }

        

        //7th Protocal
        if (gestAgeTotalDays <= 216 || weight < 1500){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ok to stop at 43wk CGA even if remains on PPV', 43, '<b>Caffeine</b> Ok to stop at 43wk CGA even if remains on PPV'))
        }
      }

      //Synagis
      if (gestAgeTotalDays <= 202){
        treatments.push(plainText("<b>RSV Prophylaxis</b> during RSV season", false))
      }

      if (gestAgeTotalDays >= 203 && gestAgeTotalDays <= 223){
        treatments.push(simpleTreatment("<b>RSV Prophylaxis</b> if O2 up to this day (at least first 28d after birth) during RSV season", 28))
        treatments.push(plainText("<b>RSV Prophylaxis</b> if O2 at least first 28d after birth during RSV season", false))
      }

      //ECHO
      if (gestAgeTotalDays <= 224){
        treatments.push(plainText("<b>ECHO</b> for PAH", true))
      }
      if (gestAgeTotalDays <= 195){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; at 32wk CGA if remains on ventilator on a convenient weekday', 32, '<b>ECHO</b> at 32wk CGA if remains on ventilator on a convenient weekday'))
      }
      if (gestAgeTotalDays <= 224){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;at 36wk CGA if remains on resp support on a convenient weekday', 36, '<b>ECHO</b> at 36wk CGA if remains on resp support on a convenient weekday'))
      }

      //Head Ultrasound
      if (gestAgeTotalDays <= 216){
        treatments.push(plainText("<b>HUS</b>", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;around 1 week of age on a convenient weekday", 7, "<b>HUS</b> around 1 week of age on a convenient weekday"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;around 1 month of age on a convenient weekday", 30, "<b>HUS</b> around 1 month of age on a convenient weekday"))
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Term/DC (40wk CGA) on a convenient weekday', 40, '<b>HUS</b> Term/DC (40wk CGA) on a convenient weekday'))
      }

      //ROP exam
      if (weight <= 1500 || gestAgeTotalDays <= 216){
        treatments.push(calculateRopExamDate(false))
      }
      if ((gestAgeTotalDays >= 217) && (weight >= 1501 && weight <= 2000)){
        treatments.push(simpleTreatment("<b>ROP First Exam</b> (if risk factors) due near this day", 28))
      }

      if ((birthWeight > 1500 && birthWeight <= 2000)){
        treatments.push(simpleTreatment("<b>Consider ROP exam</b> if infant needed: 1) >21% FiO2 for >72hr; 2) Needed inotropic support for hypotension, culture proven sepsis, NEC, Meningitis; 3) At the discretion of the Neonatologist", 4 * 7))
      }

      //Nest
      if (gestAgeTotalDays <= 202){
        treatments.push(plainText("<b>Nest</b> F/U Tier 1b (or higher tier if meets criteria at discharge)", false))
      }
      if ((gestAgeTotalDays >= 203 && gestAgeTotalDays <= 223) || (gestAgeTotalDays >= 224 && weight <= 1500)){
        treatments.push(plainText("<b>Nest</b> F/U Tier 2 (or higher tier if meets criteria at discharge)", false))
      }

      //Hepatitis b vaccine
      if (weight <= 1999){
        treatments.push(simpleTreatment("<b>Hep B Vaccine</b> at 30dol (if not given by 35 DOL, generally don't give and wait for 2-month vaccines)", 30,))
      }
      treatments.push(simpleTreatment("<b>2 month Vaccines</b>", 60,))
      

      //Fluconazole Prophylaxis
      if (gestAgeTotalDays <= 174 || weight <= 749){
        treatments.push(plainText("<b>Fluconazole Prophylaxis:</b>", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Meets criteria", 0, "<b>Fluconazole Prophylaxis:</b> Meets criteria"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3mg/kg q72h until DC CVL or max 6wk", 42, "<b>Fluconazole Prophylaxis:</b> 3mg/kg q72h until DC CVL or max 6wk"))
      }

      //Vit K
      if (gestAgeTotalDays >= 154 && gestAgeTotalDays <= 174){
        treatments.push(simpleTreatment("<b>Vit K</b> 0.3mg IV q72h x 4 doses", 0))
        treatments.push(simpleTreatment("<b>Vit K</b> Vit K 0.5mg IM at 14 DOL", 14))
      }

      //TSH and Free T4:
      if (gestAgeTotalDays <= 216 || weight <= 1500){
        treatments.push(plainText("<b>TSH and Free T4</b> (on a convenient weekday)", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 month", 30, "<b>TSH and Free T4</b> around 1 month of age on a convenient weekday"))
        if (gestAgeTotalDays <= 174){
          treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 months", 60, "<b>TSH and Free T4</b> around 2 months on a convenient weekday"))
        }
      }
      //cCMV screening
      treatments.push(simpleTreatment("<b>cCMV screening</b> at 2wk of age unless hearing screen pass both ears simultaneously", 14,))
      treatments.push(plainText('<b>Audiology Referral</b> at 9 months of age if NICU stay > 5 days. Pedi to arrange (erase "Pedi to arrange" if discharging from CCMC)'))

      //Car Seat Testing

      if (gestAgeTotalDays < 37 * 7 || birthWeight < 2500){
        treatments.push(plainText('<b>Car Seat Test</b> before discharge due to GA < 37 weeks and/or BW < 2500g'))
      }
    }

    return isSorted ? sortAndFilterTreatments(treatments) : treatments;
  };

// Helper function to determine if the date is valid FOR SORT METHOD
const isValidDate = (date) => {
  if (date instanceof Date) {
      return !isNaN(date.getTime()); // Check valid Date object
  } else if (typeof date === 'number') {
      return !isNaN(date); // Check non-NaN numbers
  }
  return false;
};

// Sorts the array by date
const sortAndFilterTreatments = (treatments) => {
  // First filter out any objects with isHeader true
  const filteredTreatments = treatments.filter(item =>
      !(typeof item === 'object' && item !== null && item.isHeader === true)
  );

  // Sort the remaining items, moving invalid or less relevant ones to the end
  return filteredTreatments.sort((a, b) => {
      // Check if a or b is an object with a valid date
      const validDateA = typeof a === 'object' && a !== null && isValidDate(a.date);
      const validDateB = typeof b === 'object' && b !== null && isValidDate(b.date);

      if (validDateA && validDateB) {
          // Both have valid dates, compare them
          const dateA = a.date instanceof Date ? a.date.getTime() : a.date;
          const dateB = b.date instanceof Date ? b.date.getTime() : b.date;
          return dateA - dateB;
      } else if (validDateA) {
          // Only a has a valid date, b goes to the end
          return -1;
      } else if (validDateB) {
          // Only b has a valid date, a goes to the end
          return 1;
      } else {
          // Neither a nor b has a valid date, maintain original order (stable sort)
          return 0;
      }
  });
};

// Toggles the sort useState
const toggleSort = () => {
  setIsSorted(!isSorted);
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setOutput(treatmentList());
  };

  return (
    <div className="NeoTool">
      <form onSubmit={handleSubmit}>
        <img src="/pediatrixlogo.jpg" alt="Baylor University Medical Center" />
        <h1>NICU Patient Treatment Generator</h1>
        <h2>(Not Affiliated with Pediatrix)</h2>
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
          <label className="label-inline" htmlFor="gestational-age-days">w</label>
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
        <div className="button-container">
  <button type="submit" className="generate-button">
    Generate Treatment Dates
  </button>
  <button onClick={toggleSort} className="toggle-sort-button">
    {isSorted ? 'Sort By Treatment' : 'Sort By Date'}
  </button>
</div>

      </form>
  
      <div className="output-section">
        {output.map((item, index) => {
          const dateClass = getDateClass(item.date || '');
          const sanitizedDescription = DOMPurify.sanitize(isSorted ? item.description2 : item.description || '');
  
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
  
      {/* Footer Section */}
      <footer className="NeoTool-footer">
        <p>Made by Cameron Jobson</p>
        <p>Contact info: <br/>Email: <a href="mailto:cameronajobson@gmail.com">cameronajobson@gmail.com</a> <br/>Phone: <a href="tel:+18173198996">817-319-8996</a></p>
      </footer>
    </div>
  );
}
  export default NeoTool;
  
