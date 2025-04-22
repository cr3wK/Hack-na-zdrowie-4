export const handleLogin = async (username, password) => {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const user = await response.json();
            console.log('Auth passed');
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
// примерный auth надо будет еще доработать