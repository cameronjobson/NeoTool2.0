import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

function NeoTool() {
  const [gestAgeWeeks, setGestAgeWeeks] = useState('');
  const [gestAgeDays, setGestAgeDays] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [output, setOutput] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  // Convert specfic inputs from strings to integers
  const gestAgeTotalDays =
    (gestAgeWeeks ? parseInt(gestAgeWeeks, 10) * 7 : 0) +
    (gestAgeDays ? parseInt(gestAgeDays, 10) : 0);

  // Generate past dates in red, current dates in green
  const getDateClass = (date) => {
    if (!date || isNaN(Date.parse(date))) {
      return 'invalid-date';
    }

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
  
    const comparisonDate = new Date(date);
    comparisonDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
  
    if (currentDate.toUTCString() === comparisonDate.toUTCString()) {
      return 'current-date';
    } else if (comparisonDate < currentDate) {
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
      return traditionalTreatmentDate("<b>ROP</b> First Exam due near", weekNumber);
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
        treatments.push(traditionalTreatmentDate('<b>DBM</b> stop at 1500g and 35w', 35))
      }
      if (weight < 1500 && gestAgeTotalDays >= 245){
        treatments.push(plainText('<b>DBM</b> stop at 1500g', false))
      }
      if (weight >= 1500 && gestAgeTotalDays < 245){
        treatments.push(traditionalTreatmentDate('<b>DBM</b> stop at 35w', 35))
      }

      //Prolacta
      if (weight <= 1250 && gestAgeTotalDays < 230){
        treatments.push(traditionalTreatmentDate('<b>Prolacta</b> stop at 1500g and 33w', 33))
      }

      if (weight <= 1250 && gestAgeTotalDays >= 231){
        treatments.push(plainText('<b>Prolacta</b> stop at 1500g'), false)
      }

      //HMF/PTF
      if (weight >= 1251 && weight <= 2200){
        treatments.push(traditionalTreatmentDate('<b>HMF/PTF</b> until 3.5kg then D/C feeds ', 35))
      }
      //Multivitamin
      treatments.push(simpleTreatment('<b>Vit(s)/Fe</b> at full feeds and >/=14dol', 14));

      //NIPPV
      if (gestAgeTotalDays <= 209){
        treatments.push(plainText("<b>NIPPV</b> on admission", false))
      }

      //Trial of cpap
      if (gestAgeTotalDays <= 230){
        treatments.push(twoDayInputTraditionalTreatmentDate("Consider <b>Trial off CPAP</b> @33w-34w", 231, 238))
      }

      //Oxygen Challenge Test
      if (gestAgeTotalDays < 223){
        treatments.push(dayInputTraditionalTreatmentDate('<b>Oxygen Challenge Test</b> done on this night', 251))
      }
      

      //Postnatal Steroids
      if (gestAgeTotalDays <= 209){
        treatments.push(plainText("<b>PNS</b>  mod/sev BPD risk>60% at 14, 28d if on vent", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 days:", 14, "<b>PNS</b> mod/sev BPD risk>60% at 14 if on vent"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28 days:", 28, "<b>PNS</b> mod/sev BPD risk>60% at 28 if on vent"))
      }

      //Caffeine
      if(gestAgeTotalDays <= 216 || weight < 1500){
        treatments.push(plainText("<b>Caffeine</b>", true))
        //1st & 2nd Protocal
        if(gestAgeTotalDays >= 154 && gestAgeTotalDays <= 174){
          treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10mg/kg/d on admit increase to 20mg/kg/d dol 8 OR 24h prior to extubation if <8d", 8, "<b>Caffeine</b> 10mg/kg/d on admit increase to 20mg/kg/d dol 8 OR 24h prior to extubation if <8d"))
          treatments.push(twoDayInputTraditionalTreatmentDate("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop @ 34-37w if off PPV & 5d apnea free (off PPV: off CPAP & on <4lpm HFNC)", 238, 259, "<b>Caffeine</b> Stop @ 34-37w if off PPV & 5d apnea free (off PPV: off CPAP & on <4lpm HFNC)"))
        }

        //3rd Protocal
        if((gestAgeTotalDays >= 175 && gestAgeTotalDays <= 216) || (gestAgeTotalDays >= 217 && weight <= 1499)){
        treatments.push(plainText("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20mg/kg/d on admit", false, "<b>Caffeine</b> 20mg/kg/d on admit"))
        }

        //4th Protocal
        if((gestAgeTotalDays >= 175 && gestAgeTotalDays <= 216) || ((gestAgeTotalDays >= 217 && gestAgeTotalDays <= 237) && weight >= 1499)){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop at 34w if off PPV and 5d apnea free off PPV: off CPAP and on <4lpm HFNC)', 34, '<b>Caffeine</b> Stop at 34w if off PPV and 5d apnea free off PPV: off CPAP and on <4lpm HFNC)'))
        }

        //5th Protocal
        if (gestAgeTotalDays >= 238 && weight <= 1499){
        treatments.push(plainText("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop if off PPV and 5d apnea free (off PPV: off CPAP and on <4lpm HFNC)", false, "<b>Caffeine</b> Stop if off PPV and 5d apnea free (off PPV: off CPAP and on <4lpm HFNC)"))
        }

        //6th Protocal
        if ((gestAgeTotalDays <= 231 && weight < 1500) || (gestAgeTotalDays <= 216 && weight >= 1500)){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stop weight adjustments at 34w', 34, '<b>Caffeine</b> Stop weight adjustments at 34w'))
        }

        //7th Protocal
        if (gestAgeTotalDays <= 216 || weight < 1500){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ok to stop at 43w if remains on PPV', 43, '<b>Caffeine</b> Ok to stop at 43w if remains on PPV'))
        }
      }

      //Synagis
      if (gestAgeTotalDays <= 202){
        treatments.push(plainText("<b>Synagis</b> (if Beyfortus not available)", false))
      }

      if (gestAgeTotalDays >= 203 && gestAgeTotalDays <= 223){
        treatments.push(simpleTreatment("<b>Synagis</b> (if Beyfortus not available) if O2 at least first 28d after birth ", 28))
      }

      //ECHO
      if (gestAgeTotalDays <= 224){
        treatments.push(plainText("<b>ECHO</b> for PAH", true))
      }
      if (gestAgeTotalDays <= 195){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@32w if remains on ventilator', 32, '<b>ECHO</b> for PAH @32w if remains on ventilator'))
      }
      if (gestAgeTotalDays <= 224){
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@36w if remains on resp support', 36, '<b>ECHO</b> @36w if remains on resp support'))
      }

      //Head Ultrasound
      if (gestAgeTotalDays <= 216){
        treatments.push(plainText("<b>HUS</b>", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1wk HUS (7d)", 7, "<b>HUS</b> 1wk HUS (7d)"))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1mo HUS (30d)", 30, "<b>HUS</b> 1mo HUS (30d)"))
        treatments.push(traditionalTreatmentDate('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Term/DC HUS', 40, '<b>HUS</b> Term/DC HUS'))
      }

      //ROP exam
      if (weight <= 1500 || gestAgeTotalDays <= 216){
        treatments.push(calculateRopExamDate(false))
      }
      if ((gestAgeTotalDays >= 217 && gestAgeTotalDays <= 230) && (weight >= 1501 && weight <= 2000)){
        treatments.push(calculateRopExamDate(true))
      }

      //Nest
      if (gestAgeTotalDays <= 202){
        treatments.push(plainText("<b>Nest</b> F/U Tier 1b", false))
      }
      if ((gestAgeTotalDays >= 203 && gestAgeTotalDays <= 223) || (gestAgeTotalDays >= 224 && weight <= 1500)){
        treatments.push(plainText("<b>Nest</b> F/U Tier 2", false))
      }

      //Hepatitis b vaccine
      if (weight <= 1999){
        treatments.push(simpleTreatment("<b>Hep B Vaccine</b> at 30dol", 30,))
      }

      //Fluconazole Prophylaxis
      if (gestAgeTotalDays <= 174 && weight < 750){
        treatments.push(plainText("<b>Fluconazole Prophylaxis:</b>", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3mg/kg q72h until DC CVL or max 6w", 42, "<b>Fluconazole Prophylaxis:</b> 3mg/kg q72h until DC CVL or max 6w"))
      }

      //Vit K
      if (gestAgeTotalDays >= 154 && gestAgeTotalDays <= 174){
        treatments.push(simpleTreatment("<b>Vit K</b> 0.3mg IV q72h x 4 doses 0.5mg IM @ 14 dol", 14))
      }

      //TSH and Free T4:
      if (gestAgeTotalDays <= 216 || weight <= 1500){
        treatments.push(plainText("<b>TSH and Free T4:</b>", true))
        treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 days", 30, "<b>TSH and Free T4:</b> 30 days"))
        if (gestAgeTotalDays <= 174){
          treatments.push(simpleTreatment("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;60 days", 60, "<b>TSH and Free T4:</b> 60 days"))
        }
      }
      //cCMV screening
      treatments.push(simpleTreatment("<b>cCMV screening</b> @ 2w of age unless hearing screen pass both ears simultaneously", 14,))
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
  