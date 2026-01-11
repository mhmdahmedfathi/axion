const BASE_URL = 'http://localhost:5111/api';

async function testSignupAndValidation() {
    console.log('--- Starting Signup and Validation Test ---');

    // 1. Test Signup without schoolId (Should succeed)
    const uniqueSuffix = Date.now();
    const newUser = {
        username: `user_${uniqueSuffix}`,
        email: `user_${uniqueSuffix}@example.com`,
        password: 'password123',
        role: 'school_admin'
    };

    let token = '';

    try {
        console.log(`\n1. Testing Signup without schoolId for ${newUser.username}...`);
        const res = await fetch(`${BASE_URL}/user/createUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const data = await res.json();
        
        if (res.ok && data.ok) {
            console.log('✅ Signup Successful');
            token = data.data.longToken;
        } else {
            console.error('❌ Signup Failed:', data);
            return;
        }
    } catch (err) {
        console.error('❌ Signup Error:', err.message);
        return;
    }

    // 2. Test Invalid ID Validation (Should fail with 400)
    // We'll try to get a school with an invalid ID
    const invalidId = 'invalid-id-123';
    try {
        console.log(`\n2. Testing Invalid ID Validation (Get School with id="${invalidId}")...`);
        const res = await fetch(`${BASE_URL}/school/getSchool?id=${invalidId}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.status === 400 || res.status === 404) {
             // 400 is expected for validation error on ID format.
            if((data.errors && data.errors.length > 0) || res.status === 400){
                 console.log(`✅ Validation Successful: Received expected error for invalid ID. Status: ${res.status}`);
                 console.log('Error Data:', JSON.stringify(data));
            } else {
                 console.warn(`⚠️ Received ${res.status} but content might not be validation error:`, data);
            }
        } else {
            console.error(`❌ Validation Test Error: Unexpected status ${res.status}`, data);
        }
    } catch (err) {
        console.error(`❌ Validation Test Network Error:`, err.message);
    }
}

testSignupAndValidation();
