import React, { useState } from 'react';

function NeoTool() {
    // State to hold the input values
    const [gestAgeWeeks, setGestAgeWeeks] = useState(0);
    const [gestAgeDays, setGestAgeDays] = useState(0);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [birthWeight, setBirthWeight] = useState(0);
    const [output, setOutput] = useState([]);  // To hold the treatment and form outputs

    const gestAgeTotal = gestAgeWeeks * 7 + gestAgeDays;
    const gestAgeTotalMillis = gestAgeTotal * 24 * 60 * 60 * 1000; // Convert to milliseconds

    const traditionalTreatmentDate = (treatmentDescription, CGA) => {
        const dob = new Date(dateOfBirth);
        const treatmentDate = new Date(dob.getTime() - gestAgeTotalMillis + (CGA * 7 * 24 * 60 * 60 * 1000));
        const formattedDate = treatmentDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    
        return treatmentDescription + " " + formattedDate;
    }

    const simpleTreatment = (treatmentDescription, daysAdd) => {
        const dob = new Date(dateOfBirth);
        const treatmentDate = new Date(dob.getTime() + (daysAdd * 24 * 60 * 60 * 1000));
        const formattedDate = treatmentDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    
        return treatmentDescription + " " + formattedDate;
    }

    const treatmentList = () => {
        let treatmentTexts = []
        if (birthWeight <= 0){
            treatmentTexts.push("*Enter a valid weight")
        } else if (gestAgeTotal <= 0){
            treatmentTexts.push("*Enter a valid Gestational Age")
        } else {
            if (birthWeight <= 1500){
            treatmentTexts.push(traditionalTreatmentDate("DEBM stop at 1500g and 35w", 35))
            }
            if (1 == 1){
                treatmentTexts.push(simpleTreatment("MVI/Fe at full feeds and >/=14dol", 14))
            }

    }
        return treatmentTexts;
    }

    // Function to handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setOutput([...treatmentList()]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Gestational Age (Weeks):
                        <input 
                            type="number" 
                            value={gestAgeWeeks}
                            onChange={e => setGestAgeWeeks(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Gestational Age (Days):
                        <input 
                            type="number" 
                            value={gestAgeDays}
                            onChange={e => setGestAgeDays(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Date of Birth:
                        <input 
                            type="date" 
                            value={dateOfBirth}
                            onChange={e => setDateOfBirth(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Birth Weight (grams):
                        <input 
                            type="number" 
                            value={birthWeight}
                            onChange={e => setBirthWeight(Number(e.target.value))}
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>

            <div>
                <h3>Output:</h3>
                {output.map((line, index) => <div key={index}>{line}</div>)}
            </div>
        </div>
    );
}

export default NeoTool;