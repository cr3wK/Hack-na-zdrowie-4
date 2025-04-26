export const handleLogin = async (email, password) => {
    try {
        const resDoc = await fetch('http://localhost:4000/doctor/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const resPat = await fetch('http://localhost:4000/patient/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (resDoc.ok && resPat.ok) {
            console.warn('Identical users in databases');
            return null;
        }

        if (resPat.ok) {
            const pat = await resPat.json();
            if (pat) {
                console.log('Auth passed (patient)');
                // localStorage.setItem('authToken', pat.token);
                return pat;
            } else {
                console.error('Invalid patient response format');
                return null;
            }
        }

        if (resDoc.ok) {
            const doc = await resDoc.json();
            if (doc) {
                console.log('Auth passed (doctor)');
                // localStorage.setItem('authToken', doc.token);
                return doc;
            } else {
                console.error('Invalid doctor response format');
                return null;
            }
        }

        console.log('No such user');
        return null;

    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
};
